import { IsOptional, IsString } from 'class-validator';

import { Classification } from '@/data-contracts/supportmanagement/data-contracts';

export class SupportClassification implements Classification {
  @IsString()
  @IsOptional()
  category?: string;
  @IsString()
  @IsOptional()
  type?: string;
}
