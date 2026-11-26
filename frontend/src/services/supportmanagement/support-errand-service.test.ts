import { apiService } from '@services/api-service';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getSupportErrand } from './support-errand-service';

vi.mock('@services/api-service', () => ({ apiService: { get: vi.fn() } }));

const mockedGet = vi.mocked(apiService.get);
const errand = { id: '3f0e57b2-2876-4cb8-aa71-537b5805be27', errandNumber: 'NOT-26115412' };

describe('getSupportErrand', () => {
  beforeEach(() => {
    mockedGet
      .mockReset()
      .mockResolvedValue({ data: { data: errand, message: 'success' } } as Awaited<ReturnType<typeof apiService.get>>);
  });

  it('fetches by id when given a UUID', async () => {
    await expect(getSupportErrand(errand.id)).resolves.toEqual(errand);
    expect(mockedGet).toHaveBeenCalledWith(`supportmanagement/errands/${errand.id}`);
  });

  it('fetches by errand number otherwise', async () => {
    await expect(getSupportErrand('NOT-26115412')).resolves.toEqual(errand);
    expect(mockedGet).toHaveBeenCalledWith('supportmanagement/errands/errandnumber/NOT-26115412');
  });
});
