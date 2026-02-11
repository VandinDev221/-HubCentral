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
exports.SubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
let SubscriptionsService = class SubscriptionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const [client, product] = await Promise.all([
            this.prisma.client.findUnique({ where: { id: dto.clientId } }),
            this.prisma.product.findUnique({ where: { id: dto.productId } }),
        ]);
        if (!client)
            throw new common_1.NotFoundException('Cliente não encontrado');
        if (!product)
            throw new common_1.NotFoundException('Produto não encontrado');
        const existing = await this.prisma.subscription.findFirst({
            where: {
                clientId: dto.clientId,
                productId: dto.productId,
                status: 'active',
            },
        });
        if (existing) {
            throw new common_1.ConflictException('Cliente já possui assinatura ativa para este produto');
        }
        const startDate = dto.startDate ? new Date(dto.startDate) : new Date();
        const nextBillingDate = new Date(startDate);
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
        return this.prisma.subscription.create({
            data: {
                clientId: dto.clientId,
                productId: dto.productId,
                price: dto.price,
                startDate,
                nextBillingDate,
                status: 'active',
            },
            include: { client: true, product: true },
        });
    }
    async findAll(page = 1, limit = 20, status) {
        const skip = (page - 1) * limit;
        const where = status ? { status } : {};
        const [data, total] = await Promise.all([
            this.prisma.subscription.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: { client: true, product: true },
            }),
            this.prisma.subscription.count({ where }),
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
        const sub = await this.prisma.subscription.findUnique({
            where: { id },
            include: { client: true, product: true, invoices: true },
        });
        if (!sub)
            throw new common_1.NotFoundException('Assinatura não encontrada');
        return sub;
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.subscription.update({
            where: { id },
            data: {
                ...(dto.price !== undefined && { price: dto.price }),
                ...(dto.status && { status: dto.status }),
                ...(dto.nextBillingDate && { nextBillingDate: new Date(dto.nextBillingDate) }),
            },
            include: { client: true, product: true },
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.subscription.delete({ where: { id } });
        return { success: true };
    }
};
exports.SubscriptionsService = SubscriptionsService;
exports.SubscriptionsService = SubscriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubscriptionsService);
//# sourceMappingURL=subscriptions.service.js.map