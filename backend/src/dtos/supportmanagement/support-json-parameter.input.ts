import { IsDefined, IsString, Matches } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

import { JsonParameter } from '@/data-contracts/supportmanagement/data-contracts';

/** A JSON parameter as written; see SupportJsonParameter for why `value` is `unknown`. */
export class SupportJsonParameterInput implements Omit<JsonParameter, 'value' | 'version'> {
  @Matches(/^[A-Za-z0-9_-]+$/)
  key!: string;
  @IsDefined()
  @JSONSchema({ description: 'Any JSON value, valid according to the JSON schema referenced by schemaId' })
  value!: unknown;
  @IsString()
  schemaId!: string;
}
