import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Put,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { Response as ExpressResponse } from 'express';
import * as bcrypt from 'bcrypt';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream, existsSync } from 'fs';
import * as path from 'path';
import { lookup } from 'mime-types';
import { FileService } from '../common/file.service';
import { JwtAuthGuard } from '../guards/jwt-auth/jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Public } from '../auth/decorator/public.decorator';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly fileService: FileService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // =========================
  // CHANGE PASSWORD
  // =========================
  @Put('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change Password' })
  async changePassword(
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
    @Req() req,
  ) {
    const user = await this.userRepository.findOne({
      where: { id: req.user.id, isDeleted: false },
    });

    if (!user) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new BadRequestException('Old password incorrect');

    user.password = await bcrypt.hash(newPassword, 12);

    await this.userRepository.save(user);

    return { message: 'Password updated successfully' };
  }

  // =========================
  // RESET PASSWORD
  // =========================
  @Public()
  @Put('reset-password')
  @ApiOperation({ summary: 'Reset Password' })
  async resetPassword(
    @Body('email') email: string,
    @Body('newPassword') newPassword: string,
  ) {
    const user = await this.userRepository.findOne({
      where: { email, isDeleted: false },
    });

    if (!user) throw new NotFoundException('User not found');

    user.password = await bcrypt.hash(newPassword, 12);

    await this.userRepository.save(user);

    return { message: 'Password reset successfully' };
  }

  // =========================
  // GET ALL USERS
  // =========================
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  async getAllUsers() {
    return this.userRepository.find({
      where: { isDeleted: false },
      relations: ['ownerProfile', 'providerProfile'],
    });
  }

  // =========================
  // GET PROFILE
  // =========================
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    const user = await this.userRepository.findOne({
      where: { id: req.user.id, isDeleted: false },
      relations: ['ownerProfile', 'providerProfile'],
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  // =========================
  // GET USER BY ID
  // =========================
  @Get(':id')
  async getById(@Param('id') id: string) {
    const user = await this.userRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['ownerProfile', 'providerProfile'],
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  // =========================
  // UPDATE PROFILE
  // =========================
  @Put('profile/:id')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.userRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, updateUserDto);

    await this.userRepository.save(user);

    return { message: 'Profile updated successfully' };
  }

  // =========================
  // SOFT DELETE USER (NEW)
  // =========================
  @Put('soft-delete/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Soft delete user' })
  async softDelete(@Param('id') id: string) {
    const user = await this.userRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!user) throw new NotFoundException('User not found');

    user.isDeleted = true;

    await this.userRepository.save(user);

    return { message: 'User soft deleted successfully' };
  }
}