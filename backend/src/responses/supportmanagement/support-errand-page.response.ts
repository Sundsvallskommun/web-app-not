import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

import { PageableObject, PageErrand, SortObject } from '@/data-contracts/supportmanagement/data-contracts';
import { ApiResponse } from '@/interfaces/api-service.interface';

import { SupportErrand } from './support-errand.response';

export class SupportSort implements SortObject {
  @IsBoolean()
  @IsOptional()
  empty?: boolean;
  @IsBoolean()
  @IsOptional()
  sorted?: boolean;
  @IsBoolean()
  @IsOptional()
  unsorted?: boolean;
}

export class SupportPageable implements PageableObject {
  @IsNumber()
  @IsOptional()
  offset?: number;
  @IsBoolean()
  @IsOptional()
  paged?: boolean;
  @IsNumber()
  @IsOptional()
  pageNumber?: number;
  @IsNumber()
  @IsOptional()
  pageSize?: number;
  @ValidateNested()
  @Type(() => SupportSort)
  @IsOptional()
  sort?: SupportSort;
  @IsBoolean()
  @IsOptional()
  unpaged?: boolean;
}

export class SupportErrandPage implements Omit<PageErrand, 'content'> {
  @IsNumber()
  @IsOptional()
  totalPages?: number;
  @IsNumber()
  @IsOptional()
  totalElements?: number;
  @IsNumber()
  @IsOptional()
  size?: number;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SupportErrand)
  @IsOptional()
  content?: SupportErrand[];
  @IsNumber()
  @IsOptional()
  number?: number;
  @ValidateNested()
  @Type(() => SupportSort)
  @IsOptional()
  sort?: SupportSort;
  @ValidateNested()
  @Type(() => SupportPageable)
  @IsOptional()
  pageable?: SupportPageable;
  @IsNumber()
  @IsOptional()
  numberOfElements?: number;
  @IsBoolean()
  @IsOptional()
  first?: boolean;
  @IsBoolean()
  @IsOptional()
  last?: boolean;
  @IsBoolean()
  @IsOptional()
  empty?: boolean;
}

export class SupportErrandPageApiResponse implements ApiResponse<SupportErrandPage> {
  @ValidateNested()
  @Type(() => SupportErrandPage)
  data!: SupportErrandPage;
  @IsString()
  message!: string;
}
