import {
  Body,
  Controller,
  Get,
  Patch,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async list(
    @Request() req: any,
    @Query('limit') limit?: string,
    @Query('unreadOnly') unreadOnly?: string,
  ) {
    const parsedLimit = Number(limit);

    const result = await this.notificationsService.listForUser({
      userId: req.user.id,
      role: req.user.role,
      limit:
        Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : undefined,
      unreadOnly: unreadOnly === 'true',
    });

    return limit || unreadOnly ? result : result.items;
  }

  @Get('unread-count')
  async unreadCount(@Request() req: any) {
    const result = await this.notificationsService.listForUser({
      userId: req.user.id,
      role: req.user.role,
      unreadOnly: true,
    });
    return { count: result.unreadCount };
  }

  @Post()
  @Roles(Role.ADMIN)
  createBroadcast(@Body() body: any, @Request() req: any) {
    return this.notificationsService.broadcast({
      title: body.title,
      message: body.message,
      targetRole: body.targetRole || 'ALL',
      targetUserId: body.targetUserId || undefined,
      link: body.link || body.href || undefined,
      createdById: req.user.id,
    });
  }

  @Patch('read-all')
  async markAllRead(@Request() req: any) {
    return this.notificationsService.markAllRead({
      userId: req.user.id,
      role: req.user.role,
    });
  }

  @Patch(':id/read')
  async markRead(@Param('id') id: string, @Request() req: any) {
    return this.notificationsService.markRead(id, {
      userId: req.user.id,
      role: req.user.role,
    });
  }
}
