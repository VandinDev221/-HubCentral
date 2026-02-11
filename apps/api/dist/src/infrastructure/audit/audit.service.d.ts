import { PrismaService } from '../prisma/prisma.service';
export declare class AuditService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    log(params: {
        action: string;
        entity: string;
        entityId?: string;
        payload?: Record<string, unknown>;
        userId?: string;
    }): Promise<void>;
}
