import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

import { ErrandLabel, LabelAttribute } from '@/data-contracts/supportmanagement/data-contracts';

export class SupportLabelAttribute implements LabelAttribute {
  @IsString()
  key!: string;
  @IsString()
  value!: string;
}

export class SupportErrandLabel implements ErrandLabel {
  @IsString()
  @IsOptional()
  id?: string;
  @IsNumber()
  @IsOptional()
  version?: number;
  @IsString()
  @IsOptional()
  classification?: string;
  @IsString()
  @IsOptional()
  classificationDisplayName?: string;
  @IsString()
  @IsOptional()
  displayName?: string;
  @IsString()
  @IsOptional()
  resourcePath?: string;
  @IsString()
  @IsOptional()
  resourceName?: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SupportLabelAttribute)
  @IsOptional()
  attributes?: SupportLabelAttribute[];
}
