import { Controller, Get, Head } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';

@Controller()
export class RootController {
  @Get()
  @Head()
  @Public()
  root() {
    return {
      name: 'Hub Central API',
      version: '1.0',
      health: '/v1/health',
      docs: '/api/docs',
    };
  }
}
