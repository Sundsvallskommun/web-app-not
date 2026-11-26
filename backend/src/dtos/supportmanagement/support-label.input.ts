import { IsUUID } from 'class-validator';

import { ErrandLabel } from '@/data-contracts/supportmanagement/data-contracts';

/** A label is set on an errand by id only; every other label field is read-only. */
export class SupportLabelInput implements Pick<ErrandLabel, 'id'> {
  @IsUUID()
  id!: string;
}
