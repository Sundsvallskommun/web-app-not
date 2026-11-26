import { SupportErrand, SupportErrandApiResponse } from '@data-contracts/backend/data-contracts';
import { apiService } from '@services/api-service';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const getSupportErrandById = (errandId: string): Promise<SupportErrand> =>
  apiService
    .get<SupportErrandApiResponse>(`supportmanagement/errands/${encodeURIComponent(errandId)}`)
    .then((res) => res.data.data);

const getSupportErrandByNumber = (errandNumber: string): Promise<SupportErrand> =>
  apiService
    .get<SupportErrandApiResponse>(`supportmanagement/errands/errandnumber/${encodeURIComponent(errandNumber)}`)
    .then((res) => res.data.data);

/** Fetches an errand by its id (a UUID) or by its errand number (e.g. NOT-26115412). */
export const getSupportErrand = (identifier: string): Promise<SupportErrand> =>
  UUID.test(identifier) ? getSupportErrandById(identifier) : getSupportErrandByNumber(identifier);
