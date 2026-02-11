import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditService } from '../../infrastructure/audit/audit.service';
import { CreateClientDto } from '../../presentation/clients/dto/create-client.dto';
import { UpdateClientDto } from '../../presentation/clients/dto/update-client.dto';
export declare class ClientsService {
    private readonly prisma;
    private readonly audit;
    constructor(prisma: PrismaService, audit: AuditService);
    create(dto: CreateClientDto, userId?: string): Promise<{
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        document: string;
        phone: string | null;
        status: string;
    }>;
    findAll(page?: number, limit?: number, status?: string): Promise<{
        data: ({
            _count: {
                subscriptions: number;
                invoices: number;
            };
        } & {
            id: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            document: string;
            phone: string | null;
            status: string;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<{
        subscriptions: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                type: string;
                price: import("@prisma/client/runtime/library").Decimal;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            price: import("@prisma/client/runtime/library").Decimal;
            clientId: string;
            productId: string;
            startDate: Date;
            nextBillingDate: Date;
            paymentProvider: string | null;
        })[];
        invoices: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            dueDate: Date;
            clientId: string;
            subscriptionId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            paidAt: Date | null;
        }[];
    } & {
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        document: string;
        phone: string | null;
        status: string;
    }>;
    update(id: string, dto: UpdateClientDto, userId?: string): Promise<{
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        document: string;
        phone: string | null;
        status: string;
    }>;
    remove(id: string, userId?: string): Promise<{
        success: boolean;
    }>;
}
