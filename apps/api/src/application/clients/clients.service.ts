import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditService } from '../../infrastructure/audit/audit.service';
import { CreateClientDto } from '../../presentation/clients/dto/create-client.dto';
import { UpdateClientDto } from '../../presentation/clients/dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async create(dto: CreateClientDto, userId?: string) {
    const existing = await this.prisma.client.findFirst({
      where: { OR: [{ email: dto.email }, { document: dto.document.replace(/\D/g, '') }] },
    });
    if (existing) {
      throw new ConflictException('Cliente já existe com este email ou documento');
    }
    const client = await this.prisma.client.create({
      data: {
        name: dto.name,
        document: dto.document.replace(/\D/g, ''),
        email: dto.email,
        phone: dto.phone ?? null,
        status: 'active',
      },
    });
    await this.audit.log({
      action: 'CLIENT_CREATED',
      entity: 'Client',
      entityId: client.id,
      payload: { name: client.name },
      userId,
    });
    return client;
  }

  async findAll(page = 1, limit = 20, status?: string) {
    const skip = (page - 1) * limit;
    const where = status ? { status } : {};
    const [data, total] = await Promise.all([
      this.prisma.client.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { subscriptions: true, invoices: true } } },
      }),
      this.prisma.client.count({ where }),
    ]);
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: {
        subscriptions: { include: { product: true } },
        invoices: { orderBy: { dueDate: 'desc' }, take: 12 },
      },
    });
    if (!client) throw new NotFoundException('Cliente não encontrado');
    return client;
  }

  async update(id: string, dto: UpdateClientDto, userId?: string) {
    await this.findOne(id);
    const client = await this.prisma.client.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.document && { document: dto.document.replace(/\D/g, '') }),
        ...(dto.email && { email: dto.email }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
        ...(dto.status && { status: dto.status }),
      },
    });
    await this.audit.log({
      action: 'CLIENT_UPDATED',
      entity: 'Client',
      entityId: id,
      userId,
    });
    return client;
  }

  async remove(id: string, userId?: string) {
    await this.findOne(id);
    await this.prisma.client.delete({ where: { id } });
    await this.audit.log({
      action: 'CLIENT_DELETED',
      entity: 'Client',
      entityId: id,
      userId,
    });
    return { success: true };
  }
}
