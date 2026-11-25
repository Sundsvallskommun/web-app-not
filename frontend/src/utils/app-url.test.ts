import { afterEach, describe, expect, it, vi } from 'vitest';

import { appURL } from './app-url';

describe('appURL', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns origin plus basePath without a path', () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_PATH', '/NOT');
    expect(appURL()).toBe(`${globalThis.location.origin}/NOT`);
  });

  it('keeps the basePath when a path is given', () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_PATH', '/NOT');
    expect(appURL('/sv/errands')).toBe(`${globalThis.location.origin}/NOT/sv/errands`);
  });

  it('works without a basePath', () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_PATH', '');
    expect(appURL('/login')).toBe(`${globalThis.location.origin}/login`);
  });
});
