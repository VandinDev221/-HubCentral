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
exports.ClientsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const audit_service_1 = require("../../infrastructure/audit/audit.service");
let ClientsService = class ClientsService {
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async create(dto, userId) {
        const existing = await this.prisma.client.findFirst({
            where: { OR: [{ email: dto.email }, { document: dto.document.replace(/\D/g, '') }] },
        });
        if (existing) {
            throw new common_1.ConflictException('Cliente já existe com este email ou documento');
        }
        const client = await this.prisma.client.create({
            data: {
                name: dto.name,
                document: dto.document.replace(/\D/g, ''),
                email: dto.email,
                phone: dto.phone ?? null,
                status: 'active',
            },
        });
        await this.audit.log({
            action: 'CLIENT_CREATED',
            entity: 'Client',
            entityId: client.id,
            payload: { name: client.name },
            userId,
        });
        return client;
    }
    async findAll(page = 1, limit = 20, status) {
        const skip = (page - 1) * limit;
        const where = status ? { status } : {};
        const [data, total] = await Promise.all([
            this.prisma.client.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: { _count: { select: { subscriptions: true, invoices: true } } },
            }),
            this.prisma.client.count({ where }),
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
        const client = await this.prisma.client.findUnique({
            where: { id },
            include: {
                subscriptions: { include: { product: true } },
                invoices: { orderBy: { dueDate: 'desc' }, take: 12 },
            },
        });
        if (!client)
            throw new common_1.NotFoundException('Cliente não encontrado');
        return client;
    }
    async update(id, dto, userId) {
        await this.findOne(id);
        const client = await this.prisma.client.update({
            where: { id },
            data: {
                ...(dto.name && { name: dto.name }),
                ...(dto.document && { document: dto.document.replace(/\D/g, '') }),
                ...(dto.email && { email: dto.email }),
                ...(dto.phone !== undefined && { phone: dto.phone }),
                ...(dto.status && { status: dto.status }),
            },
        });
        await this.audit.log({
            action: 'CLIENT_UPDATED',
            entity: 'Client',
            entityId: id,
            userId,
        });
        return client;
    }
    async remove(id, userId) {
        await this.findOne(id);
        await this.prisma.client.delete({ where: { id } });
        await this.audit.log({
            action: 'CLIENT_DELETED',
            entity: 'Client',
            entityId: id,
            userId,
        });
        return { success: true };
    }
};
exports.ClientsService = ClientsService;
exports.ClientsService = ClientsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], ClientsService);
//# sourceMappingURL=clients.service.js.map