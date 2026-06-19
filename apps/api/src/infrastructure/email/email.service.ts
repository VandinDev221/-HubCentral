import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter | null = null;
  private readonly from: string;

  constructor(private readonly config: ConfigService) {
    const host = config.get<string>('SMTP_HOST');
    const port = Number(config.get<string>('SMTP_PORT', '465'));
    const user = config.get<string>('SMTP_USER');
    const pass = config.get<string>('SMTP_PASS');
    this.from = config.get<string>('MAIL_FROM', 'Hub Central <onboarding@resend.dev>');

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
      this.logger.log(`SMTP ativo (${host}:${port}, from=${this.from})`);
    } else {
      const missing = [
        !host && 'SMTP_HOST',
        !user && 'SMTP_USER',
        !pass && 'SMTP_PASS',
      ].filter(Boolean);
      this.logger.warn(
        `SMTP não configurado (${missing.join(', ') || 'variáveis vazias'}) — códigos só no log.`,
      );
    }
  }

  async sendVerificationCode(to: string, code: string, name?: string) {
    const greeting = name ? `Olá, ${name}` : 'Olá';
    const subject = 'Seu código de verificação — Hub Central';
    const text = `${greeting}!\n\nSeu código de verificação é: ${code}\n\nVálido por 15 minutos.\n\nSe você não solicitou este cadastro, ignore este e-mail.`;
    const html = `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">Hub Central</h2>
        <p>${greeting}!</p>
        <p>Use o código abaixo para concluir seu cadastro:</p>
        <p style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #0f172a;">${code}</p>
        <p style="color: #64748b; font-size: 14px;">Válido por 15 minutos.</p>
      </div>`;

    if (!this.transporter) {
      this.logger.log(`[sem SMTP] Código para ${to}: ${code}`);
      return;
    }

    try {
      await this.transporter.sendMail({ from: this.from, to, subject, text, html });
      this.logger.log(`E-mail de verificação enviado para ${to}`);
    } catch (err) {
      this.logger.error(`Falha ao enviar e-mail para ${to}`, err instanceof Error ? err.stack : err);
      throw err;
    }
  }
}
