import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

import { ErrandAttachment, ErrandAttachmentChannelEnum, ErrandAttachmentPurpose } from '@/data-contracts/supportmanagement/data-contracts';

export class SupportAttachmentPurpose implements ErrandAttachmentPurpose {
  @IsString()
  @IsOptional()
  id?: string;
  @IsString()
  @IsOptional()
  name?: string;
  @IsString()
  @IsOptional()
  displayName?: string;
}

export class SupportErrandAttachment implements ErrandAttachment {
  @IsString()
  @IsOptional()
  id?: string;
  @IsString()
  @IsOptional()
  fileName?: string;
  @IsString()
  @IsOptional()
  mimeType?: string;
  @IsNumber()
  @IsOptional()
  fileSize?: number;
  @IsEnum(ErrandAttachmentChannelEnum)
  @IsOptional()
  channel?: ErrandAttachmentChannelEnum;
  @IsNumber()
  @IsOptional()
  sequenceNumber?: number;
  @IsString()
  @IsOptional()
  received?: string;
  @IsString()
  @IsOptional()
  created?: string;
  @IsString()
  @IsOptional()
  modified?: string;
  @IsString()
  @IsOptional()
  hash?: string;
  @ValidateNested()
  @Type(() => SupportAttachmentPurpose)
  @IsOptional()
  purpose?: SupportAttachmentPurpose;
}
