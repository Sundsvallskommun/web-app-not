import { Type } from 'class-transformer';
import { IsInt, IsOptional, Matches, Max, Min } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

import { ErrandFilterQuery } from './errand-filter.query';

export class ErrandListQuery extends ErrandFilterQuery {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  page?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  size?: number;

  @Matches(/^[A-Za-z.]+,(asc|desc)$/)
  @IsOptional()
  @JSONSchema({ description: 'Property and direction, e.g. modified,desc' })
  sort?: string;
}
