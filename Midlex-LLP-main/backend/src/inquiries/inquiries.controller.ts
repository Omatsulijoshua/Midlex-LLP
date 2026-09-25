import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role, InquiryStatus } from '@prisma/client';
import { InquiriesService } from './inquiries.service';
import { UpdateInquiryDto } from './dto/update-inquiry.dto';

@Controller('inquiries')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Get()
  async list(@Query('status') status?: InquiryStatus) {
    return this.inquiriesService.list(status);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.inquiriesService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateInquiryDto) {
    return this.inquiriesService.update(id, {
      status: body.status,
      notes: body.notes,
    });
  }
}
