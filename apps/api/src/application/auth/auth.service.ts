import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { EmailService } from '../../infrastructure/email/email.service';
import { ConfigService } from '@nestjs/config';

const CODE_TTL_MS = 15 * 60 * 1000;

@Injectable()
export class AuthService {
  private readonly googleClient: OAuth2Client;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    config: ConfigService,
  ) {
    this.googleClient = new OAuth2Client(config.get<string>('GOOGLE_CLIENT_ID'));
  }

  private issueToken(user: { id: string; email: string; role: string; name?: string | null }) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name ?? undefined,
      },
    };
  }

  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  private generateCode() {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  async register(email: string, password: string, name?: string) {
    const normalized = this.normalizeEmail(email);
    const existing = await this.prisma.user.findUnique({ where: { email: normalized } });
    if (existing) {
      throw new ConflictException('Este e-mail já está cadastrado');
    }

    await this.prisma.emailVerification.deleteMany({ where: { email: normalized } });

    const code = this.generateCode();
    const codeHash = await bcrypt.hash(code, 10);
    const passwordHash = await bcrypt.hash(password, 10);

    await this.prisma.emailVerification.create({
      data: {
        email: normalized,
        codeHash,
        passwordHash,
        name: name?.trim() || null,
        expiresAt: new Date(Date.now() + CODE_TTL_MS),
      },
    });

    await this.emailService.sendVerificationCode(normalized, code, name);
    return {
      message: 'Código de verificação enviado para o seu e-mail',
      expiresInMinutes: 15,
    };
  }

  async resendCode(email: string) {
    const normalized = this.normalizeEmail(email);
    const pending = await this.prisma.emailVerification.findFirst({
      where: { email: normalized },
      orderBy: { createdAt: 'desc' },
    });
    if (!pending) {
      throw new BadRequestException('Nenhum cadastro pendente para este e-mail');
    }

    const code = this.generateCode();
    await this.prisma.emailVerification.update({
      where: { id: pending.id },
      data: {
        codeHash: await bcrypt.hash(code, 10),
        expiresAt: new Date(Date.now() + CODE_TTL_MS),
      },
    });

    await this.emailService.sendVerificationCode(normalized, code, pending.name ?? undefined);
    return { message: 'Novo código enviado', expiresInMinutes: 15 };
  }

  async verifyRegistration(email: string, code: string) {
    const normalized = this.normalizeEmail(email);
    const pending = await this.prisma.emailVerification.findFirst({
      where: { email: normalized },
      orderBy: { createdAt: 'desc' },
    });

    if (!pending || pending.expiresAt < new Date()) {
      throw new BadRequestException('Código expirado ou inválido. Solicite um novo cadastro.');
    }

    const valid = await bcrypt.compare(code, pending.codeHash);
    if (!valid) {
      throw new BadRequestException('Código incorreto');
    }

    const user = await this.prisma.user.create({
      data: {
        email: normalized,
        password: pending.passwordHash,
        name: pending.name,
        emailVerified: true,
        authProvider: 'local',
        role: 'admin',
      },
    });

    await this.prisma.emailVerification.deleteMany({ where: { email: normalized } });
    return this.issueToken(user);
  }

  async loginWithGoogle(credential: string) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      throw new BadRequestException('Login com Google não configurado no servidor');
    }

    let payload;
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: credential,
        audience: clientId,
      });
      payload = ticket.getPayload();
    } catch {
      throw new UnauthorizedException('Token Google inválido');
    }

    if (!payload?.email) {
      throw new UnauthorizedException('E-mail não disponível na conta Google');
    }

    const email = this.normalizeEmail(payload.email);
    let user = await this.prisma.user.findFirst({
      where: { OR: [{ googleId: payload.sub }, { email }] },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          googleId: payload.sub,
          name: payload.name ?? null,
          emailVerified: payload.email_verified ?? true,
          authProvider: 'google',
          role: 'admin',
        },
      });
    } else if (!user.googleId) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: payload.sub,
          emailVerified: true,
          name: user.name ?? payload.name ?? null,
        },
      });
    }

    return this.issueToken(user);
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: this.normalizeEmail(email) },
    });
    if (!user?.password || !(await bcrypt.compare(password, user.password))) {
      return null;
    }
    if (!user.emailVerified) {
      throw new UnauthorizedException('E-mail não verificado. Conclua o cadastro ou use Google.');
    }
    return { id: user.id, email: user.email, role: user.role, name: user.name };
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return this.issueToken(user);
  }
}
