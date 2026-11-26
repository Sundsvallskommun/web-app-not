// Drives the SupportManagement errand routes over HTTP through the real App - auth, permissions,
// DTO transformation and validation, and error handling - with only the upstream ApiService mocked.

import session from 'express-session';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import App from '@/app';
import { BASE_URL_PREFIX } from '@/config';
import { CONTROLLERS } from '@/controllers';
import { HttpException } from '@/exceptions/HttpException';

import {
  mockAdUsername,
  mockMunicipalityId,
  mockPropertyDesignation,
  mockSupportErrandId,
  mockSupportErrandNumber,
  mockSupportLabelId,
  mockSupportNamespace,
  mockUser,
} from './helpers/mock-data';
import { startServer, TestServer } from './helpers/server';
import { loginCookie } from './helpers/session';

const upstream = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn(), patch: vi.fn() }));

vi.mock('@/services/api.service', () => ({
  default: class {
    get = upstream.get;
    post = upstream.post;
    patch = upstream.patch;
  },
}));

vi.mock('@/utils/redis', () => ({
  isRedisReady: () => true,
  closeRedisClient: () => Promise.resolve(),
  destroyRedisClient: () => undefined,
}));

const ERRAND_ID = mockSupportErrandId;
const ERRANDS_URL = `supportmanagement/18.5/${mockMunicipalityId}/${mockSupportNamespace}/errands`;
const errand = { id: ERRAND_ID, errandNumber: mockSupportErrandNumber, title: 'Ett ärende', status: 'NEW' };

/** Matches the session user the upstream requests are sent on behalf of. */
const sentByHandler = expect.objectContaining({ username: mockAdUsername }) as unknown;

describe('SupportErrandController', () => {
  let server: TestServer;
  let handlerCookie: string;
  let unprivilegedCookie: string;

  beforeAll(async () => {
    const store = new session.MemoryStore();
    server = await startServer(new App(CONTROLLERS, store).getServer());
    handlerCookie = await loginCookie(store, mockUser);
    unprivilegedCookie = await loginCookie(store, { ...mockUser, permissions: { canEditSupportManagement: false } });
  });

  afterAll(() => server.close());

  beforeEach(() => {
    upstream.get.mockReset();
    upstream.post.mockReset();
    upstream.patch.mockReset();
  });

  const call = (method: string, path: string, { body, cookie = handlerCookie }: { body?: unknown; cookie?: string } = {}) =>
    fetch(`${server.baseUrl}${BASE_URL_PREFIX}/supportmanagement/errands${path}`, {
      method,
      headers: { cookie, ...(body === undefined ? {} : { 'content-type': 'application/json' }) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

  describe('GET /:errandId', () => {
    it('returns the errand from the configured municipality and namespace, on behalf of the user', async () => {
      upstream.get.mockResolvedValue({ data: errand, message: 'success' });

      const response = await call('GET', `/${ERRAND_ID}`);

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ data: errand, message: 'success' });
      expect(upstream.get).toHaveBeenCalledWith({ url: `${ERRANDS_URL}/${ERRAND_ID}`, sentBy: sentByHandler });
    });

    it('answers 400 without calling upstream when the id is not a UUID', async () => {
      const response = await call('GET', '/..%2F..%2Fmetadata');

      expect(response.status).toBe(400);
      expect(upstream.get).not.toHaveBeenCalled();
    });

    it('passes on an upstream 404', async () => {
      upstream.get.mockRejectedValue(new HttpException(404, 'Not found'));

      const response = await call('GET', `/${ERRAND_ID}`);

      expect(response.status).toBe(404);
    });

    it('answers 403 to a user without canEditSupportManagement', async () => {
      const response = await call('GET', `/${ERRAND_ID}`, { cookie: unprivilegedCookie });

      expect(response.status).toBe(403);
      expect(upstream.get).not.toHaveBeenCalled();
    });
  });

  describe('GET /errandnumber/:errandNumber', () => {
    it('finds the errand by filtering on its number', async () => {
      upstream.get.mockResolvedValue({ data: { content: [errand] }, message: 'success' });

      const response = await call('GET', `/errandnumber/${mockSupportErrandNumber}`);

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ data: errand, message: 'success' });
      expect(upstream.get).toHaveBeenCalledWith(
        expect.objectContaining({ url: ERRANDS_URL, params: { filter: `errandNumber:'${mockSupportErrandNumber}'`, size: 1 } }),
      );
    });

    it('answers 404 when no errand has the number', async () => {
      upstream.get.mockResolvedValue({ data: { content: [] }, message: 'success' });

      const response = await call('GET', '/errandnumber/NOT-1');

      expect(response.status).toBe(404);
    });

    it("answers 400 to a number that could break out of the filter's quotes", async () => {
      const response = await call('GET', `/errandnumber/${encodeURIComponent("NOT-1' or id:'x")}`);

      expect(response.status).toBe(400);
      expect(upstream.get).not.toHaveBeenCalled();
    });
  });

  describe('GET /', () => {
    it('turns the query into a SupportManagement filter and paging parameters', async () => {
      upstream.get.mockResolvedValue({ data: { content: [errand], totalElements: 1 }, message: 'success' });

      const response = await call('GET', '?status=NEW,ONGOING&priority=HIGH&hasCustomer=true&page=2&size=5&sort=modified,desc');

      expect(response.status).toBe(200);
      expect(upstream.get).toHaveBeenCalledWith(
        expect.objectContaining({
          url: ERRANDS_URL,
          params: {
            filter: "exists(stakeholders.role:'PRIMARY') and (priority:'HIGH') and (status:'NEW' or status:'ONGOING')",
            page: 2,
            size: 5,
            sort: 'modified,desc',
          },
        }),
      );
    });

    it('accepts a URL-encoded timestamp with offset', async () => {
      upstream.get.mockResolvedValue({ data: { content: [] }, message: 'success' });

      const response = await call('GET', `?createdFrom=${encodeURIComponent('2026-11-01T00:00:00.000+01:00')}`);

      expect(response.status).toBe(200);
      expect(upstream.get).toHaveBeenCalledWith(
        expect.objectContaining({ params: expect.objectContaining({ filter: "created>'2026-11-01T00:00:00.000+01:00'" }) as unknown }),
      );
    });

    it('defaults to the first page and sends no filter when there are no filters', async () => {
      upstream.get.mockResolvedValue({ data: { content: [] }, message: 'success' });

      await call('GET', '');

      expect(upstream.get).toHaveBeenCalledWith(expect.objectContaining({ params: { filter: undefined, page: 0, size: 10, sort: undefined } }));
    });

    it.each([
      ['an unknown priority', '?priority=URGENT'],
      ['a status with a quote', `?status=${encodeURIComponent("NEW'")}`],
      ['an unknown parameter', '?statuses=NEW'],
      ['a date without time', '?createdFrom=2026-11-01'],
      ['a page size over 100', '?size=500'],
    ])('answers 400 to %s', async (_label, query) => {
      const response = await call('GET', query);

      expect(response.status).toBe(400);
      expect(upstream.get).not.toHaveBeenCalled();
    });
  });

  describe('GET /count', () => {
    it('counts with the same filter', async () => {
      upstream.get.mockResolvedValue({ data: { count: 3 }, message: 'success' });

      const response = await call('GET', '/count?status=NEW');

      expect(await response.json()).toEqual({ data: { count: 3 }, message: 'success' });
      expect(upstream.get).toHaveBeenCalledWith(expect.objectContaining({ url: `${ERRANDS_URL}/count`, params: { filter: "(status:'NEW')" } }));
    });
  });

  describe('POST /', () => {
    it('creates an errand with defaults and the prefill, and returns it as stored', async () => {
      const labelId = mockSupportLabelId;
      upstream.post.mockResolvedValue({
        data: '',
        message: 'success',
        location: `/${mockMunicipalityId}/${mockSupportNamespace}/errands/${ERRAND_ID}`,
      });
      upstream.get.mockResolvedValue({ data: errand, message: 'success' });

      const response = await call('POST', '', { body: { labels: [{ id: labelId }] } });

      expect(response.status).toBe(201);
      expect(await response.json()).toEqual({ data: errand, message: 'success' });
      expect(upstream.post).toHaveBeenCalledWith(
        expect.objectContaining({
          url: ERRANDS_URL,
          data: {
            title: 'Nytt ärende',
            priority: 'MEDIUM',
            status: 'NEW',
            channel: 'PHONE',
            reporterUserId: mockAdUsername,
            assignedUserId: mockAdUsername,
            labels: [{ id: labelId }],
          },
        }),
      );
      expect(upstream.get).toHaveBeenCalledWith(expect.objectContaining({ url: `${ERRANDS_URL}/${ERRAND_ID}` }));
    });

    it('creates an errand without a body', async () => {
      upstream.post.mockResolvedValue({ data: '', message: 'success', location: `/errands/${ERRAND_ID}` });
      upstream.get.mockResolvedValue({ data: errand, message: 'success' });

      const response = await call('POST', '');

      expect(response.status).toBe(201);
      expect(upstream.post).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ labels: [] }) as unknown }));
    });

    it('answers 502 when SupportManagement does not say where the errand is', async () => {
      upstream.post.mockResolvedValue({ data: '', message: 'success' });

      const response = await call('POST', '', { body: {} });

      expect(response.status).toBe(502);
    });
  });

  describe('PATCH /:errandId', () => {
    it('sends only the changed fields', async () => {
      upstream.patch.mockResolvedValue({ data: { ...errand, title: 'Ny titel' }, message: 'success' });

      const response = await call('PATCH', `/${ERRAND_ID}`, { body: { title: 'Ny titel', assignedUserId: mockAdUsername } });

      expect(response.status).toBe(200);
      expect(upstream.patch).toHaveBeenCalledWith({
        url: `${ERRANDS_URL}/${ERRAND_ID}`,
        data: { title: 'Ny titel', assignedUserId: mockAdUsername },
        sentBy: sentByHandler,
      });
    });

    it.each([
      ['a server-managed field', { version: 3 }],
      ['a parameter version', { parameters: [{ key: 'propertyDesignation', values: [mockPropertyDesignation], version: 2 }] }],
      ['an unknown priority', { priority: 'URGENT' }],
    ])('answers 400 to %s, naming the problem', async (_label, body) => {
      const response = await call('PATCH', `/${ERRAND_ID}`, { body });

      expect(response.status).toBe(400);
      expect(((await response.json()) as { message: string }).message).not.toMatch(/check 'errors'/);
      expect(upstream.patch).not.toHaveBeenCalled();
    });

    it('passes on an upstream conflict with its message', async () => {
      upstream.patch.mockRejectedValue(new HttpException(409, 'The errand was changed by someone else'));

      const response = await call('PATCH', `/${ERRAND_ID}`, { body: { title: 'Ny titel' } });

      expect(response.status).toBe(409);
      expect(await response.json()).toEqual({ message: 'The errand was changed by someone else' });
    });
  });
});
