import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CasesService } from './cases.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role, CaseStatus } from '@prisma/client';

@Controller('cases')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CasesController {
  constructor(private casesService: CasesService) {}

  @Post()
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
  @Roles(Role.ADMIN)
  async findAll() {
    return this.casesService.findAll();
  }

  @Get('my-cases')
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
  async findOne(@Param('id') id: string) {
    return this.casesService.findOne(id);
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN, Role.LAWYER)
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: CaseStatus,
  ) {
    return this.casesService.updateStatus(id, status);
  }

  @Patch(':id/assign')
  @Roles(Role.ADMIN)
  async assign(@Param('id') id: string, @Body('lawyerId') lawyerId: string) {
    return this.casesService.assignLawyer(id, lawyerId);
  }
}
