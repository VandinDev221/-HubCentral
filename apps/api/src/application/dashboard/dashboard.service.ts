import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) { }

  async getMetrics(userId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const clientScope = { userId };
    const invoiceScope = { client: { userId } };
    const subscriptionScope = { status: 'active' as const, client: { userId } };

    const [
      totalClients,
      activeClients,
      suspendedClients,
      pendingInvoices,
      overdueInvoices,
      paidThisMonth,
      activeSubscriptions,
    ] = await Promise.all([
      this.prisma.client.count({ where: clientScope }),
      this.prisma.client.count({ where: { ...clientScope, status: 'active' } }),
      this.prisma.client.count({ where: { ...clientScope, status: 'suspended' } }),
      this.prisma.invoice.count({ where: { ...invoiceScope, status: 'pending' } }),
      this.prisma.invoice.count({ where: { ...invoiceScope, status: 'overdue' } }),
      this.prisma.invoice.aggregate({
        where: {
          ...invoiceScope,
          status: 'paid',
          paidAt: { gte: startOfMonth, lte: endOfMonth },
        },
        _sum: { amount: true },
      }),
      this.prisma.subscription.findMany({
        where: subscriptionScope,
        select: { price: true },
      }),
    ]);

    const monthlyRevenue = Number(paidThisMonth._sum.amount ?? 0);
    const mrr = activeSubscriptions.reduce((acc: number, s: { price: unknown }) => acc + Number(s.price), 0);

    return {
      totalClients,
      activeClients,
      suspendedClients,
      monthlyRevenue,
      mrr,
      pendingInvoices,
      overdueInvoices,
    };
  }
}
