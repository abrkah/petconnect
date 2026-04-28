import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async create(userDto: CreateUserDto): Promise<string> {
    if (!userDto.password) {
      throw new BadRequestException('Password is required');
    }

    if (!userDto.role) {
      throw new BadRequestException('Role is required (OWNER or PROVIDER)');
    }

    const hashedPassword = await bcrypt.hash(userDto.password, 12);

    const user = this.userRepository.create({
      email: userDto.email,
      password: hashedPassword,
      role: userDto.role as UserRole, // ✅ ENUM usage
      isFirstLogin: true,
    });

    await this.userRepository.save(user);

    await this.sendPasswordEmail(userDto.email, userDto.password);

    return 'User created successfully';
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
      subject: 'PetCare Account Password',
      html: `
        <h2>Welcome to PetCare</h2>
        <p>Your account has been created.</p>
        <p><b>Password:</b> ${password}</p>
      `,
    });
  }
}