import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

import { JsonParameter } from '@/data-contracts/supportmanagement/data-contracts';

/**
 * The generated contract types `value` as Jackson's JsonNode *metadata*, but the wire value is plain
 * JSON. So `value` is replaced with `unknown` instead of pretending to be a JsonNode.
 */
export class SupportJsonParameter implements Omit<JsonParameter, 'value'> {
  @IsString()
  key!: string;
  @IsDefined()
  @JSONSchema({ description: 'Any JSON value, valid according to the JSON schema referenced by schemaId' })
  value!: unknown;
  @IsString()
  schemaId!: string;
  @IsNumber()
  @IsOptional()
  version?: number;
}
