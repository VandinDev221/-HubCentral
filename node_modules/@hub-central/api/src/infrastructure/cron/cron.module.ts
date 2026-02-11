import { Module } from '@nestjs/common';
import { BillingCron } from './billing.cron';
import { OverdueService } from '../../application/overdue/overdue.service';
import { BillingService } from '../../application/billing/billing.service';

@Module({
  providers: [BillingCron, OverdueService, BillingService],
})
export class CronModule {}
