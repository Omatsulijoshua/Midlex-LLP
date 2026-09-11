import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CasesService } from './cases.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role, CaseStatus } from '@prisma/client';

@Controller('cases')
export class CasesController {
  constructor(private casesService: CasesService) {}

  @Get('public-share/:id')
  async getPublicShare(@Param('id') id: string) {
    return this.casesService.findPublicShare(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CLIENT)
  async create(@Body() body: any, @Request() req: any) {
    // If client is creating, automatically set them as the client
    const clientId =
      req.user.role === Role.CLIENT ? req.user.id : body.clientId;
    return this.casesService.create({
      title: body.title,
      description: body.description,
      clientId: clientId,
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.ACCOUNTANT)
  async findAll() {
    return this.casesService.findAll();
  }

  @Get('allocations')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.ACCOUNTANT)
  async getAllocations() {
    return this.casesService.getAllocations();
  }

  @Get('my-cases')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findMyCases(@Request() req: any) {
    if (req.user.role === Role.ADMIN) {
      return this.casesService.findAll();
    }
    if (req.user.role === Role.LAWYER) {
      return this.casesService.findByLawyer(req.user.id);
    }
    return this.casesService.findByClient(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findOne(@Param('id') id: string) {
    return this.casesService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.LAWYER)
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: CaseStatus,
  ) {
    return this.casesService.updateStatus(id, status);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.LAWYER)
  async updateCase(
    @Param('id') id: string,
    @Body() body: { title?: string; description?: string },
  ) {
    return this.casesService.updateCase(id, body);
  }

  @Patch(':id/assign')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async assign(@Param('id') id: string, @Body('lawyerId') lawyerId: string) {
    return this.casesService.assignLawyer(id, lawyerId);
  }

  @Get(':id/timeline')
  @UseGuards(JwtAuthGuard)
  async getTimeline(@Param('id') id: string) {
    return this.casesService.getTimeline(id);
  }

  @Post(':id/timeline')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.LAWYER)
  async addTimelineEvent(
    @Param('id') id: string,
    @Body() body: { title: string; description?: string; status?: string; date?: string },
    @Request() req: any,
  ) {
    return this.casesService.addTimelineEvent(id, {
      title: body.title,
      description: body.description,
      status: body.status,
      date: body.date,
      createdById: req.user?.id,
      createdByName: req.user?.name || req.user?.email || 'Legal Counsel',
    });
  }

  @Delete(':id/timeline/:timelineId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.LAWYER)
  async deleteTimelineEvent(@Param('timelineId') timelineId: string) {
    return this.casesService.deleteTimelineEvent(timelineId);
  }
}
