import { describe, expect, it } from 'vitest';

import { MOCK_ADMIN_GROUP } from '@/tests/helpers/mock-data';

import { authorizeGroups, defaultPermissions, getPermissions } from './authorization.service';

describe('authorization.service', () => {
  describe('defaultPermissions', () => {
    it('grants nothing by default', () => {
      expect(defaultPermissions()).toEqual({
        canEditSupportManagement: false,
      });
    });

    it('returns a fresh object each call (no shared mutable state)', () => {
      const permissions = defaultPermissions();
      permissions.canEditSupportManagement = true;
      expect(defaultPermissions().canEditSupportManagement).toBe(false);
    });
  });

  describe('getPermissions (external AD groups)', () => {
    it('maps the admin group to support edit', () => {
      expect(getPermissions([MOCK_ADMIN_GROUP])).toEqual({
        canEditSupportManagement: true,
      });
    });

    it('ignores unknown groups', () => {
      expect(getPermissions(['not_a_group'])).toEqual(defaultPermissions());
    });
  });

  describe('authorizeGroups', () => {
    it('accepts a member of an authorized group', () => {
      expect(authorizeGroups(MOCK_ADMIN_GROUP)).toBe(true);
    });

    it('refuses a user outside the authorized groups', () => {
      expect(authorizeGroups('not_a_group')).toBe(false);
    });
  });
});
