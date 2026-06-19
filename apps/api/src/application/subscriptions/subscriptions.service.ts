import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateSubscriptionDto } from '../../presentation/subscriptions/dto/create-subscription.dto';
import { UpdateSubscriptionDto } from '../../presentation/subscriptions/dto/update-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateSubscriptionDto, userId: string) {
    const [client, product] = await Promise.all([
      this.prisma.client.findFirst({ where: { id: dto.clientId, userId } }),
      this.prisma.product.findFirst({ where: { id: dto.productId, userId } }),
    ]);
    if (!client) throw new NotFoundException('Cliente não encontrado');
    if (!product) throw new NotFoundException('Produto não encontrado');

    const existing = await this.prisma.subscription.findFirst({
      where: {
        clientId: dto.clientId,
        productId: dto.productId,
        status: 'active',
        client: { userId },
      },
    });
    if (existing) {
      throw new ConflictException('Cliente já possui assinatura ativa para este produto');
    }

    const startDate = dto.startDate ? new Date(dto.startDate) : new Date();
    const nextBillingDate = new Date(startDate);
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

    return this.prisma.subscription.create({
      data: {
        clientId: dto.clientId,
        productId: dto.productId,
        price: dto.price,
        startDate,
        nextBillingDate,
        status: 'active',
      },
      include: { client: true, product: true },
    });
  }

  async findAll(userId: string, page = 1, limit = 20, status?: string) {
    const skip = (page - 1) * limit;
    const where = {
      client: { userId },
      ...(status ? { status } : {}),
    };
    const [data, total] = await Promise.all([
      this.prisma.subscription.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { client: true, product: true },
      }),
      this.prisma.subscription.count({ where }),
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
    const sub = await this.prisma.subscription.findFirst({
      where: { id, client: { userId } },
      include: { client: true, product: true, invoices: true },
    });
    if (!sub) throw new NotFoundException('Assinatura não encontrada');
    return sub;
  }

  async update(id: string, dto: UpdateSubscriptionDto, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.subscription.update({
      where: { id },
      data: {
        ...(dto.price !== undefined && { price: dto.price }),
        ...(dto.status && { status: dto.status }),
        ...(dto.nextBillingDate && { nextBillingDate: new Date(dto.nextBillingDate) }),
      },
      include: { client: true, product: true },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    await this.prisma.subscription.delete({ where: { id } });
    return { success: true };
  }
}
