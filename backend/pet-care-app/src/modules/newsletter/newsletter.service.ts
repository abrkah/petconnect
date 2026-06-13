import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailService } from '../common/mail.service';
import { NewsletterSubscriber } from './entities/newsletter-subscriber.entity';
import { SubscribeNewsletterDto } from './dto/subscribe-newsletter.dto';

@Injectable()
export class NewsletterService {
  constructor(
    @InjectRepository(NewsletterSubscriber)
    private readonly subscribers: Repository<NewsletterSubscriber>,
    private readonly mailService: MailService,
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
        emailSent: false,
      };
    }

    await this.subscribers.save({ email: normalized });

    let emailSent = false;
    if (this.mailService.isConfigured()) {
      await this.mailService.send({
        to: normalized,
        subject: 'Welcome to PetConnect product updates',
        html: `
          <h2>Thanks for subscribing</h2>
          <p>You will receive occasional notes about new PetConnect features—no spam.</p>
          <p>If you did not request this, you can ignore this email.</p>
        `,
      });
      emailSent = true;
    }

    return {
      message: emailSent
        ? 'Subscription confirmed! Check your inbox for a welcome email.'
        : 'Thanks for subscribing! We will send occasional product updates.',
      alreadySubscribed: false,
      emailSent,
    };
  }
}
