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
exports.InvoicesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const audit_service_1 = require("../../infrastructure/audit/audit.service");
const OVERDUE_GRACE_DAYS = 10;
let InvoicesService = class InvoicesService {
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async create(dto, userId) {
        const invoice = await this.prisma.invoice.create({
            data: {
                clientId: dto.clientId,
                subscriptionId: dto.subscriptionId,
                amount: dto.amount,
                dueDate: new Date(dto.dueDate),
                status: 'pending',
            },
            include: { client: true, subscription: true },
        });
        await this.audit.log({
            action: 'INVOICE_CREATED',
            entity: 'Invoice',
            entityId: invoice.id,
            payload: { amount: Number(invoice.amount), clientId: invoice.clientId },
            userId,
        });
        return invoice;
    }
    async findAll(page = 1, limit = 20, status) {
        const skip = (page - 1) * limit;
        const where = status ? { status } : {};
        const [data, total] = await Promise.all([
            this.prisma.invoice.findMany({
                where,
                skip,
                take: limit,
                orderBy: { dueDate: 'desc' },
                include: { client: true, subscription: { include: { product: true } } },
            }),
            this.prisma.invoice.count({ where }),
        ]);
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const invoice = await this.prisma.invoice.findUnique({
            where: { id },
            include: { client: true, subscription: { include: { product: true } } },
        });
        if (!invoice)
            throw new common_1.NotFoundException('Fatura não encontrada');
        return invoice;
    }
    async markAsPaid(id, userId) {
        const invoice = await this.findOne(id);
        const paidAt = new Date();
        await this.prisma.$transaction([
            this.prisma.invoice.update({
                where: { id },
                data: { status: 'paid', paidAt },
            }),
            this.prisma.subscription.update({
                where: { id: invoice.subscriptionId },
                data: {
                    nextBillingDate: new Date(paidAt.getFullYear(), paidAt.getMonth() + 1, 1),
                },
            }),
        ]);
        await this.audit.log({
            action: 'INVOICE_PAID',
            entity: 'Invoice',
            entityId: id,
            payload: { amount: Number(invoice.amount), paidAt: paidAt.toISOString() },
            userId,
        });
        return this.findOne(id);
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.invoice.delete({ where: { id } });
        return { success: true };
    }
};
exports.InvoicesService = InvoicesService;
exports.InvoicesService = InvoicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], InvoicesService);
//# sourceMappingURL=invoices.service.js.map