import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, PaymentStatus, InquiryStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalCases,
      totalLawyers,
      totalClients,
      successfulPayments,
      pendingPaymentsCount,
      newInquiries,
      unassignedCases,
    ] = await Promise.all([
      this.prisma.case.count(),
      this.prisma.user.count({ where: { role: Role.LAWYER } }),
      this.prisma.user.count({ where: { role: Role.CLIENT } }),
      this.prisma.payment.findMany({
        where: { status: PaymentStatus.SUCCESS },
      }),
      this.prisma.payment.count({ where: { status: PaymentStatus.PENDING } }),
      this.prisma.inquiry.count({ where: { status: InquiryStatus.NEW } }),
      this.prisma.case.count({ where: { lawyerId: null } }),
    ]);

    const totalRevenue = successfulPayments.reduce(
      (acc, curr) => acc + curr.amount,
      0,
    );

    return {
      totalCases,
      activeLawyers: totalLawyers,
      totalClients,
      totalRevenue,
      pendingPayments: pendingPaymentsCount,
      newInquiries,
      unassignedCases,
    };
  }

  async getRecentActivity() {
    return this.prisma.case.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        client: { select: { name: true } },
        lawyer: { select: { name: true } },
      },
    });
  }

  async getRevenueStats() {
    // Basic aggregation for now
    const payments = await this.prisma.payment.findMany({
      where: { status: PaymentStatus.SUCCESS },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return payments;
  }
}
