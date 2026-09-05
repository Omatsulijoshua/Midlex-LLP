import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { createHash, randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async createPasswordReset(email: string) {
    const normalizedEmail = (email || '').trim().toLowerCase();
    const user = normalizedEmail
      ? await this.usersService.findOneByEmail(normalizedEmail)
      : null;

    if (!user) return null;

    const token = randomBytes(32).toString('hex');
    const tokenHash = this.hashResetToken(token);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.prisma.passwordReset.create({
      data: {
        tokenHash,
        userId: user.id,
        email: user.email,
        expiresAt,
        usedAt: null,
      },
    });

    const frontendUrl =
      process.env.FRONTEND_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      'http://localhost:3000';

    return {
      resetUrl: `${frontendUrl.replace(/\/+$/, '')}/reset-password?token=${token}`,
      expiresAt,
    };
  }

  async resetPassword(token: string, password: string) {
    const cleanToken = (token || '').trim();
    const cleanPassword = (password || '').trim();
    if (!cleanToken) throw new BadRequestException('Reset token is required');
    if (cleanPassword.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters');
    }

    const tokenHash = this.hashResetToken(cleanToken);
    const reset = await this.prisma.passwordReset.findUnique({
      where: { tokenHash },
    });

    if (!reset || reset.usedAt) {
      throw new BadRequestException('Reset link is invalid or has expired');
    }

    if (new Date(reset.expiresAt).getTime() < Date.now()) {
      throw new BadRequestException('Reset link is invalid or has expired');
    }

    await this.usersService.updatePassword(reset.userId, cleanPassword);
    await this.prisma.passwordReset.update({
      where: { id: reset.id },
      data: { usedAt: new Date() },
    });

    return { ok: true };
  }

  private hashResetToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }
}
