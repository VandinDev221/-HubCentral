import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from '../../application/clients/clients.service';

@Module({
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
