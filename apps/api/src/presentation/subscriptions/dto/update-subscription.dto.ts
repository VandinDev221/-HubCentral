import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateSubscriptionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ enum: ['active', 'suspended', 'cancelled'] })
  @IsOptional()
  @IsString()
  status?: 'active' | 'suspended' | 'cancelled';

  @ApiPropertyOptional()
  @IsOptional()
  nextBillingDate?: Date;
}
