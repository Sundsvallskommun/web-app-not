import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsISO8601, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

import { Priority } from '@/data-contracts/supportmanagement/data-contracts';

import { CsvQueryParam } from './csv-query-param';

/** Codes such as statuses, channels and classifications: no quotes, so they cannot break out of a filter literal. */
const CODE = /^[A-Za-z0-9_.-]+$/;
/** Label resource paths, e.g. `AOT/UNCATEGORIZED`. */
const RESOURCE_PATH = /^[A-Za-z0-9_./-]+$/;
const USERNAME = /^[A-Za-z0-9_.-]+$/;
/** A full timestamp with offset; SupportManagement compares `created` against it as-is. */
const TIMESTAMP_WITH_OFFSET = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$/;

const COMMA_SEPARATED = { description: 'Comma-separated list' };

/** Filters for searching and counting SupportManagement errands. Every field is optional; given fields are and-ed. */
export class ErrandFilterQuery {
  @IsString()
  @MaxLength(100)
  @IsOptional()
  @JSONSchema({ description: 'Free text, matched against errand and stakeholder fields' })
  query?: string;

  @Matches(USERNAME)
  @IsOptional()
  @JSONSchema({ description: 'Username: errands assigned to the user, or unassigned errands reported by the user' })
  assignee?: string;

  @Transform(({ value }: { value: unknown }) => value === true || value === 'true')
  @IsBoolean()
  @IsOptional()
  @JSONSchema({ description: 'Only errands with a customer (a PRIMARY stakeholder)' })
  hasCustomer?: boolean;

  @CsvQueryParam()
  @IsArray()
  @IsEnum(Priority, { each: true })
  @IsOptional()
  @JSONSchema(COMMA_SEPARATED)
  priority?: Priority[];

  @CsvQueryParam()
  @IsArray()
  @Matches(CODE, { each: true })
  @IsOptional()
  @JSONSchema(COMMA_SEPARATED)
  status?: string[];

  @CsvQueryParam()
  @IsArray()
  @Matches(CODE, { each: true })
  @IsOptional()
  @JSONSchema(COMMA_SEPARATED)
  channel?: string[];

  @Matches(CODE)
  @IsOptional()
  resolution?: string;

  @CsvQueryParam()
  @IsArray()
  @Matches(CODE, { each: true })
  @IsOptional()
  @JSONSchema({ description: 'Comma-separated classification categories' })
  category?: string[];

  @CsvQueryParam()
  @IsArray()
  @Matches(CODE, { each: true })
  @IsOptional()
  @JSONSchema({ description: 'Comma-separated classification types' })
  type?: string[];

  @CsvQueryParam()
  @IsArray()
  @Matches(RESOURCE_PATH, { each: true })
  @IsOptional()
  @JSONSchema({ description: 'Comma-separated label resource paths, first level' })
  labelCategory?: string[];

  @CsvQueryParam()
  @IsArray()
  @Matches(RESOURCE_PATH, { each: true })
  @IsOptional()
  @JSONSchema({ description: 'Comma-separated label resource paths, second level' })
  labelType?: string[];

  @CsvQueryParam()
  @IsArray()
  @Matches(RESOURCE_PATH, { each: true })
  @IsOptional()
  @JSONSchema({ description: 'Comma-separated label resource paths, third level' })
  labelSubType?: string[];

  @IsISO8601({ strict: true })
  @Matches(TIMESTAMP_WITH_OFFSET)
  @IsOptional()
  @JSONSchema({ description: 'Created after, ISO 8601 with offset, e.g. 2026-11-01T00:00:00.000+01:00' })
  createdFrom?: string;

  @IsISO8601({ strict: true })
  @Matches(TIMESTAMP_WITH_OFFSET)
  @IsOptional()
  @JSONSchema({ description: 'Created before, ISO 8601 with offset' })
  createdTo?: string;
}
