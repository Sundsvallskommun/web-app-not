// Plants a logged-in session in the store and returns the cookie that selects it, so a test can
// call protected routes through the real middleware chain without going through SAML.

import { createHmac, randomUUID } from 'node:crypto';

import type { Store } from 'express-session';

import { User } from '@/interfaces/users.interface';

const SESSION_COOKIE_NAME = 'connect.sid';
const ONE_HOUR_MS = 60 * 60 * 1000;

/** The signed cookie value express-session expects: `s:<id>.<base64 HMAC-SHA256 without padding>`. */
const signSessionId = (sessionId: string, secret: string): string =>
  `s:${sessionId}.${createHmac('sha256', secret).update(sessionId).digest('base64').replace(/=+$/, '')}`;

export const loginCookie = async (store: Store, user: User): Promise<string> => {
  const sessionId = randomUUID();
  const sessionData = {
    cookie: { originalMaxAge: ONE_HOUR_MS, expires: new Date(Date.now() + ONE_HOUR_MS), httpOnly: true, path: '/' },
    passport: { user },
  };
  await new Promise<void>((resolve, reject) => {
    store.set(sessionId, sessionData, error => {
      if (error) reject(error instanceof Error ? error : new Error(String(error)));
      else resolve();
    });
  });
  const secret = process.env.SECRET_KEY ?? '';
  return `${SESSION_COOKIE_NAME}=${encodeURIComponent(signSessionId(sessionId, secret))}`;
};
