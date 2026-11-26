import { Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';

import { SupportJsonParameterInput } from './support-json-parameter.input';
import { SupportLabelInput } from './support-label.input';
import { SupportStakeholderInput } from './support-stakeholder.input';

/** What a new errand can be created with on top of the defaults. Everything else is set through PATCH afterwards. */
export class NewSupportErrandDto {
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
  @Type(() => SupportJsonParameterInput)
  @IsOptional()
  jsonParameters?: SupportJsonParameterInput[];
}
