import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { RemindersService } from './reminders.service';

@Controller('reminders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Get()
  async getMyReminders(@Request() req: any, @Query('days') days?: string) {
    const parsedDays = Number(days);
    const rangeDays =
      Number.isFinite(parsedDays) && parsedDays > 0 && parsedDays <= 60
        ? parsedDays
        : 7;

    return this.remindersService.getForUser({
      userId: req.user.id,
      role: req.user.role,
      days: rangeDays,
    });
  }
}
