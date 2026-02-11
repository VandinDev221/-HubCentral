"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
const auth_module_1 = require("./presentation/auth/auth.module");
const clients_module_1 = require("./presentation/clients/clients.module");
const products_module_1 = require("./presentation/products/products.module");
const subscriptions_module_1 = require("./presentation/subscriptions/subscriptions.module");
const invoices_module_1 = require("./presentation/invoices/invoices.module");
const access_module_1 = require("./presentation/access/access.module");
const dashboard_module_1 = require("./presentation/dashboard/dashboard.module");
const prisma_module_1 = require("./infrastructure/prisma/prisma.module");
const audit_module_1 = require("./infrastructure/audit/audit.module");
const cron_module_1 = require("./infrastructure/cron/cron.module");
const core_1 = require("@nestjs/core");
const jwt_auth_guard_1 = require("./presentation/auth/guards/jwt-auth.guard");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            schedule_1.ScheduleModule.forRoot(),
            prisma_module_1.PrismaModule,
            audit_module_1.AuditModule,
            cron_module_1.CronModule,
            auth_module_1.AuthModule,
            clients_module_1.ClientsModule,
            products_module_1.ProductsModule,
            subscriptions_module_1.SubscriptionsModule,
            invoices_module_1.InvoicesModule,
            access_module_1.AccessModule,
            dashboard_module_1.DashboardModule,
        ],
        providers: [
            { provide: core_1.APP_GUARD, useClass: jwt_auth_guard_1.JwtAuthGuard },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map