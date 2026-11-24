import { Permissions } from '@interfaces/auth.interface';

export interface User {
  [key: string]: unknown;
  name: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  groups: string[];
  permissions: Permissions;
}

export interface ClientUser {
  name: string;
  username: string;
}
