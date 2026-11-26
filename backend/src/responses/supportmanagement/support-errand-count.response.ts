import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

import { CountResponse } from '@/data-contracts/supportmanagement/data-contracts';
import { ApiResponse } from '@/interfaces/api-service.interface';

export class SupportErrandCount implements CountResponse {
  @IsNumber()
  @IsOptional()
  count?: number;
}

export class SupportErrandCountApiResponse implements ApiResponse<SupportErrandCount> {
  @ValidateNested()
  @Type(() => SupportErrandCount)
  data!: SupportErrandCount;
  @IsString()
  message!: string;
}
