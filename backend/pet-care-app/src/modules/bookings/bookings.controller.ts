import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Roles } from '../auth/decorator/roles.decorators';
import { UserRole } from '../user/entities/user.entity';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import type { CurrentUser } from '../auth/types/current-user';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @Roles(UserRole.OWNER)
  create(@AuthUser() user: CurrentUser, @Body() dto: CreateBookingDto) {
    return this.bookingsService.createForOwner(user.id, dto);
  }

  @Get('mine')
  @Roles(UserRole.OWNER, UserRole.PROVIDER)
  findMine(@AuthUser() user: CurrentUser) {
    return this.bookingsService.listForUser(user.id, user.role);
  }

  @Patch(':id')
  @Roles(UserRole.OWNER, UserRole.PROVIDER)
  update(
    @AuthUser() user: CurrentUser,
    @Param('id') id: string,
    @Body() dto: UpdateBookingDto,
  ) {
    return this.bookingsService.updateBooking(user.id, user.role, id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.OWNER, UserRole.PROVIDER)
  remove(@AuthUser() user: CurrentUser, @Param('id') id: string) {
    return this.bookingsService.remove(user.id, user.role, id);
  }
}
