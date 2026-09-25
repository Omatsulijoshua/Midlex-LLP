import { Injectable } from '@nestjs/common';
import { PaymentStatus, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RemindersService {
  constructor(private prisma: PrismaService) {}

  async getForUser(params: { userId: string; role: Role; days: number }) {
    const now = new Date();
    const end = new Date(now.getTime() + params.days * 24 * 60 * 60 * 1000);

    const caseWhere =
      params.role === Role.ADMIN
        ? {}
        : params.role === Role.LAWYER
          ? { lawyerId: params.userId }
          : { clientId: params.userId };

    const cases = await this.prisma.case.findMany({
      where: caseWhere,
      select: { id: true },
    });
    const caseIds = new Set(cases.map((c: any) => c.id));

    const [courtDatesRaw, duePaymentsRaw, overduePaymentsRaw] = await Promise.all([
      this.prisma.courtDate.findMany({
        where: { date: { gte: now, lte: end } },
        orderBy: { date: 'asc' },
        include: {
          case: {
            select: { title: true },
          },
        },
      }),
      this.prisma.payment.findMany({
        where: {
          status: PaymentStatus.PENDING,
          dueDate: { gte: now, lte: end },
        },
        orderBy: { dueDate: 'asc' },
        include: {
          case: {
            select: { title: true },
          },
        },
      }),
      this.prisma.payment.findMany({
        where: {
          status: PaymentStatus.PENDING,
          dueDate: { lt: now },
        },
        orderBy: { dueDate: 'desc' },
        include: {
          case: {
            select: { title: true },
          },
        },
      }),
    ]);
    const courtDates = courtDatesRaw
      .filter((date: any) => caseIds.has(date.caseId))
      .slice(0, 5);
    const duePayments = duePaymentsRaw
      .filter((payment: any) => caseIds.has(payment.caseId))
      .slice(0, 5);
    const overduePayments = overduePaymentsRaw
      .filter((payment: any) => caseIds.has(payment.caseId))
      .slice(0, 5);

    return {
      rangeDays: params.days,
      counts: {
        upcomingCourtDates: courtDates.length,
        duePayments: duePayments.length,
        overduePayments: overduePayments.length,
      },
      courtDates,
      payments: {
        dueSoon: duePayments,
        overdue: overduePayments,
      },
    };
  }
}
