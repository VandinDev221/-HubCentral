import { InvoicesService } from '../../application/invoices/invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
export declare class InvoicesController {
    private readonly invoicesService;
    constructor(invoicesService: InvoicesService);
    create(dto: CreateInvoiceDto): Promise<{
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
    markAsPaid(id: string): Promise<{
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
