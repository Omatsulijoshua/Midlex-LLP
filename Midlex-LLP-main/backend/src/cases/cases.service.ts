import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Case, CaseStatus, Prisma } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class CasesService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async create(data: Prisma.CaseUncheckedCreateInput): Promise<Case> {
    return this.prisma.case.create({ data });
  }

  async findAll(): Promise<Case[]> {
    return this.prisma.case.findMany({
      include: { client: true, lawyer: true },
    });
  }

  async findOne(id: string): Promise<Case | null> {
    return this.prisma.case.findUnique({
      where: { id },
      include: {
        client: true,
        lawyer: true,
        documents: true,
        messages: { include: { sender: true } },
        courtDates: true,
      },
    });
  }

  async updateStatus(id: string, status: CaseStatus): Promise<Case> {
    return this.prisma.case.update({
      where: { id },
      data: { status },
    });
  }

  async assignLawyer(caseId: string, lawyerId: string): Promise<Case> {
    const updated = await this.prisma.case.update({
      where: { id: caseId },
      data: { lawyerId },
      include: { client: true, lawyer: true },
    });

    await this.notificationsService.create({
      recipientId: lawyerId,
      title: 'New client assigned',
      message: `${updated.client?.name || 'A client'} has been allocated to you for ${updated.title}.`,
      link: `/dashboard/cases/${caseId}`,
      type: 'CLIENT_ASSIGNED',
    });

    return updated;
  }

  async findByLawyer(lawyerId: string): Promise<Case[]> {
    return this.prisma.case.findMany({
      where: { lawyerId },
      include: { client: true },
    });
  }

  async findByClient(clientId: string): Promise<Case[]> {
    return this.prisma.case.findMany({
      where: { clientId },
      include: { lawyer: true },
    });
  }
}
