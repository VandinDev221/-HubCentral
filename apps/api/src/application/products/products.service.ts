import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateProductDto } from '../../presentation/products/dto/create-product.dto';
import { UpdateProductDto } from '../../presentation/products/dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateProductDto, userId: string) {
    return this.prisma.product.create({
      data: {
        userId,
        name: dto.name,
        price: dto.price,
        type: dto.type,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.product.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string, userId: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, userId },
      include: { _count: { select: { subscriptions: true } } },
    });
    if (!product) throw new NotFoundException('Produto não encontrado');
    return product;
  }

  async update(id: string, dto: UpdateProductDto, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.product.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.price !== undefined && { price: dto.price }),
        ...(dto.type && { type: dto.type }),
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    await this.prisma.product.delete({ where: { id } });
    return { success: true };
  }
}
