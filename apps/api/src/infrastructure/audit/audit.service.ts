import { Injectable } from '@nestjs/common';
import type { InputJsonValue } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(params: {
    action: string;
    entity: string;
    entityId?: string;
    payload?: Record<string, unknown>;
    userId?: string;
  }) {
    await this.prisma.auditLog.create({
      data: {
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        payload: (params.payload ?? undefined) as InputJsonValue | undefined,
        userId: params.userId,
      },
    });
  }
}
