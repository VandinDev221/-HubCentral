import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateSubscriptionDto } from '../../presentation/subscriptions/dto/create-subscription.dto';
import { UpdateSubscriptionDto } from '../../presentation/subscriptions/dto/update-subscription.dto';
export declare class SubscriptionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateSubscriptionDto): Promise<{
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
        product: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            type: string;
            price: import("@prisma/client/runtime/library").Decimal;
        };
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
        createdAt: Date;
        updatedAt: Date;
        status: string;
        price: import("@prisma/client/runtime/library").Decimal;
        clientId: string;
        productId: string;
        startDate: Date;
        nextBillingDate: Date;
        paymentProvider: string | null;
    }>;
    update(id: string, dto: UpdateSubscriptionDto): Promise<{
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
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
