import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend | null = null;
  private transporter: Transporter | null = null;
  private readonly from: string;

  constructor(private readonly config: ConfigService) {
    this.from = config.get<string>('MAIL_FROM', 'Hub Central <onboarding@resend.dev>');

    const apiKey =
      config.get<string>('RESEND_API_KEY')?.trim() ||
      config.get<string>('SMTP_PASS')?.trim();

    if (apiKey?.startsWith('re_')) {
      this.resend = new Resend(apiKey);
      this.logger.log(`Resend API ativo (from=${this.from})`);
      return;
    }

    const host = config.get<string>('SMTP_HOST');
    const port = Number(config.get<string>('SMTP_PORT', '465'));
    const user = config.get<string>('SMTP_USER');
    const pass = config.get<string>('SMTP_PASS');

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
      this.logger.log(`SMTP ativo (${host}:${port}, from=${this.from})`);
    } else {
      this.logger.warn(
        'E-mail não configurado — defina RESEND_API_KEY (re_...) ou SMTP_* no Render. Códigos só no log.',
      );
    }
  }

  private logCodeFallback(to: string, code: string, reason: string) {
    this.logger.warn(`[fallback] Código para ${to}: ${code} — ${reason}`);
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

    if (this.resend) {
      const { data, error } = await this.resend.emails.send({
        from: this.from,
        to: [to],
        subject,
        html,
        text,
      });

      if (error) {
        this.logger.error(`Resend rejeitou envio para ${to}: ${error.message}`, JSON.stringify(error));
        this.logCodeFallback(
          to,
          code,
          'sem domínio verificado? use MAIL_FROM=Hub Central <onboarding@resend.dev> e destinatário = e-mail da conta Resend',
        );
        return;
      }

      this.logger.log(`E-mail enviado via Resend para ${to} (id=${data?.id})`);
      return;
    }

    if (this.transporter) {
      try {
        await this.transporter.sendMail({ from: this.from, to, subject, text, html });
        this.logger.log(`E-mail de verificação enviado para ${to}`);
      } catch (err) {
        this.logger.error(`Falha SMTP para ${to}`, err instanceof Error ? err.stack : err);
        this.logCodeFallback(to, code, 'verifique SMTP_* ou use RESEND_API_KEY');
      }
      return;
    }

    this.logCodeFallback(to, code, 'configure RESEND_API_KEY no Render');
  }
}
