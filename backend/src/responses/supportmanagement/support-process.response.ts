import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

import { ErrandProcess, ProcessError, ProcessSignal } from '@/data-contracts/supportmanagement/data-contracts';

export class SupportProcessError implements ProcessError {
  @IsString()
  @IsOptional()
  code?: string;
  @IsString()
  @IsOptional()
  message?: string;
}

export class SupportProcessSignal implements ProcessSignal {
  @IsString()
  name!: string;
  @IsString()
  @IsOptional()
  label?: string;
}

export class SupportErrandProcess implements ErrandProcess {
  @IsString()
  @IsOptional()
  id?: string;
  @IsString()
  @IsOptional()
  processService?: string;
  @IsString()
  @IsOptional()
  processKey?: string;
  @IsString()
  @IsOptional()
  processInstanceId?: string;
  @IsString()
  @IsOptional()
  processStatus?: string;
  @IsString()
  @IsOptional()
  currentActivityId?: string;
  @IsString()
  @IsOptional()
  currentActivityName?: string;
  @IsString()
  @IsOptional()
  started?: string;
  @IsString()
  @IsOptional()
  ended?: string;
  @ValidateNested()
  @Type(() => SupportProcessError)
  @IsOptional()
  error?: SupportProcessError;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SupportProcessSignal)
  @IsOptional()
  awaitingSignals?: SupportProcessSignal[];
  @IsString()
  @IsOptional()
  created?: string;
  @IsString()
  @IsOptional()
  modified?: string;
}
