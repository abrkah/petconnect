import {
  BadGatewayException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import { NewsletterSubscriber } from './entities/newsletter-subscriber.entity';
import { SubscribeNewsletterDto } from './dto/subscribe-newsletter.dto';

@Injectable()
export class NewsletterService {
  constructor(
    @InjectRepository(NewsletterSubscriber)
    private readonly subscribers: Repository<NewsletterSubscriber>,
  ) {}

  async subscribe({ email }: SubscribeNewsletterDto) {
    const normalized = email.trim().toLowerCase();
    const existing = await this.subscribers.findOne({
      where: { email: normalized },
    });

    if (existing) {
      return {
        message: 'You are already subscribed to product updates.',
        alreadySubscribed: true,
      };
    }

    await this.subscribers.save({ email: normalized });
    await this.sendWelcomeEmail(normalized);

    return {
      message: 'Subscription confirmed! Check your inbox for a welcome email.',
      alreadySubscribed: false,
    };
  }

  private async sendWelcomeEmail(email: string) {
    const user = process.env.EMAIL_USER?.trim();
    const pass = process.env.EMAIL_PASS?.trim();

    if (!user || !pass) {
      throw new ServiceUnavailableException(
        'Email delivery is not configured on the server.',
      );
    }

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass },
      });

      await transporter.sendMail({
        from: user,
        to: email,
        subject: 'Welcome to PetConnect product updates',
        html: `
          <h2>Thanks for subscribing</h2>
          <p>You will receive occasional notes about new PetConnect features—no spam.</p>
          <p>If you did not request this, you can ignore this email.</p>
        `,
      });
    } catch {
      throw new BadGatewayException(
        'Could not send the confirmation email. Please try again.',
      );
    }
  }
}
