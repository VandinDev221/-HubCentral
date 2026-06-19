import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ClientsService } from '../../application/clients/clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/user.decorator';

@ApiTags('Clients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) { }

  @Post()
  @ApiOperation({ summary: 'Criar cliente' })
  create(@Body() dto: CreateClientDto, @CurrentUser() user: { id: string}) {
    return this.clientsService.create(dto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar clientes' })
  findAll(
    @CurrentUser() user: { id: string },
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ) {
    return this.clientsService.findAll(user.id, Number(page) || 1, Number(limit) || 20, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar cliente por ID' })
  findOne(@Param('id') id: string, @CurrentUser() user: { id: string}) {
    return this.clientsService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar cliente' })
  update(@Param('id') id: string, @Body() dto: UpdateClientDto, @CurrentUser() user: { id: string}) {
    return this.clientsService.update(id, dto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover cliente' })
  remove(@Param('id') id: string, @CurrentUser() user: { id: string}) {
    return this.clientsService.remove(id, user.id);
  }
}
