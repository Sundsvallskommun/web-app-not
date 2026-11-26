import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

import { Errand, ErrandLifecycleEnum, Priority } from '@/data-contracts/supportmanagement/data-contracts';
import { ApiResponse } from '@/interfaces/api-service.interface';

import { SupportErrandAction } from './support-action.response';
import { SupportClassification } from './support-classification.response';
import { SupportExternalTag } from './support-external-tag.response';
import { SupportJsonParameter } from './support-json-parameter.response';
import { SupportErrandLabel } from './support-label.response';
import { SupportMeasure } from './support-measure.response';
import { SupportNotification } from './support-notification.response';
import { SupportParameter } from './support-parameter.response';
import { SupportErrandPhase } from './support-phase.response';
import { SupportErrandProcess } from './support-process.response';
import { SupportStakeholder } from './support-stakeholder.response';
import { SupportSuspension } from './support-suspension.response';

/** A SupportManagement errand, exactly as SupportManagement returns it. */
export class SupportErrand implements Omit<Errand, 'jsonParameters'> {
  @IsString()
  @IsOptional()
  id?: string;
  @IsString()
  @IsOptional()
  errandNumber?: string;
  @IsString()
  @IsOptional()
  title?: string;
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SupportStakeholder)
  @IsOptional()
  stakeholders?: SupportStakeholder[];
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SupportExternalTag)
  @IsOptional()
  externalTags?: SupportExternalTag[];
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SupportParameter)
  @IsOptional()
  parameters?: SupportParameter[];
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SupportJsonParameter)
  @IsOptional()
  jsonParameters?: SupportJsonParameter[];
  @ValidateNested()
  @Type(() => SupportClassification)
  @IsOptional()
  classification?: SupportClassification;
  @IsString()
  @IsOptional()
  status?: string;
  @IsEnum(ErrandLifecycleEnum)
  @IsOptional()
  lifecycle?: ErrandLifecycleEnum;
  @IsString()
  @IsOptional()
  resolution?: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsString()
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
  @ValidateNested()
  @Type(() => SupportSuspension)
  @IsOptional()
  suspension?: SupportSuspension;
  @IsBoolean()
  @IsOptional()
  businessRelated?: boolean;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SupportErrandLabel)
  @IsOptional()
  labels?: SupportErrandLabel[];
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SupportErrandPhase)
  @IsOptional()
  phases?: SupportErrandPhase[];
  @IsString()
  @IsOptional()
  activePhaseId?: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SupportNotification)
  @IsOptional()
  activeNotifications?: SupportNotification[];
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SupportErrandAction)
  @IsOptional()
  actions?: SupportErrandAction[];
  @ValidateNested()
  @Type(() => SupportErrandProcess)
  @IsOptional()
  process?: SupportErrandProcess;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SupportMeasure)
  @IsOptional()
  measures?: SupportMeasure[];
  @IsString()
  @IsOptional()
  created?: string;
  @IsString()
  @IsOptional()
  modified?: string;
  @IsString()
  @IsOptional()
  touched?: string;
  @IsString()
  @IsOptional()
  deleted?: string;
  @IsString()
  @IsOptional()
  deletedBy?: string;
  @IsNumber()
  @IsOptional()
  version?: number;
}

export class SupportErrandApiResponse implements ApiResponse<SupportErrand> {
  @ValidateNested()
  @Type(() => SupportErrand)
  data!: SupportErrand;
  @IsString()
  message!: string;
}
