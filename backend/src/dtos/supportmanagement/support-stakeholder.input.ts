import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

import { Stakeholder } from '@/data-contracts/supportmanagement/data-contracts';
import { SupportContactChannel } from '@/responses/supportmanagement/support-contact-channel.response';

import { SupportParameterInput } from './support-parameter.input';

export class SupportStakeholderInput implements Stakeholder {
  @IsString()
  @IsOptional()
  externalId?: string;
  @IsString()
  @IsOptional()
  externalIdType?: string;
  @IsString()
  @IsOptional()
  role?: string;
  @IsString()
  @IsOptional()
  city?: string;
  @IsString()
  @IsOptional()
  organizationName?: string;
  @IsString()
  @IsOptional()
  firstName?: string;
  @IsString()
  @IsOptional()
  lastName?: string;
  @IsString()
  @IsOptional()
  address?: string;
  @IsString()
  @IsOptional()
  careOf?: string;
  @IsString()
  @IsOptional()
  zipCode?: string;
  @IsString()
  @IsOptional()
  country?: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SupportContactChannel)
  @IsOptional()
  contactChannels?: SupportContactChannel[];
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SupportParameterInput)
  @IsOptional()
  parameters?: SupportParameterInput[];
}
