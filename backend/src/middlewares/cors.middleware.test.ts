import express from 'express';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { startServer, TestServer } from '../tests/helpers/server';
import { createCorsMiddleware } from './cors.middleware';

const callbackPath = '/NOT/saml/login/callback';

describe('createCorsMiddleware', () => {
  let server: TestServer;

  beforeAll(async () => {
    const app = express();
    app.use(
      createCorsMiddleware({
        allowedOrigins: 'https://app.test, https://admin.test',
        credentials: true,
        allowAnyOrigin: false,
        exemptPaths: [callbackPath],
      }),
    );
    app.all('/{*path}', (_req, res) => {
      res.status(200).send('ok');
    });
    server = await startServer(app);
  });

  afterAll(() => server.close());

  const post = (path: string, origin: string) => fetch(`${server.baseUrl}${path}`, { method: 'POST', headers: { Origin: origin } });

  it('allows a whitelisted origin and echoes it', async () => {
    const response = await post('/NOT/api', 'https://admin.test');
    expect(response.status).toBe(200);
    expect(response.headers.get('access-control-allow-origin')).toBe('https://admin.test');
  });

  it('rejects an unknown origin', async () => {
    const response = await post('/NOT/api', 'https://evil.test');
    expect(response.status).not.toBe(200);
  });

  it.each(['https://idp.test', 'null'])('lets the IdP post to the SAML callback from origin %s', async origin => {
    const response = await post(callbackPath, origin);
    expect(response.status).toBe(200);
  });
});
