import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

import { Parameter } from '@/data-contracts/supportmanagement/data-contracts';

export class SupportParameter implements Parameter {
  @IsString()
  key!: string;
  @IsString()
  @IsOptional()
  displayName?: string;
  @IsString()
  @IsOptional()
  group?: string;
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  values?: string[];
  @IsNumber()
  @IsOptional()
  version?: number;
}
