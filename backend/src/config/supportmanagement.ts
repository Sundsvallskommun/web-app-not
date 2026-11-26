import { MUNICIPALITY_ID, SUPPORTMANAGEMENT_NAMESPACE } from '@config';

import { getApiBase } from '@/config/api-config';
import { Errand, Priority } from '@/data-contracts/supportmanagement/data-contracts';

export const supportErrandsPath = (...subPaths: string[]): string =>
  [getApiBase('supportmanagement'), MUNICIPALITY_ID, SUPPORTMANAGEMENT_NAMESPACE, 'errands', ...subPaths].join('/');

export const NEW_SUPPORT_ERRAND_DEFAULTS = {
  title: 'Nytt ärende',
  priority: Priority.MEDIUM,
  status: 'NEW',
  channel: 'PHONE',
} as const satisfies Errand;
