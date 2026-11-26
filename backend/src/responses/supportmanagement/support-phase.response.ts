import { IsOptional, IsString } from 'class-validator';

import { ErrandPhase } from '@/data-contracts/supportmanagement/data-contracts';

export class SupportErrandPhase implements ErrandPhase {
  @IsString()
  @IsOptional()
  phaseId?: string;
  @IsString()
  @IsOptional()
  name?: string;
  @IsString()
  @IsOptional()
  displayName?: string;
  @IsString()
  @IsOptional()
  started?: string;
  @IsString()
  @IsOptional()
  ended?: string;
}
