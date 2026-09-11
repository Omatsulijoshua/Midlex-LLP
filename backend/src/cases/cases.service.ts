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
    const createdCase = await this.prisma.case.create({ data });
    // Automatically seed initial timeline event
    try {
      await this.prisma.caseTimeline.create({
        data: {
          caseId: createdCase.id,
          title: 'Case Matter Registered',
          description: 'Legal case matter opened and recorded in Midlex LLP Registry.',
          status: 'OPEN',
          date: createdCase.createdAt || new Date(),
        },
      });
    } catch (e) {
      console.warn('[cases] Failed to seed initial timeline event:', e);
    }
    return createdCase;
  }

  async findAll(): Promise<Case[]> {
    return this.prisma.case.findMany({
      include: { client: true, lawyer: true, timeline: true },
    });
  }

  async findOne(id: string): Promise<Case | null> {
    const caseItem = await this.prisma.case.findUnique({
      where: { id },
      include: {
        client: true,
        lawyer: true,
        documents: true,
        messages: { include: { sender: true } },
        courtDates: true,
        timeline: true,
      },
    });

    // If timeline is empty, auto-generate default start timeline entry
    if (caseItem && (!caseItem.timeline || caseItem.timeline.length === 0)) {
      try {
        const startEvent = await this.prisma.caseTimeline.create({
          data: {
            caseId: caseItem.id,
            title: 'Case Matter Registered',
            description: 'Legal case matter opened and recorded in Midlex LLP Registry.',
            status: 'OPEN',
            date: caseItem.createdAt || new Date(),
          },
        });
        caseItem.timeline = [startEvent];
      } catch (e) {
        console.warn('[cases] Failed to auto-create start timeline entry:', e);
      }
    }

    return caseItem;
  }

  async updateStatus(id: string, status: CaseStatus): Promise<Case> {
    const updated = await this.prisma.case.update({
      where: { id },
      data: { status },
    });

    // Auto post timeline update for status changes
    try {
      const isResolved = status === 'COMPLETED' || status === 'CLOSED';
      await this.prisma.caseTimeline.create({
        data: {
          caseId: id,
          title: isResolved ? 'Case Matter Resolved & Closed' : `Case Status Updated to ${status.replace('_', ' ')}`,
          description: isResolved ? 'Legal proceedings and client case matter concluded successfully.' : `Status progressed to ${status}.`,
          status,
          date: new Date(),
        },
      });
    } catch (e) {
      console.warn('[cases] Failed to log timeline status update:', e);
    }

    return updated;
  }

  async addTimelineEvent(caseId: string, data: { title: string; description?: string; status?: string; date?: string; createdById?: string; createdByName?: string }) {
    return this.prisma.caseTimeline.create({
      data: {
        caseId,
        title: data.title.trim(),
        description: data.description?.trim() || '',
        status: data.status || 'IN_PROGRESS',
        date: data.date ? new Date(data.date) : new Date(),
        createdById: data.createdById,
        createdByName: data.createdByName,
      },
    });
  }

  async getTimeline(caseId: string) {
    const events = await this.prisma.caseTimeline.findMany({
      where: { caseId },
      orderBy: { date: 'asc' },
    });
    return events;
  }

  async deleteTimelineEvent(timelineId: string) {
    return this.prisma.caseTimeline.delete({
      where: { id: timelineId },
    });
  }

  async updateCase(id: string, data: { title?: string; description?: string }): Promise<Case> {
    return this.prisma.case.update({
      where: { id },
      data: {
        ...(data.title ? { title: data.title.trim() } : {}),
        ...(data.description !== undefined ? { description: data.description.trim() } : {}),
      },
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

  async findPublicShare(id: string): Promise<any> {
    const caseData = await this.prisma.case.findUnique({
      where: { id },
      include: {
        client: { select: { name: true } },
        lawyer: { select: { name: true } },
        documents: true,
      },
    });

    if (!caseData) return null;

    return {
      id: caseData.id,
      title: caseData.title,
      description: caseData.description,
      status: caseData.status,
      createdAt: caseData.createdAt,
      clientName: (caseData as any).client?.name || 'Client',
      lawyerName: (caseData as any).lawyer?.name || 'Midlex Legal Counsel',
      documents: caseData.documents || [],
    };
  }

  async getAllocations(): Promise<any[]> {
    const cases = await this.prisma.case.findMany({
      include: {
        client: true,
        lawyer: true,
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return cases.map((c: any) => {
      const payments = c.payments || [];
      const totalPaid = payments
        .filter((p: any) => p.status === 'SUCCESS')
        .reduce((acc: number, p: any) => acc + (p.amount || 0), 0);
      const totalPending = payments
        .filter((p: any) => p.status === 'PENDING')
        .reduce((acc: number, p: any) => acc + (p.amount || 0), 0);

      return {
        id: c.id,
        title: c.title,
        status: c.status,
        createdAt: c.createdAt,
        client: c.client
          ? { id: c.client.id, name: c.client.name, email: c.client.email, phone: c.client.phone }
          : { name: 'Client', email: '-' },
        lawyer: c.lawyer
          ? { id: c.lawyer.id, name: c.lawyer.name, email: c.lawyer.email, phone: c.lawyer.phone }
          : { name: 'Unassigned', email: 'Awaiting Lawyer' },
        totalPaid,
        totalPending,
        paymentCount: payments.length,
      };
    });
  }
}
