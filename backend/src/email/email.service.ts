import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend | null = null;
  private from: string;
  private appUrl: string;

  constructor(private config: ConfigService) {
    const apiKey = config.get<string>('RESEND_API_KEY');
    if (apiKey) this.resend = new Resend(apiKey);
    this.from = config.get('EMAIL_FROM', 'Taskyy <noreply@taskyy.app>');
    this.appUrl = config.get('FRONTEND_URL', 'http://localhost:3000');
  }

  get isConfigured() {
    return this.resend !== null;
  }

  async sendVerificationEmail(to: string, token: string): Promise<void> {
    const link = `${this.appUrl}/verify-email?token=${token}`;

    if (!this.resend) {
      console.log(`[Email] Verification link for ${to}: ${link}`);
      return;
    }

    await this.resend.emails.send({
      from: this.from,
      to,
      subject: 'Verify your Taskyy account',
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:40px 32px;background:#fff;">
          <div style="margin-bottom:28px;">
            <span style="display:inline-block;width:36px;height:36px;background:#f97316;border-radius:9px;text-align:center;line-height:36px;font-weight:700;font-size:16px;color:#fff;">T</span>
          </div>
          <h2 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#1a1a1a;">Verify your email</h2>
          <p style="margin:0 0 28px;font-size:15px;color:#555;line-height:1.55;">
            Click the button below to verify your email and activate your Taskyy account. This link expires in 24 hours.
          </p>
          <a href="${link}" style="display:inline-block;padding:13px 28px;background:#f97316;color:#fff;border-radius:9px;text-decoration:none;font-weight:600;font-size:15px;">
            Verify email →
          </a>
          <p style="margin:28px 0 0;font-size:12px;color:#aaa;">
            If you didn't create a Taskyy account, you can ignore this email.
          </p>
        </div>
      `,
    });
  }
}
