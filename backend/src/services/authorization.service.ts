import { ADMIN_GROUP, AUTHORIZED_GROUPS } from '@config';
import { Permissions } from '@interfaces/auth.interface';
import { logger } from '@utils/logger';

export function authorizeGroups(groups: string) {
  logger.debug(`authorizing groups ${groups}`);
  logger.debug(`against ${AUTHORIZED_GROUPS}`);
  const authorizedGroupsList = AUTHORIZED_GROUPS.split(',');
  const groupsList = groups.split(',').map((group: string) => group.toLowerCase());
  return authorizedGroupsList.some(authorizedGroup => groupsList.includes(authorizedGroup.toLowerCase()));
}

export const defaultPermissions: () => Permissions = () => ({
  canEditSupportManagement: false,
});

// No named roles yet: groups map straight to permissions until NOT's roles are decided.
const groupPermissions = (): Map<string, Partial<Permissions>> => new Map([[ADMIN_GROUP.toLowerCase(), { canEditSupportManagement: true }]]);

/**
 * @param groups Array of AD groups from the SAML assertion
 * @returns collected permissions for all matching groups
 */
export const getPermissions = (groups: string[]): Permissions => {
  const permissions: Permissions = defaultPermissions();
  const mapping = groupPermissions();
  groups.forEach(group => {
    const granted = mapping.get(group.toLowerCase());
    if (granted) {
      (Object.keys(granted) as (keyof Permissions)[]).forEach(permission => {
        if (granted[permission] === true) {
          permissions[permission] = true;
        }
      });
    }
  });
  return permissions;
};
