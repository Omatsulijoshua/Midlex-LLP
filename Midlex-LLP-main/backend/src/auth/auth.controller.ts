import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { EmailService } from '../common/email/email.service';
import { Role } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private emailService: EmailService,
    private notificationsService: NotificationsService,
  ) {}

  @Post('login')
  async login(@Body() body: any) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('signup')
  async signup(@Body() body: any) {
    // Basic validation
    if (!body.email || !body.password || !body.name) {
      throw new UnauthorizedException('Missing required fields');
    }

    // Clients can self-signup. Lawyers/Admins cannot.
    const newUser = await this.usersService.create({
      email: body.email,
      password: body.password,
      name: body.name,
      role: Role.CLIENT,
    });

    // Notify Admin
    await this.emailService.sendAdminSignupNotification(
      newUser.name,
      newUser.email,
    );

    await this.notificationsService.notifyAdmins({
      title: 'New client registered',
      message: `${newUser.name} created a client account.`,
      link: '/dashboard/clients',
      type: 'CLIENT_SIGNUP',
    });

    await this.notificationsService.create({
      recipientId: newUser.id,
      title: 'Complete your account information',
      message: 'Please update your profile so the legal team has your current contact and identification details.',
      link: '/dashboard/profile',
      type: 'PROFILE_SETUP',
    });

    return newUser;
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: any) {
    const reset = await this.authService.createPasswordReset(body.email);
    if (reset) {
      await this.emailService.sendPasswordResetEmail({
        email: body.email,
        resetUrl: reset.resetUrl,
        expiresAt: reset.expiresAt,
      });
    }

    return {
      message:
        'If an account exists for that email, password reset instructions have been sent.',
      ...(process.env.EXPOSE_PASSWORD_RESET_LINK === 'true' && reset
        ? { resetUrl: reset.resetUrl }
        : {}),
    };
  }

  @Post('reset-password')
  async resetPassword(@Body() body: any) {
    await this.authService.resetPassword(body.token, body.password);
    return { message: 'Password reset successfully' };
  }
}
