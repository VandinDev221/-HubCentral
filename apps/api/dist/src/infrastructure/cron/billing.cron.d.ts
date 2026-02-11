import { OverdueService } from '../../application/overdue/overdue.service';
import { BillingService } from '../../application/billing/billing.service';
export declare class BillingCron {
    private readonly overdueService;
    private readonly billingService;
    constructor(overdueService: OverdueService, billingService: BillingService);
    handleDaily(): Promise<void>;
    handleMonthly(): Promise<void>;
}
