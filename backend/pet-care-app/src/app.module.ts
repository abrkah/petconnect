import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { MessageModule } from './modules/message/message.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { HireRequestsModule } from './modules/hire-requests/hire-requests.module';
import { OwnerModule } from './modules/owner/owner.module';
import { ProviderModule } from './modules/provider/provider.module';
import { PetsModule } from './modules/pets/pets.module';
import { HealthModule } from './modules/health/health.module';
import { PetNotesModule } from './modules/pet-notes/pet-notes.module';
import { ProviderAvailabilityModule } from './modules/provider-availability/provider-availability.module';
import { NewsletterModule } from './modules/newsletter/newsletter.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Load .env globally
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database connection
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get<string>('DATABASE_URL');
        const sslEnabled =
          config.get<string>('DATABASE_SSL') === 'true' ||
          (databaseUrl?.includes('sslmode=require') ?? false);

        const shared = {
          type: 'postgres' as const,
          autoLoadEntities: true,
          synchronize: config.get<string>('DATABASE_SYNC') !== 'false',
          ...(sslEnabled ? { ssl: { rejectUnauthorized: false } } : {}),
        };

        if (databaseUrl) {
          return { ...shared, url: databaseUrl };
        }

        return {
          ...shared,
          host: config.get<string>('DATABASE_HOST') || 'localhost',
          port: Number(config.get<string>('DATABASE_PORT') || 5432),
          username: config.get<string>('DATABASE_USER') || 'ab',
          password: config.get<string>('DATABASE_PASSWORD') || '',
          database: config.get<string>('DATABASE_NAME') || 'petcare',
        };
      },
    }),

    // Feature modules
    UserModule,
    AuthModule,
    MessageModule,
    OwnerModule,
    ProviderModule,
    PetsModule,
    HealthModule,
    HireRequestsModule,
    BookingsModule,
    PetNotesModule,
    ProviderAvailabilityModule,
    NewsletterModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}