import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditService } from '../../infrastructure/audit/audit.service';

const OVERDUE_GRACE_DAYS = 10;

@Injectable()
export class OverdueService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async updateOverdueInvoices(): Promise<void> {
    const now = new Date();
    const invoices = await this.prisma.invoice.findMany({
      where: {
        status: 'pending',
        dueDate: { lt: now },
      },
    });

    for (const inv of invoices) {
      await this.prisma.invoice.update({
        where: { id: inv.id },
        data: { status: 'overdue' },
      });
    }
  }

  async suspendOverdueClients(): Promise<void> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - OVERDUE_GRACE_DAYS);

    const overdueInvoices = await this.prisma.invoice.findMany({
      where: {
        status: 'overdue',
        dueDate: { lt: cutoff },
      },
      select: { clientId: true },
      distinct: ['clientId'],
    });

    const clientIds = [...new Set(overdueInvoices.map((i: { clientId: string }) => i.clientId))];

    for (const clientId of clientIds) {
      const client = await this.prisma.client.findUnique({
        where: { id: clientId },
        include: { subscriptions: true },
      });
      if (!client || client.status === 'suspended') continue;

      await this.prisma.$transaction([
        this.prisma.client.update({
          where: { id: clientId },
          data: { status: 'suspended' },
        }),
        ...client.subscriptions.map((s: { id: string }) =>
          this.prisma.subscription.update({
            where: { id: s.id },
            data: { status: 'suspended' },
          }),
        ),
      ]);

      await this.audit.log({
        action: 'AUTO_BLOCK',
        entity: 'Client',
        entityId: clientId as string,
        payload: { reason: 'Invoice overdue > 10 days' },
      });
    }
  }
}
