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
