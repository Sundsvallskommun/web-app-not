import { IsOptional, IsString } from 'class-validator';

import { Suspension } from '@/data-contracts/supportmanagement/data-contracts';

export class SupportSuspension implements Suspension {
  @IsString()
  @IsOptional()
  suspendedFrom?: string;
  @IsString()
  @IsOptional()
  suspendedTo?: string;
}
