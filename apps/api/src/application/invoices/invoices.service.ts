import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditService } from '../../infrastructure/audit/audit.service';
import { CreateInvoiceDto } from '../../presentation/invoices/dto/create-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) { }

  async create(dto: CreateInvoiceDto, userId: string) {
    const client = await this.prisma.client.findFirst({
      where: { id: dto.clientId, userId },
    });
    if (!client) throw new NotFoundException('Cliente não encontrado');

    const subscription = await this.prisma.subscription.findFirst({
      where: { id: dto.subscriptionId, clientId: dto.clientId, client: { userId } },
    });
    if (!subscription) throw new NotFoundException('Assinatura não encontrada');

    const invoice = await this.prisma.invoice.create({
      data: {
        clientId: dto.clientId,
        subscriptionId: dto.subscriptionId,
        amount: dto.amount,
        dueDate: new Date(dto.dueDate),
        status: 'pending',
      },
      include: { client: true, subscription: true },
    });
    await this.audit.log({
      action: 'INVOICE_CREATED',
      entity: 'Invoice',
      entityId: invoice.id,
      payload: { amount: Number(invoice.amount), clientId: invoice.clientId },
      userId,
    });
    return invoice;
  }

  async findAll(userId: string, page = 1, limit = 20, status?: string) {
    const skip = (page - 1) * limit;
    const where = {
      client: { userId },
      ...(status ? { status } : {}),
    };
    const [data, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where,
        skip,
        take: limit,
        orderBy: { dueDate: 'desc' },
        include: { client: true, subscription: { include: { product: true } } },
      }),
      this.prisma.invoice.count({ where }),
    ]);
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, userId: string) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { id, client: { userId } },
      include: { client: true, subscription: { include: { product: true } } },
    });
    if (!invoice) throw new NotFoundException('Fatura não encontrada');
    return invoice;
  }

  async markAsPaid(id: string, userId: string) {
    const invoice = await this.findOne(id, userId);
    const paidAt = new Date();
    await this.prisma.$transaction([
      this.prisma.invoice.update({
        where: { id },
        data: { status: 'paid', paidAt },
      }),
      this.prisma.subscription.update({
        where: { id: invoice.subscriptionId },
        data: {
          nextBillingDate: new Date(paidAt.getFullYear(), paidAt.getMonth() + 1, 1),
        },
      }),
    ]);
    await this.audit.log({
      action: 'INVOICE_PAID',
      entity: 'Invoice',
      entityId: id,
      payload: { amount: Number(invoice.amount), paidAt: paidAt.toISOString() },
      userId,
    });
    return this.findOne(id, userId);
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    await this.prisma.invoice.delete({ where: { id } });
    return { success: true };
  }
}
