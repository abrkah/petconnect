import {
  Controller,
  Get,
  Query,
  Req,
  Res,
  UseGuards,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
  Request,
} from '@nestjs/common';

import { Response } from 'express';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../user/user.service';
import { Roles } from './decorator/roles.decorators';
import { UserRole } from '../user/entities/user.entity';
import { LocalAuthGuard } from '../guards/local-auth/local-auth.guard';
import { Public } from './decorator/public.decorator';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { OwnerService } from '../owner/owner.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly ownerService: OwnerService,
  ) {}

  @Public()
  @Get('google')
  async googleLogin() {
    if (!process.env.GOOGLE_CLIENT_ID?.trim()) {
      throw new NotFoundException('Google sign-in is not configured');
    }
    return 'Redirect to Google OAuth (requires GoogleAuthGuard when configured)';
  }

  @Roles(UserRole.OWNER)
  @Get('roletest')
  async roleTest() {
    return 'Role Test';
  }

  @Public()
  @Get('google/callback')
  async googleCallback(@Query('email') email: string, @Res() res: Response) {
    if (!process.env.GOOGLE_CLIENT_ID?.trim()) {
      throw new NotFoundException('Google sign-in is not configured');
    }
    const existingUser = await this.authService.findUserByEmail(email);

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const jwtToken = this.authService.createJwtToken(existingUser);

    res.redirect(`https://ims.ienetworks.co?token=${jwtToken}`);
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    const user = await this.userService.findOne(req.user.id);

    if (!user) {
      throw new UnauthorizedException('User account is inactive or deleted');
    }

    const token = this.authService.login(user.id);

    let isFirstLogin = user.isFirstLogin;
    if (user.role === UserRole.OWNER) {
      const hasProfile = await this.ownerService.hasProfile(user.id);
      if (!hasProfile) isFirstLogin = true;
    }

    return {
      id: user.id,
      token,
      role: user.role,
      isFirstLogin,
    };
  }

  @Public()
  @Post('signup')
  async create(@Body() createUserDto: CreateUserDto): Promise<string> {
    return this.userService.create(createUserDto);
  }

  @Post('logout')
  @HttpCode(200)
  async logout() {
    return { message: 'Logout successful' };
  }
}