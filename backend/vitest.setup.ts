import 'reflect-metadata';

import { MOCK_ADMIN_GROUP, MOCK_AUTHORIZED_GROUPS, mockMunicipalityId, mockSupportNamespace } from './src/tests/helpers/mock-data';

// The AD groups are always the mock ones in tests, so a group set in the shell or a local
// env file cannot make the authorization tests depend on real group names.
process.env.ADMIN_GROUP = MOCK_ADMIN_GROUP;
process.env.AUTHORIZED_GROUPS = MOCK_AUTHORIZED_GROUPS;

// app.ts builds the SAML strategy and reads config at IMPORT time, so the default-deny
// runtime tests cannot import the app without these. The values are dummies - no SAML
// flow is exercised, only the auth guard in front of the routes.
process.env.BASE_URL_PREFIX ??= '/api';
process.env.SECRET_KEY ??= 'test-secret-key';
process.env.SAML_ENTRY_SSO ??= 'https://idp.test.local/sso';
process.env.SAML_CALLBACK_URL ??= 'https://app.test.local/api/saml/login/callback';
process.env.SAML_LOGOUT_CALLBACK_URL ??= 'https://app.test.local/api/saml/logout/callback';
process.env.SAML_SUCCESS_REDIRECT ??= 'https://app.test.local';
process.env.SAML_FAILURE_REDIRECT ??= 'https://app.test.local/login';
process.env.SAML_ISSUER ??= 'test-issuer';
// node-saml asserts these are present when the Strategy is constructed. They are never
// used to sign or verify anything in tests, so placeholder values are enough.
process.env.SAML_IDP_PUBLIC_CERT ??= 'test-idp-cert';
process.env.SAML_PRIVATE_KEY ??= 'test-private-key';
process.env.SAML_PUBLIC_KEY ??= 'test-public-key';
process.env.ORIGIN ??= 'http://localhost:3000';
// SupportManagement URLs are built from these; fixed so tests can assert exact upstream URLs.
process.env.API_BASE_URL = 'https://api.test.local';
process.env.MUNICIPALITY_ID = mockMunicipalityId;
process.env.SUPPORTMANAGEMENT_NAMESPACE = mockSupportNamespace;
