import { IsOptional, IsString } from 'class-validator';

import { ErrandAction } from '@/data-contracts/supportmanagement/data-contracts';

export class SupportErrandAction implements ErrandAction {
  @IsString()
  @IsOptional()
  id?: string;
  @IsString()
  @IsOptional()
  actionName?: string;
  @IsString()
  @IsOptional()
  executeAfter?: string;
  @IsString()
  @IsOptional()
  actionConfigId?: string;
  @IsString()
  @IsOptional()
  displayValue?: string;
}
