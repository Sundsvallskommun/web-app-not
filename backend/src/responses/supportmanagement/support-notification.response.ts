import { IsBoolean, IsOptional, IsString } from 'class-validator';

import { Notification } from '@/data-contracts/supportmanagement/data-contracts';

export class SupportNotification implements Notification {
  @IsString()
  @IsOptional()
  id?: string;
  @IsString()
  @IsOptional()
  created?: string;
  @IsString()
  @IsOptional()
  modified?: string;
  @IsString()
  @IsOptional()
  ownerFullName?: string;
  @IsString()
  @IsOptional()
  ownerId?: string;
  @IsString()
  @IsOptional()
  createdBy?: string;
  @IsString()
  @IsOptional()
  createdByFullName?: string;
  @IsString()
  @IsOptional()
  type?: string;
  @IsString()
  @IsOptional()
  subtype?: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsString()
  @IsOptional()
  content?: string;
  @IsString()
  @IsOptional()
  expires?: string;
  @IsBoolean()
  @IsOptional()
  globalAcknowledged?: boolean;
  @IsBoolean()
  @IsOptional()
  acknowledged?: boolean;
  @IsString()
  @IsOptional()
  errandId?: string;
  @IsString()
  @IsOptional()
  errandNumber?: string;
}
