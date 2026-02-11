import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AccessService } from '../../application/access/access.service';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Access')
@Controller('access')
export class AccessController {
  constructor(private readonly accessService: AccessService) {}

  @Get(':clientId')
  @Public()
  @ApiOperation({
    summary: 'Validar acesso do cliente (uso pelo PDV)',
    description: 'Retorna active: true/false. Se invoice overdue > 10 dias, active = false.',
  })
  check(@Param('clientId') clientId: string) {
    return this.accessService.checkAccess(clientId);
  }
}
