import { IsOptional, IsString } from 'class-validator';

import { ExternalTag } from '@/data-contracts/supportmanagement/data-contracts';

export class SupportExternalTag implements ExternalTag {
  @IsString()
  @IsOptional()
  key?: string;
  @IsString()
  @IsOptional()
  value?: string;
}
