import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { LawyerService } from './lawyer.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('lawyer')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.LAWYER)
export class LawyerController {
  constructor(private readonly lawyerService: LawyerService) {}

  @Get('stats')
  async getStats(@Request() req: any) {
    return this.lawyerService.getDashboardStats(req.user.id);
  }

  @Get('cases')
  async getCases(@Request() req: any) {
    return this.lawyerService.getMyCases(req.user.id);
  }

  @Get('hearings')
  async getHearings(@Request() req: any) {
    return this.lawyerService.getUpcomingHearings(req.user.id);
  }
}
