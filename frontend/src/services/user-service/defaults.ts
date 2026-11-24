import { User } from '@data-contracts/backend/data-contracts';

export const emptyUser: User = {
  name: '',
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  permissions: {
    canEditSupportManagement: false,
  },
};
