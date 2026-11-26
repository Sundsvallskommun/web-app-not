import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { mockAdUsername } from '@/tests/helpers/mock-data';

import ApiService from './api.service';

vi.mock('axios', () => ({
  default: Object.assign(vi.fn(), {
    isAxiosError: (error: unknown) => typeof error === 'object' && error !== null && 'isAxiosError' in error,
  }),
}));

vi.mock('./api-token.service', () => ({
  default: class {
    getToken = () => Promise.resolve('token');
  },
}));

vi.mock('@/utils/logger', () => ({ logger: { error: vi.fn() } }));

const mockedAxios = vi.mocked(axios);

/** The shape of what axios rejects with when the upstream answered with an error status. */
const upstreamError = (status: number, data: unknown) => ({ isAxiosError: true, response: { status, data } });

describe('ApiService', () => {
  beforeEach(() => {
    mockedAxios.mockReset();
  });

  it('sends the token, the acting user and returns the Location header', async () => {
    mockedAxios.mockResolvedValue({ data: '', headers: { location: '/errands/1' } });

    const response = await new ApiService().post({ url: 'supportmanagement/18.5/errands', data: {}, sentBy: { username: mockAdUsername } });

    expect(response).toEqual({ data: '', message: 'success', location: '/errands/1' });
    expect(mockedAxios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'Bearer token', 'X-Sent-By': `type=adAccount; ${mockAdUsername}` }) as unknown,
      }),
    );
  });

  it.each([
    ['get', 'GET'],
    ['post', 'POST'],
    ['put', 'PUT'],
    ['patch', 'PATCH'],
    ['delete', 'DELETE'],
  ] as const)('%s sends a %s request with the body and returns the data', async (methodName, httpMethod) => {
    mockedAxios.mockResolvedValue({ data: { id: '1' }, headers: {} });

    const response = await new ApiService()[methodName]({ url: 'supportmanagement/18.5/errands/1', data: { title: 'Ny titel' } });

    expect(response).toEqual({ data: { id: '1' }, message: 'success' });
    expect(mockedAxios).toHaveBeenCalledWith(expect.objectContaining({ method: httpMethod, data: { title: 'Ny titel' } }));
  });

  it('sends no X-Sent-By without a user', async () => {
    mockedAxios.mockResolvedValue({ data: {}, headers: {} });

    await new ApiService().get({ url: 'simulatorserver/2.0/x' });

    const [requestConfig] = mockedAxios.mock.calls[0] ?? [];
    expect(requestConfig).toHaveProperty('headers.Authorization', 'Bearer token');
    expect(requestConfig).not.toHaveProperty(['headers', 'X-Sent-By']);
  });

  it.each([
    [400, { title: 'Constraint Violation', violations: [{ field: 'title', message: 'must not be blank' }] }, 'title: must not be blank'],
    [404, { title: 'Not Found', detail: 'Errand not found' }, 'Not found'],
    [409, { title: 'Conflict', detail: 'Version mismatch' }, 'Version mismatch'],
    [412, { title: 'Precondition Failed' }, 'Request failed'],
  ])('passes on an upstream %i with its message', async (status, problem, message) => {
    mockedAxios.mockRejectedValue(upstreamError(status, problem));

    await expect(new ApiService().get({ url: 'x' })).rejects.toMatchObject({ status, message });
  });

  it.each([401, 403, 500, 503])('turns an upstream %i into a 500', async status => {
    mockedAxios.mockRejectedValue(upstreamError(status, { title: 'Unauthorized' }));

    await expect(new ApiService().get({ url: 'x' })).rejects.toMatchObject({ status: 500 });
  });

  it('turns a network error into a 500', async () => {
    mockedAxios.mockRejectedValue(new Error('ECONNRESET'));

    await expect(new ApiService().get({ url: 'x' })).rejects.toMatchObject({ status: 500 });
  });
});
