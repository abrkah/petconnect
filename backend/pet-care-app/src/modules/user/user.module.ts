import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from '../common/file.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
   JwtModule.register({
  secret: process.env.JWT_SECRET,
  signOptions: {
    expiresIn: Number(process.env.JWT_EXPIRE_IN) || 3600,
  },
}),
  ],
  providers: [UserService, FileService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}