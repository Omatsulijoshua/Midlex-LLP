import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CaseStatus } from '@prisma/client';

@Injectable()
export class LawyerService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats(lawyerId: string) {
    const [activeCases, totalClients, assignedCases] = await Promise.all([
      this.prisma.case.count({
        where: {
          lawyerId,
          status: { notIn: [CaseStatus.CLOSED, CaseStatus.COMPLETED] },
        },
      }),
      this.prisma.case.groupBy({
        by: ['clientId'],
        where: { lawyerId },
      }),
      this.prisma.case.findMany({ where: { lawyerId }, select: { id: true } }),
    ]);
    const assignedCaseIds = new Set(assignedCases.map((c: any) => c.id));
    const upcomingCourts = (
      await this.prisma.courtDate.findMany({
        where: { date: { gte: new Date() } },
      })
    ).filter((date: any) => assignedCaseIds.has(date.caseId)).length;

    return {
      activeCases,
      totalClients: totalClients.length,
      upcomingCourts,
      newMessages: 5, // Placeholder for real message count
    };
  }

  async getMyCases(lawyerId: string) {
    const lawyerUser = await this.prisma.user.findUnique({ where: { id: lawyerId } });
    const team = lawyerUser?.litigationTeam;

    const allCases = await this.prisma.case.findMany({
      include: {
        client: { select: { name: true, phone: true, email: true } },
        lawyer: { select: { name: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    if (!team) {
      return allCases.filter((c: any) => c.lawyerId === lawyerId);
    }

    return allCases.filter(
      (c: any) =>
        c.lawyerId === lawyerId ||
        (c.litigationTeam && c.litigationTeam.trim().toUpperCase() === team.trim().toUpperCase()),
    );
  }

  async getUpcomingHearings(lawyerId: string) {
    const cases = await this.prisma.case.findMany({
      where: { lawyerId },
      select: { id: true },
    });
    const caseIds = new Set(cases.map((c: any) => c.id));
    const hearings = await this.prisma.courtDate.findMany({
      where: { date: { gte: new Date() } },
      include: {
        case: { select: { title: true } },
      },
      orderBy: { date: 'asc' },
    });
    return hearings.filter((date: any) => caseIds.has(date.caseId)).slice(0, 5);
  }
}
