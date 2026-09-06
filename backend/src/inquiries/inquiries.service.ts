import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InquiryStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InquiriesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.InquiryCreateInput) {
    try {
      return await this.prisma.inquiry.create({ data });
    } catch (err: any) {
      throw this.translatePrismaError(err);
    }
  }

  async list(status?: InquiryStatus) {
    try {
      return await this.prisma.inquiry.findMany({
        where: status ? { status } : undefined,
        orderBy: { createdAt: 'desc' },
      });
    } catch (err: any) {
      throw this.translatePrismaError(err);
    }
  }

  async findById(id: string) {
    try {
      const inquiry = await this.prisma.inquiry.findUnique({ where: { id } });
      if (!inquiry) throw new NotFoundException('Inquiry not found');
      return inquiry;
    } catch (err: any) {
      throw this.translatePrismaError(err);
    }
  }

  async update(id: string, data: Prisma.InquiryUpdateInput) {
    await this.findById(id);
    try {
      return await this.prisma.inquiry.update({ where: { id }, data });
    } catch (err: any) {
      throw this.translatePrismaError(err);
    }
  }

  generateAiResponse(userMessage: string, serviceNeeded?: string, name?: string): string {
    const userName = name || 'there';
    const lower = (userMessage || '').toLowerCase();
    const service = (serviceNeeded || '').toLowerCase();

    if (service.includes('property') || service.includes('real estate') || lower.includes('land') || lower.includes('property') || lower.includes('deed') || lower.includes('c of o')) {
      return `Hello ${userName}! Thank you for reaching out to Midlex LLP regarding Property & Real Estate. I am your AI Legal Assistant.\n\nFor real estate matters in Nigeria (title verification, Governor's Consent, Certificate of Occupancy, deed drafting, or land dispute resolution), our property law team is reviewing your request.\n\nPlease share any details or documents you have (e.g., land location, title type). A lead property attorney will take over this chat shortly.`;
    }

    if (service.includes('corporate') || lower.includes('company') || lower.includes('cac') || lower.includes('business') || lower.includes('contract') || lower.includes('incorporation')) {
      return `Hello ${userName}! Thank you for contacting Midlex LLP Corporate Advisory. I am your AI Legal Assistant.\n\nWe assist with CAC company registration, regulatory compliance, corporate governance, joint ventures, and commercial contracts.\n\nPlease let us know your specific business requirement. Our corporate legal team has been notified and will take over this chat shortly.`;
    }

    if (service.includes('litigation') || lower.includes('court') || lower.includes('suit') || lower.includes('dispute') || lower.includes('police') || lower.includes('claim')) {
      return `Hello ${userName}! Thank you for contacting Midlex LLP Litigation Practice. I am your AI Legal Assistant.\n\nOur advocacy team handles civil, commercial, and criminal litigation across Nigerian courts. Your request is high priority.\n\nPlease provide a brief summary of the dispute. Senior legal counsel will take over this chat momentarily.`;
    }

    return `Hello ${userName}! Thank you for reaching out to Midlex LLP. I am your AI Legal Assistant.\n\nYour request has been logged successfully and forwarded to our legal team in Benin City. While an attorney reviews your request, feel free to share any further details or questions here.\n\nA human legal counsel will take over this chat shortly!`;
  }

  private translatePrismaError(err: any) {
    const code = err?.code as string | undefined;
    const message = (err?.message as string | undefined) || '';

    // Common when schema changes were made but the DB wasn't migrated yet.
    if (
      code === 'P2021' ||
      /does not exist/i.test(message) ||
      /relation .*inquiry.* does not exist/i.test(message)
    ) {
      return new BadRequestException(
        'Database is missing the Inquiry table. Run `npx prisma migrate dev --name add_inquiries` (or `npx prisma db push`) in the backend.',
      );
    }

    return new BadRequestException('Inquiry operation failed');
  }
}
