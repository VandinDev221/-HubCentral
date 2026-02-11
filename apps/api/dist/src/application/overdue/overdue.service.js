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
exports.OverdueService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const audit_service_1 = require("../../infrastructure/audit/audit.service");
const OVERDUE_GRACE_DAYS = 10;
let OverdueService = class OverdueService {
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async updateOverdueInvoices() {
        const now = new Date();
        const invoices = await this.prisma.invoice.findMany({
            where: {
                status: 'pending',
                dueDate: { lt: now },
            },
        });
        for (const inv of invoices) {
            await this.prisma.invoice.update({
                where: { id: inv.id },
                data: { status: 'overdue' },
            });
        }
    }
    async suspendOverdueClients() {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - OVERDUE_GRACE_DAYS);
        const overdueInvoices = await this.prisma.invoice.findMany({
            where: {
                status: 'overdue',
                dueDate: { lt: cutoff },
            },
            select: { clientId: true },
            distinct: ['clientId'],
        });
        const clientIds = [...new Set(overdueInvoices.map((i) => i.clientId))];
        for (const clientId of clientIds) {
            const client = await this.prisma.client.findUnique({
                where: { id: clientId },
                include: { subscriptions: true },
            });
            if (!client || client.status === 'suspended')
                continue;
            await this.prisma.$transaction([
                this.prisma.client.update({
                    where: { id: clientId },
                    data: { status: 'suspended' },
                }),
                ...client.subscriptions.map((s) => this.prisma.subscription.update({
                    where: { id: s.id },
                    data: { status: 'suspended' },
                })),
            ]);
            await this.audit.log({
                action: 'AUTO_BLOCK',
                entity: 'Client',
                entityId: clientId,
                payload: { reason: 'Invoice overdue > 10 days' },
            });
        }
    }
};
exports.OverdueService = OverdueService;
exports.OverdueService = OverdueService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], OverdueService);
//# sourceMappingURL=overdue.service.js.map