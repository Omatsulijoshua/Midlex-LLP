import { Body, Controller, Post } from '@nestjs/common';
import { InquiriesService } from './inquiries.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { EmailService } from '../common/email/email.service';

@Controller('public/inquiries')
export class PublicInquiriesController {
  constructor(
    private readonly inquiriesService: InquiriesService,
    private readonly emailService: EmailService,
  ) {}

  @Post()
  async create(@Body() body: CreateInquiryDto) {
    const inquiry = await this.inquiriesService.create({
      name: body.name,
      email: body.email,
      phone: body.phone,
      serviceNeeded: body.serviceNeeded,
      message: body.message,
    });

    await this.emailService.sendAdminInquiryNotification({
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone ?? undefined,
      serviceNeeded: inquiry.serviceNeeded ?? undefined,
    });

    return { ok: true, id: inquiry.id };
  }
}
