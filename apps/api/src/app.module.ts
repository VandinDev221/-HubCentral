import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './presentation/auth/auth.module';
import { ClientsModule } from './presentation/clients/clients.module';
import { ProductsModule } from './presentation/products/products.module';
import { SubscriptionsModule } from './presentation/subscriptions/subscriptions.module';
import { InvoicesModule } from './presentation/invoices/invoices.module';
import { AccessModule } from './presentation/access/access.module';
import { DashboardModule } from './presentation/dashboard/dashboard.module';
import { HealthModule } from './presentation/health/health.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { AuditModule } from './infrastructure/audit/audit.module';
import { CronModule } from './infrastructure/cron/cron.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './presentation/auth/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuditModule,
    CronModule,
    AuthModule,
    ClientsModule,
    ProductsModule,
    SubscriptionsModule,
    InvoicesModule,
    AccessModule,
    DashboardModule,
    HealthModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
