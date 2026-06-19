import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from '../../application/products/products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/user.decorator';

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  @ApiOperation({ summary: 'Criar produto' })
  create(@Body() dto: CreateProductDto, @CurrentUser() user: { id: string}) {
    return this.productsService.create(dto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar produtos' })
  findAll(@CurrentUser() user: { id: string}) {
    return this.productsService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar produto por ID' })
  findOne(@Param('id') id: string, @CurrentUser() user: { id: string}) {
    return this.productsService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar produto' })
  update(@Param('id') id: string, @Body() dto: UpdateProductDto, @CurrentUser() user: { id: string}) {
    return this.productsService.update(id, dto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover produto' })
  remove(@Param('id') id: string, @CurrentUser() user: { id: string}) {
    return this.productsService.remove(id, user.id);
  }
}
