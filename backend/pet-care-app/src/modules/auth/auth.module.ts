import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleAuthGuard } from '../guards/google.guard'; 
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { OwnerModule } from '../owner/owner.module';
import { GoogleStrategy } from './strategy/google.strategy'; 
import { LocalStrategy } from './strategy/local.strategy';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import jwtConfig from './config/jwt.config';
import { JWTStrategy } from './strategy/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../guards/jwt-auth/jwt-auth.guard'; 
import { RolesGuard } from '../guards/roles/roles.guard';

const googleOAuthEnabled =
  !!process.env.GOOGLE_CLIENT_ID?.trim() &&
  !!process.env.GOOGLE_CLIENT_SECRET?.trim();

const googleAuthProviders = googleOAuthEnabled
  ? [GoogleStrategy, GoogleAuthGuard]
  : [];

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    forwardRef(() => UserModule),
    OwnerModule,
    ConfigModule.forFeature(jwtConfig),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [
    AuthService,
    ...googleAuthProviders,
    LocalStrategy,
    JWTStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService, JwtModule,UserModule],
})
export class AuthModule {}
