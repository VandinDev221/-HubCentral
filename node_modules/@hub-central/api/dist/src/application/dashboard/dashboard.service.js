"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
let DashboardService = class DashboardService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMetrics() {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        const [totalClients, activeClients, suspendedClients, pendingInvoices, overdueInvoices, paidThisMonth, activeSubscriptions,] = await Promise.all([
            this.prisma.client.count(),
            this.prisma.client.count({ where: { status: 'active' } }),
            this.prisma.client.count({ where: { status: 'suspended' } }),
            this.prisma.invoice.count({ where: { status: 'pending' } }),
            this.prisma.invoice.count({ where: { status: 'overdue' } }),
            this.prisma.invoice.aggregate({
                where: {
                    status: 'paid',
                    paidAt: { gte: startOfMonth, lte: endOfMonth },
                },
                _sum: { amount: true },
            }),
            this.prisma.subscription.findMany({
                where: { status: 'active' },
                select: { price: true },
            }),
        ]);
        const monthlyRevenue = Number(paidThisMonth._sum.amount ?? 0);
        const mrr = activeSubscriptions.reduce((acc, s) => acc + Number(s.price), 0);
        return {
            totalClients,
            activeClients,
            suspendedClients,
            monthlyRevenue,
            mrr,
            pendingInvoices,
            overdueInvoices,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map