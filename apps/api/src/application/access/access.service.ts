import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

const OVERDUE_GRACE_DAYS = 10;

@Injectable()
export class AccessService {
  constructor(private readonly prisma: PrismaService) {}

  async checkAccess(clientId: string): Promise<{ active: boolean; expiresAt: string | null; reason?: string }> {
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
      include: {
        invoices: {
          where: { status: 'overdue' },
          orderBy: { dueDate: 'asc' },
          take: 1,
        },
        subscriptions: { where: { status: 'active' }, include: { product: true } },
      },
    });

    if (!client) throw new NotFoundException('Cliente não encontrado');

    if (client.status === 'suspended') {
      return {
        active: false,
        expiresAt: null,
        reason: 'Cliente suspenso por inadimplência ou decisão administrativa.',
      };
    }

    const now = new Date();
    const cutoffOverdue = new Date(now);
    cutoffOverdue.setDate(cutoffOverdue.getDate() - OVERDUE_GRACE_DAYS);

    const hasOverdueBeyondGrace = await this.prisma.invoice.findFirst({
      where: {
        clientId,
        status: 'overdue',
        dueDate: { lt: cutoffOverdue },
      },
    });

    if (hasOverdueBeyondGrace) {
      return {
        active: false,
        expiresAt: null,
        reason: 'Acesso bloqueado: fatura em atraso há mais de 10 dias.',
      };
    }

    const nextBilling = client.subscriptions
      .filter((s: { status: string }) => s.status === 'active')
      .map((s: { nextBillingDate: Date }) => s.nextBillingDate)
      .sort((a: Date, b: Date) => a.getTime() - b.getTime())[0];

    return {
      active: true,
      expiresAt: nextBilling ? nextBilling.toISOString().split('T')[0] : null,
    };
  }
}
