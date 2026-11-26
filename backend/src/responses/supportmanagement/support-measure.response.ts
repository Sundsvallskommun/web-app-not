import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

import { Measure } from '@/data-contracts/supportmanagement/data-contracts';
import { IsNullable } from '@/utils/custom-validation-classes';

import { SupportErrandAttachment } from './support-attachment.response';

export class SupportMeasure implements Measure {
  @IsString()
  @IsOptional()
  id?: string;
  @IsString()
  @IsOptional()
  responsibleUser?: string;
  @IsString()
  @IsOptional()
  type?: string;
  @IsString()
  @IsOptional()
  plannedStart?: string;
  @IsString()
  @IsOptional()
  plannedComplete?: string;
  @IsString()
  @IsOptional()
  executed?: string;
  @IsString()
  @IsOptional()
  addedByUser?: string;
  @IsString()
  @IsOptional()
  addedByRole?: string;
  @IsString()
  @IsOptional()
  goal?: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsString()
  @IsNullable()
  @IsOptional()
  accept?: string | null;
  @IsString()
  @IsOptional()
  acceptMotivation?: string;
  @IsString()
  @IsOptional()
  created?: string;
  @IsString()
  @IsOptional()
  modified?: string;
  @IsString()
  @IsOptional()
  status?: string;
  @IsString()
  @IsOptional()
  title?: string;
  @IsString()
  @IsOptional()
  dueAt?: string;
  @IsString()
  @IsOptional()
  completedAt?: string;
  @IsString()
  @IsNullable()
  @IsOptional()
  result?: string | null;
  @IsString()
  @IsOptional()
  resultText?: string;
  @IsString()
  @IsNullable()
  @IsOptional()
  decisionId?: string | null;
  @IsString()
  @IsNullable()
  @IsOptional()
  statementId?: string | null;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SupportErrandAttachment)
  @IsOptional()
  attachments?: SupportErrandAttachment[];
  @IsString()
  @IsOptional()
  createdBy?: string;
  @IsString()
  @IsOptional()
  modifiedBy?: string;
  @IsNumber()
  @IsOptional()
  version?: number;
}
