import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SubscriptionsService } from '../../application/subscriptions/subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/user.decorator';

@ApiTags('Subscriptions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) { }

  @Post()
  @ApiOperation({ summary: 'Criar assinatura' })
  create(@Body() dto: CreateSubscriptionDto, @CurrentUser() user: { id: string}) {
    return this.subscriptionsService.create(dto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar assinaturas' })
  findAll(
    @CurrentUser() user: { id: string },
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ) {
    return this.subscriptionsService.findAll(user.id, Number(page) || 1, Number(limit) || 20, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar assinatura por ID' })
  findOne(@Param('id') id: string, @CurrentUser() user: { id: string}) {
    return this.subscriptionsService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar assinatura' })
  update(@Param('id') id: string, @Body() dto: UpdateSubscriptionDto, @CurrentUser() user: { id: string}) {
    return this.subscriptionsService.update(id, dto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancelar assinatura' })
  remove(@Param('id') id: string, @CurrentUser() user: { id: string}) {
    return this.subscriptionsService.remove(id, user.id);
  }
}
