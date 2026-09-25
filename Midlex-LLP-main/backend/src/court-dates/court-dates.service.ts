import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, CourtDate } from '@prisma/client';

@Injectable()
export class CourtDatesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CourtDateUncheckedCreateInput): Promise<CourtDate> {
    return this.prisma.courtDate.create({
      data,
    });
  }

  async findAllByCase(caseId: string): Promise<CourtDate[]> {
    return this.prisma.courtDate.findMany({
      where: { caseId },
      orderBy: { date: 'asc' },
    });
  }

  async findOne(id: string): Promise<CourtDate | null> {
    return this.prisma.courtDate.findUnique({
      where: { id },
    });
  }

  async update(
    id: string,
    data: Prisma.CourtDateUpdateInput,
  ): Promise<CourtDate> {
    return this.prisma.courtDate.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<CourtDate> {
    return this.prisma.courtDate.delete({
      where: { id },
    });
  }
}
