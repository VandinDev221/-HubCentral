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
exports.AccessService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const OVERDUE_GRACE_DAYS = 10;
let AccessService = class AccessService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async checkAccess(clientId) {
        const client = await this.prisma.client.findUnique({
            where: { id: clientId },
            include: {
                invoices: {
                    where: { status: 'overdue' },
                    orderBy: { dueDate: 'asc' },
                    take: 1,
                },
                subscriptions: { where: { status: 'active' }, include: { product: true } },
            },
        });
        if (!client)
            throw new common_1.NotFoundException('Cliente não encontrado');
        if (client.status === 'suspended') {
            return {
                active: false,
                expiresAt: null,
                reason: 'Cliente suspenso por inadimplência ou decisão administrativa.',
            };
        }
        const now = new Date();
        const cutoffOverdue = new Date(now);
        cutoffOverdue.setDate(cutoffOverdue.getDate() - OVERDUE_GRACE_DAYS);
        const hasOverdueBeyondGrace = await this.prisma.invoice.findFirst({
            where: {
                clientId,
                status: 'overdue',
                dueDate: { lt: cutoffOverdue },
            },
        });
        if (hasOverdueBeyondGrace) {
            return {
                active: false,
                expiresAt: null,
                reason: 'Acesso bloqueado: fatura em atraso há mais de 10 dias.',
            };
        }
        const nextBilling = client.subscriptions
            .filter((s) => s.status === 'active')
            .map((s) => s.nextBillingDate)
            .sort((a, b) => a.getTime() - b.getTime())[0];
        return {
            active: true,
            expiresAt: nextBilling ? nextBilling.toISOString().split('T')[0] : null,
        };
    }
};
exports.AccessService = AccessService;
exports.AccessService = AccessService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AccessService);
//# sourceMappingURL=access.service.js.map