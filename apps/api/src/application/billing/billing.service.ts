import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditService } from '../../infrastructure/audit/audit.service';

@Injectable()
export class BillingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async generateMonthlyInvoices(): Promise<number> {
    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const subscriptions = await this.prisma.subscription.findMany({
      where: {
        status: 'active',
        nextBillingDate: { lte: firstOfMonth },
      },
      include: { client: true, product: true },
    });

    let created = 0;
    for (const sub of subscriptions) {
      const dueDate = new Date(now.getFullYear(), now.getMonth(), 25);
      const existing = await this.prisma.invoice.findFirst({
        where: {
          subscriptionId: sub.id,
          dueDate: { gte: firstOfMonth },
        },
      });
      if (existing) continue;

      const invoice = await this.prisma.invoice.create({
        data: {
          clientId: sub.clientId,
          subscriptionId: sub.id,
          amount: sub.price,
          dueDate,
          status: 'pending',
        },
      });

      await this.prisma.subscription.update({
        where: { id: sub.id },
        data: {
          nextBillingDate: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        },
      });

      await this.audit.log({
        action: 'INVOICE_CREATED',
        entity: 'Invoice',
        entityId: invoice.id,
        payload: { amount: Number(sub.price), subscriptionId: sub.id },
      });
      created++;
    }
    return created;
  }
}
