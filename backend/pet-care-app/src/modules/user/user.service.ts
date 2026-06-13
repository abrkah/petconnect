import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  async create(userDto: CreateUserDto): Promise<{ message: string }> {
    if (!userDto.password) {
      throw new BadRequestException('Password is required');
    }

    if (!userDto.role) {
      throw new BadRequestException('Role is required (OWNER or PROVIDER)');
    }

    const email = this.normalizeEmail(userDto.email);

    const existing = await this.userRepository
      .createQueryBuilder('user')
      .where('LOWER(user.email) = :email', { email })
      .getOne();

    if (existing) {
      throw new BadRequestException(
        'An account with this email already exists. Please sign in instead.',
      );
    }

    const hashedPassword = await bcrypt.hash(userDto.password, 12);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      role: userDto.role as UserRole,
      isFirstLogin: true,
    });

    try {
      await this.userRepository.save(user);
    } catch (err) {
      if (
        err instanceof QueryFailedError &&
        (err as QueryFailedError & { driverError?: { code?: string } })
          .driverError?.code === '23505'
      ) {
        throw new BadRequestException(
          'An account with this email already exists. Please sign in instead.',
        );
      }
      throw err;
    }

    void this.sendPasswordEmail(email, userDto.password);

    return { message: 'User created successfully' };
  }

  async findOne(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id, isDeleted: false },
    });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      where: { isDeleted: false },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        12,
      );
    }

    Object.assign(user, updateUserDto);

    return this.userRepository.save(user);
  }

  async softDelete(id: string): Promise<User> {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isDeleted = true;

    return this.userRepository.save(user);
  }

  async updatePasswords(newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.userRepository.update(
      { isDeleted: false },
      { password: hashedPassword },
    );
  }

  async sendPasswordEmail(email: string, password: string) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'PetConnect Account Password',
        html: `
        <h2>Welcome to PetConnect</h2>
        <p>Your account has been created.</p>
        <p><b>Password:</b> ${password}</p>
      `,
      });
    } catch {
      /* optional in dev when SMTP is not configured */
    }
  }
}