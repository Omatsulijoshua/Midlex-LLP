import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CourtDatesService } from './court-dates.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('court-dates')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CourtDatesController {
  constructor(private readonly courtDatesService: CourtDatesService) {}

  @Post()
  @Roles(Role.ADMIN, Role.LAWYER)
  create(@Body() body: any) {
    return this.courtDatesService.create({
      date: new Date(body.date),
      location: body.location,
      description: body.description,
      caseId: body.caseId,
    });
  }

  @Get('case/:caseId')
  findAllByCase(@Param('caseId') caseId: string) {
    return this.courtDatesService.findAllByCase(caseId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courtDatesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.LAWYER)
  update(@Param('id') id: string, @Body() body: any) {
    if (body.date) body.date = new Date(body.date);
    return this.courtDatesService.update(id, body);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.LAWYER)
  remove(@Param('id') id: string) {
    return this.courtDatesService.remove(id);
  }
}
