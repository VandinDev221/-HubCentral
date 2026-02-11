import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { OverdueService } from '../../application/overdue/overdue.service';
import { BillingService } from '../../application/billing/billing.service';

@Injectable()
export class BillingCron {
  constructor(
    private readonly overdueService: OverdueService,
    private readonly billingService: BillingService,
  ) {}

  @Cron('0 2 * * *')
  async handleDaily() {
    await this.overdueService.updateOverdueInvoices();
    await this.overdueService.suspendOverdueClients();
  }

  @Cron('0 3 1 * *')
  async handleMonthly() {
    const count = await this.billingService.generateMonthlyInvoices();
    console.log(`[Cron] Generated ${count} monthly invoices`);
  }
}
