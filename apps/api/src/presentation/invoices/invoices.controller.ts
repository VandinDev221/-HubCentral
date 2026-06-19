import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InvoicesService } from '../../application/invoices/invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/user.decorator';

@ApiTags('Invoices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) { }

  @Post()
  @ApiOperation({ summary: 'Criar fatura' })
  create(@Body() dto: CreateInvoiceDto, @CurrentUser() user: { id: string}) {
    return this.invoicesService.create(dto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar faturas' })
  findAll(
    @CurrentUser() user: { id: string },
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ) {
    return this.invoicesService.findAll(user.id, Number(page) || 1, Number(limit) || 20, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar fatura por ID' })
  findOne(@Param('id') id: string, @CurrentUser() user: { id: string}) {
    return this.invoicesService.findOne(id, user.id);
  }

  @Post(':id/pay')
  @ApiOperation({ summary: 'Registrar pagamento' })
  markAsPaid(@Param('id') id: string, @CurrentUser() user: { id: string}) {
    return this.invoicesService.markAsPaid(id, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover fatura' })
  remove(@Param('id') id: string, @CurrentUser() user: { id: string}) {
    return this.invoicesService.remove(id, user.id);
  }
}
