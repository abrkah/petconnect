import { BadGatewayException, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

export type SendMailOptions = {
  to: string;
  subject: string;
  html: string;
};

@Injectable()
export class MailService {
  private transporter: Transporter | null = null;

  isConfigured(): boolean {
    return !!(process.env.EMAIL_USER?.trim() && process.env.EMAIL_PASS?.trim());
  }

  private getTransporter(): Transporter {
    if (this.transporter) {
      return this.transporter;
    }

    const user = process.env.EMAIL_USER?.trim();
    const pass = process.env.EMAIL_PASS?.trim();

    if (!user || !pass) {
      throw new BadGatewayException(
        'Email is not configured. Set EMAIL_USER and EMAIL_PASS in .env',
      );
    }

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });

    return this.transporter;
  }

  async send({ to, subject, html }: SendMailOptions): Promise<void> {
    const from = process.env.EMAIL_USER?.trim();
    if (!from) {
      throw new BadGatewayException(
        'Email is not configured. Set EMAIL_USER and EMAIL_PASS in .env',
      );
    }

    try {
      const transporter = this.getTransporter();
      await transporter.sendMail({ from, to, subject, html });
    } catch {
      throw new BadGatewayException(
        'Could not send email. Check EMAIL_USER and EMAIL_PASS.',
      );
    }
  }
}
