/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Permissions {
  canEditSupportManagement: boolean;
}

export interface User {
  name: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  permissions: Permissions;
}

export interface UserApiResponse {
  data: User;
  message: string;
}
