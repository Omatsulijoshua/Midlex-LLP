import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { EmailService } from '../common/email/email.service';
import { NotificationsService } from '../notifications/notifications.service';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private emailService: EmailService,
    private notificationsService: NotificationsService,
  ) {}

  @Get('profile')
  async getProfile(@Request() req: any) {
    return this.usersService.findOneById(req.user.id);
  }

  @Patch('profile')
  async updateProfile(@Request() req: any, @Body() body: any) {
    return this.usersService.update(req.user.id, {
      phone: body.phone,
      dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
      nationalId: body.nationalId,
      address: body.address,
      otherInfo: body.otherInfo,
      name: body.name,
    });
  }

  @Get('lawyers')
  async getLawyers() {
    return this.usersService.findAllLawyers();
  }

  @Get('clients')
  @Roles(Role.ADMIN, Role.LAWYER)
  async getClients() {
    return this.usersService.findAllClients();
  }

  @Get('admins')
  @Roles(Role.ADMIN)
  async getAdmins() {
    return this.usersService.findAllAdmins();
  }

  @Post('lawyers')
  @Roles(Role.ADMIN)
  async createLawyer(@Body() body: any) {
    return this.usersService.create({
      email: body.email,
      password: body.password,
      name: body.name,
      role: Role.LAWYER,
      phone: body.phone,
      litigationTeam: body.litigationTeam || 'TEAM ANCHOR',
    });
  }

  @Patch('lawyers/:id/team')
  @Roles(Role.ADMIN)
  async updateLawyerTeam(
    @Param('id') id: string,
    @Body('litigationTeam') litigationTeam: string,
  ) {
    return this.usersService.update(id, { litigationTeam });
  }

  @Get('team-messages/:teamName')
  @Roles(Role.ADMIN, Role.LAWYER)
  async getTeamMessages(@Param('teamName') teamName: string) {
    return this.usersService.getTeamMessages(teamName);
  }

  @Post('team-messages/:teamName')
  @Roles(Role.ADMIN, Role.LAWYER)
  async sendTeamMessage(
    @Param('teamName') teamName: string,
    @Request() req: any,
    @Body() body: any,
  ) {
    return this.usersService.sendTeamMessage({
      teamName,
      senderId: req.user.id,
      content: body.content,
      fileUrl: body.fileUrl,
    });
  }

  @Post('clients')
  @Roles(Role.ADMIN)
  async createClient(@Body() body: any) {
    const temporaryPassword =
      body.password || `Midlex@${Math.random().toString(36).slice(2, 8)}`;

    const newUser = await this.usersService.create({
      email: body.email,
      password: temporaryPassword,
      name: body.name,
      role: Role.CLIENT,
      phone: body.phone,
    });

    await this.emailService.sendClientWelcomeEmail({
      name: newUser.name,
      email: newUser.email,
      temporaryPassword,
    });

    await this.notificationsService.notifyAdmins({
      title: 'New client account created',
      message: `${newUser.name} was added as a client.`,
      link: '/dashboard/clients',
      type: 'CLIENT_CREATED',
    });

    await this.notificationsService.create({
      recipientId: newUser.id,
      title: 'Complete your account information',
      message: 'Please update your profile so your legal records are complete.',
      link: '/dashboard/profile',
      type: 'PROFILE_SETUP',
    });

    return { ...newUser, temporaryPassword };
  }

  @Post('admins')
  @Roles(Role.ADMIN)
  async createAdmin(@Body() body: any) {
    const temporaryPassword =
      body.password || `Midlex@${Math.random().toString(36).slice(2, 8)}`;

    const newUser = await this.usersService.create({
      email: body.email,
      password: temporaryPassword,
      name: body.name,
      role: Role.ADMIN,
      phone: body.phone,
    });

    return { ...newUser, temporaryPassword };
  }
}
