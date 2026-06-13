import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { compare } from 'bcrypt';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import { CurrentUser } from './types/current-user';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async findUserByEmail(email: string) {
    return this.userService.findByEmail(email);
  }

  async createUser(userData: any) {
    return this.userService.create(userData);
  }

  createJwtToken(user: any) {
    const payload = { email: user.email, name: user.name };
    return this.jwtService.sign(payload);
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid email or password');
    const isPasswordMatch = await compare(password, user.password);
    if (!isPasswordMatch)
      throw new UnauthorizedException('Invalid email or password');
    return { id: user.id };
  }

  login(userId: string) {
    const payload: AuthJwtPayload = { sub: userId };
    return this.jwtService.sign(payload);
  }

  async validateJwtUser(userId: string) {
    const user = await this.userService.findOne(userId);

    if (!user) throw new UnauthorizedException('User not found!');

    const currentUser: CurrentUser = {
      id: user.id,
      role: user.role,
    };

    return currentUser;
  }
}
