import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

    return {
      message: 'Thanks for subscribing! We will send occasional product updates.',
      alreadySubscribed: false,
    };
  }
}
