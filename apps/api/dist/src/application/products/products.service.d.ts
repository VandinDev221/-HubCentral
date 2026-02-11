import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateProductDto } from '../../presentation/products/dto/create-product.dto';
import { UpdateProductDto } from '../../presentation/products/dto/update-product.dto';
export declare class ProductsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateProductDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: string;
        price: import("@prisma/client/runtime/library").Decimal;
    }>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: string;
        price: import("@prisma/client/runtime/library").Decimal;
    }[]>;
    findOne(id: string): Promise<{
        _count: {
            subscriptions: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: string;
        price: import("@prisma/client/runtime/library").Decimal;
    }>;
    update(id: string, dto: UpdateProductDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: string;
        price: import("@prisma/client/runtime/library").Decimal;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
