import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { MessageModule } from './modules/message/message.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { HireRequestsModule } from './modules/hire-requests/hire-requests.module';
import { PricingPlanModule } from './modules/pricing/pricing.module';
import { OwnerModule } from './modules/owner/owner.module';
import { ProviderModule } from './modules/provider/provider.module';
import { PetsModule } from './modules/pets/pets.module';
import { HealthModule } from './modules/health/health.module';‚
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
      useFactory: (config: ConfigService) => ({
        type: 'postgres',

        host: config.get<string>('DATABASE_HOST') || 'localhost',
        port: Number(config.get<string>('DATABASE_PORT') || 5432),

        username: config.get<string>('DATABASE_USER') || 'ab',
        password: config.get<string>('DATABASE_PASSWORD') || '',
        database: config.get<string>('DATABASE_NAME') || 'petcare',

        autoLoadEntities: true,
        synchronize: true, // ⚠️ disable in production
      }),
    }),

    // Feature modules
    UserModule,
    AuthModule,
    MessageModule,
    PricingPlanModule,
    OwnerModule,
    ProviderModule,
    PetsModule,
    HealthModule,
    HireRequestsModule,
    BookingsModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}