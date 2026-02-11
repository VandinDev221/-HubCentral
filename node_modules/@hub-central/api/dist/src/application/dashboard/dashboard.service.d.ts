import { PrismaService } from '../../infrastructure/prisma/prisma.service';
export declare class DashboardService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getMetrics(): Promise<{
        totalClients: number;
        activeClients: number;
        suspendedClients: number;
        monthlyRevenue: number;
        mrr: number;
        pendingInvoices: number;
        overdueInvoices: number;
    }>;
}
