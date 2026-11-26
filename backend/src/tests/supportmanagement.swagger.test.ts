// The frontend generates its SupportManagement types from this swagger, so the errand must be
// described in full - nested types included - for the types to be correct end to end.

import session from 'express-session';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import App from '@/app';
import { BASE_URL_PREFIX } from '@/config';
import { CONTROLLERS } from '@/controllers';

import { startServer, TestServer } from './helpers/server';

vi.hoisted(() => {
  process.env.SWAGGER_ENABLED = 'true';
});

vi.mock('@/utils/redis', () => ({
  isRedisReady: () => true,
  closeRedisClient: () => Promise.resolve(),
  destroyRedisClient: () => undefined,
}));

interface OpenApiSpec {
  paths: Record<string, Record<string, { parameters?: { name: string; in: string }[]; responses: Record<string, unknown> }>>;
  components: { schemas: Record<string, { properties?: Record<string, unknown> }> };
}

describe('SupportManagement swagger', () => {
  let server: TestServer;
  let spec: OpenApiSpec;

  beforeAll(async () => {
    server = await startServer(new App(CONTROLLERS, new session.MemoryStore()).getServer());
    spec = (await (await server.request('get', `${BASE_URL_PREFIX}/swagger.json`)).json()) as OpenApiSpec;
  });

  afterAll(() => server.close());

  it('describes the errand with its nested types', () => {
    const errand = spec.components.schemas.SupportErrand;

    expect(errand?.properties).toHaveProperty('stakeholders.items.$ref', '#/components/schemas/SupportStakeholder');
    expect(errand?.properties).toHaveProperty('priority.enum', ['LOW', 'MEDIUM', 'HIGH']);
    expect(spec.components.schemas).toHaveProperty('SupportMeasure');
    expect(spec.components.schemas).toHaveProperty('SupportErrandProcess');
  });

  it('wraps responses in the data/message envelope', () => {
    expect(spec.components.schemas.SupportErrandApiResponse?.properties).toHaveProperty('data.$ref', '#/components/schemas/SupportErrand');
    expect(spec.components.schemas.SupportErrandPageApiResponse?.properties).toHaveProperty('data.$ref', '#/components/schemas/SupportErrandPage');
  });

  it('documents the search filters as query parameters', () => {
    const search = spec.paths[`${BASE_URL_PREFIX}/supportmanagement/errands/`]?.get;
    const queryParameters = search?.parameters?.filter(parameter => parameter.in === 'query').map(parameter => parameter.name);

    expect(queryParameters).toEqual(expect.arrayContaining(['query', 'status', 'labelSubType', 'createdFrom', 'page', 'size', 'sort']));
  });
});
