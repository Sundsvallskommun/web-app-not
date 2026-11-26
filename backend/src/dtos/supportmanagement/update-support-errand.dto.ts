import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';

import { Errand, Priority } from '@/data-contracts/supportmanagement/data-contracts';
import { SupportClassification } from '@/responses/supportmanagement/support-classification.response';
import { SupportExternalTag } from '@/responses/supportmanagement/support-external-tag.response';
import { SupportSuspension } from '@/responses/supportmanagement/support-suspension.response';

import { SupportJsonParameterInput } from './support-json-parameter.input';
import { SupportLabelInput } from './support-label.input';
import { SupportParameterInput } from './support-parameter.input';
import { SupportStakeholderInput } from './support-stakeholder.input';

type WritableErrandField =
  | 'title'
  | 'priority'
  | 'status'
  | 'resolution'
  | 'description'
  | 'channel'
  | 'reporterUserId'
  | 'assignedUserId'
  | 'assignedGroupId'
  | 'escalationEmail'
  | 'contactReason'
  | 'contactReasonDescription'
  | 'businessRelated'
  | 'classification'
  | 'suspension'
  | 'externalTags';

/**
 * A partial errand update: send only the fields that change. Server-managed fields (id, errandNumber,
 * created/modified, version, notifications, process, ...) are not accepted.
 */
export class UpdateSupportErrandDto implements Pick<Errand, WritableErrandField> {
  @IsString()
  @MaxLength(255)
  @IsOptional()
  title?: string;
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;
  @IsString()
  @IsOptional()
  status?: string;
  @IsString()
  @IsOptional()
  resolution?: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsString()
  @MaxLength(255)
  @IsOptional()
  channel?: string;
  @IsString()
  @IsOptional()
  reporterUserId?: string;
  @IsString()
  @IsOptional()
  assignedUserId?: string;
  @IsString()
  @IsOptional()
  assignedGroupId?: string;
  @IsString()
  @IsOptional()
  escalationEmail?: string;
  @IsString()
  @IsOptional()
  contactReason?: string;
  @IsString()
  @IsOptional()
  contactReasonDescription?: string;
  @IsBoolean()
  @IsOptional()
  businessRelated?: boolean;
  @ValidateNested()
  @Type(() => SupportClassification)
  @IsOptional()
  classification?: SupportClassification;
  @ValidateNested()
  @Type(() => SupportSuspension)
  @IsOptional()
  suspension?: SupportSuspension;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SupportExternalTag)
  @IsOptional()
  externalTags?: SupportExternalTag[];
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SupportLabelInput)
  @IsOptional()
  labels?: SupportLabelInput[];
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SupportStakeholderInput)
  @IsOptional()
  stakeholders?: SupportStakeholderInput[];
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SupportParameterInput)
  @IsOptional()
  parameters?: SupportParameterInput[];
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SupportJsonParameterInput)
  @IsOptional()
  jsonParameters?: SupportJsonParameterInput[];
}
