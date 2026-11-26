import { IsOptional, IsString } from 'class-validator';

import { ContactChannel } from '@/data-contracts/supportmanagement/data-contracts';

export class SupportContactChannel implements ContactChannel {
  @IsString()
  @IsOptional()
  type?: string;
  @IsString()
  @IsOptional()
  value?: string;
}
