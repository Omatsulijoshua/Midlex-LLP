import { Module } from '@nestjs/common';
import { InquiriesService } from './inquiries.service';
import { InquiriesController } from './inquiries.controller';
import { PublicInquiriesController } from './public-inquiries.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailService } from '../common/email/email.service';

@Module({
  imports: [PrismaModule],
  providers: [InquiriesService, EmailService],
  controllers: [InquiriesController, PublicInquiriesController],
  exports: [InquiriesService],
})
export class InquiriesModule {}
