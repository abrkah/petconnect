import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from '../auth/config/jwt.config';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { Message } from './entities/message.entity';
import { User } from '../user/entities/user.entity';
import { OwnerProfile } from '../owner/entities/owner.entity';
import { ProviderProfile } from '../provider/entities/provider.entity';
import { HireRequest } from '../hire-requests/entities/hire-request.entity';
import { ProviderPetAssignment } from '../provider-pet-assignment/entities/provider-pet-assignment.entity';
import { PresenceService } from './presence.service';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Message,
      User,
      OwnerProfile,
      ProviderProfile,
      HireRequest,
      ProviderPetAssignment,
    ]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  controllers: [MessageController],
  providers: [MessageService, PresenceService, ChatGateway],
  exports: [MessageService, ChatGateway],
})
export class MessageModule {}
