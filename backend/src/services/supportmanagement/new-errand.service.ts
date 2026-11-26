import { isUUID } from 'class-validator';

import { NEW_SUPPORT_ERRAND_DEFAULTS, supportErrandsPath } from '@/config/supportmanagement';
import { Errand } from '@/data-contracts/supportmanagement/data-contracts';
import { NewSupportErrandDto } from '@/dtos/supportmanagement/new-support-errand.dto';
import { HttpException } from '@/exceptions/HttpException';
import { User } from '@/interfaces/users.interface';
import { SupportErrand } from '@/responses/supportmanagement/support-errand.response';
import ApiService from '@/services/api.service';

/** SupportManagement answers a create with an empty 201 and `Location: .../errands/{id}`. */
const errandIdFromLocation = (location: string | undefined): string => {
  const errandId = location?.split('/').pop();
  if (!errandId || !isUUID(errandId)) {
    throw new HttpException(502, 'SupportManagement did not say where the new errand is');
  }
  return errandId;
};

/** Creates an errand with the defaults, the given prefill and the user as reporter and assignee, and returns it as stored. */
export const createSupportErrand = async (apiService: ApiService, prefill: NewSupportErrandDto, user: User): Promise<SupportErrand> => {
  const newErrand = {
    ...NEW_SUPPORT_ERRAND_DEFAULTS,
    reporterUserId: user.username,
    assignedUserId: user.username,
    labels: prefill.labels ?? [],
    ...(prefill.stakeholders ? { stakeholders: prefill.stakeholders } : {}),
    ...(prefill.jsonParameters ? { jsonParameters: prefill.jsonParameters } : {}),
  } satisfies Omit<Errand, 'jsonParameters'> & Pick<NewSupportErrandDto, 'jsonParameters'>;

  const created = await apiService.post<unknown>({ url: supportErrandsPath(), data: newErrand, sentBy: user });
  const errandId = errandIdFromLocation(created.location);

  const errand = await apiService.get<SupportErrand>({ url: supportErrandsPath(errandId), sentBy: user });
  return errand.data;
};
