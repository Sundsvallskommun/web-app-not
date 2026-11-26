import { IsArray, IsOptional, IsString, MaxLength } from 'class-validator';

import { Parameter } from '@/data-contracts/supportmanagement/data-contracts';

/** A parameter as written. `version` is managed by SupportManagement and rejected on writes. */
export class SupportParameterInput implements Omit<Parameter, 'version'> {
  @IsString()
  @MaxLength(255)
  key!: string;
  @IsString()
  @MaxLength(255)
  @IsOptional()
  displayName?: string;
  @IsString()
  @MaxLength(255)
  @IsOptional()
  group?: string;
  @IsArray()
  @IsString({ each: true })
  @MaxLength(3000, { each: true })
  @IsOptional()
  values?: string[];
}
