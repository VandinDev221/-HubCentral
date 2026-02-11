import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditService } from '../../infrastructure/audit/audit.service';
import { CreateInvoiceDto } from '../../presentation/invoices/dto/create-invoice.dto';
export declare class InvoicesService {
    private readonly prisma;
    private readonly audit;
    constructor(prisma: PrismaService, audit: AuditService);
    create(dto: CreateInvoiceDto, userId?: string): Promise<{
        client: {
            id: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            document: string;
            phone: string | null;
            status: string;
        };
        subscription: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        dueDate: Date;
        clientId: string;
        subscriptionId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paidAt: Date | null;
    }>;
    findAll(page?: number, limit?: number, status?: string): Promise<{
        data: ({
            client: {
                id: string;
                email: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                document: string;
                phone: string | null;
                status: string;
            };
            subscription: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            dueDate: Date;
            clientId: string;
            subscriptionId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            paidAt: Date | null;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<{
        client: {
            id: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            document: string;
            phone: string | null;
            status: string;
        };
        subscription: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        dueDate: Date;
        clientId: string;
        subscriptionId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paidAt: Date | null;
    }>;
    markAsPaid(id: string, userId?: string): Promise<{
        client: {
            id: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            document: string;
            phone: string | null;
            status: string;
        };
        subscription: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        dueDate: Date;
        clientId: string;
        subscriptionId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paidAt: Date | null;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
