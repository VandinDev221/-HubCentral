import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditService } from '../../infrastructure/audit/audit.service';
export declare class OverdueService {
    private readonly prisma;
    private readonly audit;
    constructor(prisma: PrismaService, audit: AuditService);
    updateOverdueInvoices(): Promise<void>;
    suspendOverdueClients(): Promise<void>;
}
