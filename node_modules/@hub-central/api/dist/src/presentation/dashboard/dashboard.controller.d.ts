import { DashboardService } from '../../application/dashboard/dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
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
