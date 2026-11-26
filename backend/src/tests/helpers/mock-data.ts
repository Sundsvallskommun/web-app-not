// Shared test values for the backend unit tests. Tests must not hardcode person
// numbers, organization numbers, phone numbers, e-mail addresses, usernames, names or
// party ids - import them from here instead, so there is a single place to check that no
// production-like identifier ever enters the repo.
//
// Ported from Draken's helper (draken/backend/src/tests/helpers/mock-data.ts), keeping the
// values that are not tied to Draken-only features. Listed as a knip entry, so values kept
// here for upcoming tests do not count as unused.

import { User } from '@/interfaces/users.interface';

// IMPORTANT
// The value below is a test person number from Skatteverket, it is not a real person number
export const mockPersonNumber = '199001012385';
// The same test person number in its 10-digit form. Note its third digit is 0, which is what
// tells a search it is a person number rather than an organization number.
export const mockPersonNumberShort = '9001012385';
// The value below is an invalid test person number for testing validation, it is not a real person number
export const mockInvalidPersonNumber = '199001012386';
// The value below is a non existing test person number for testing validation, it is not a real person number
export const mockNonexistentPersonNumber = '199909092380';

// The value below is an organization number for testing validation, it is not a real organization number.
// Its third digit is 6, which is what tells a search it is an organization number.
export const mockOrganizationNumber = '556026-9986';
// The same test organization number without the separator, as it arrives from a search field.
export const mockOrganizationNumberDigits = '5560269986';
// The value below is an invalid test organization number for testing validation, it is not a real organization number
export const mockInvalidOrganizationNumber = '556026-9987';

// The value below is a test phone number from Post- och telestyrelsen, it is not a real phone number
export const mockPhoneNumber = '0701740635';
// The value below is a test phone number from Post- och telestyrelsen, it is not a real phone number
export const mockPhoneNumberCountryCode = '+46701740635';
// A second test phone number from Post- och telestyrelsen, it is not a real phone number
export const mockSecondaryPhoneNumber = '0701740636';

// The values below are test emails, they are not real emails
export const mockEmail = 'a@example.com';
export const mockRecipientEmail = 'mail@example.com';

// The value below is a test username, it is not a real username
export const mockAdUsername = 'abc01abc';

// Party ids are opaque UUIDs assigned by the citizen/legal entity services. These are
// syntactically valid but arbitrary, they do not identify anyone.
export const mockCitizenPartyId = 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee';
// A second citizen party id, so two stakeholders on the same errand do not share one
export const mockSecondaryCitizenPartyId = 'bbbbbbbb-cccc-4ddd-8eee-ffffffffffff';
export const mockOrganizationPartyId = '11111111-2222-4333-8444-555555555555';

// Test names and addresses, they do not identify anyone
export const mockFirstName = 'Anna';
export const mockLastName = 'Andersson';
export const mockOrganizationName = 'Testbolaget AB';
export const mockStreet = 'Storgatan 1';
export const mockZipCode = '851 85';
export const mockCity = 'Sundsvall';
export const mockCareOf = 'c/o Testsson';

// Property designations, they are not real properties
export const mockPropertyDesignation = 'SUNDSVALL BÖLE 1:1';
export const mockSecondaryPropertyDesignation = 'SUNDSVALL HAGA 2:3';

// SupportManagement identifiers. SupportManagement errand and label ids are UUIDs, and NOT
// validates them as such, so these are syntactically valid but arbitrary.
export const mockSupportErrandId = 'cccccccc-dddd-4eee-8fff-000000000001';
export const mockSupportErrandNumber = 'NOT-26000001';
export const mockSupportLabelId = 'cccccccc-dddd-4eee-8fff-000000000002';

/** A logged-in handler, built from the values above. */
export const mockUser: User = {
  name: `${mockFirstName} ${mockLastName}`,
  firstName: mockFirstName,
  lastName: mockLastName,
  username: mockAdUsername,
  email: mockEmail,
  groups: ['not_admins'],
  permissions: { canEditSupportManagement: true },
};

// The values below are seeded as env vars by vitest.setup.ts before any module loads
// (@/config snapshots process.env at import time), and are imported by the tests that
// assert against them, so the two cannot drift.
export const mockMunicipalityId = '2281';
export const mockSupportNamespace = 'TEST_NAMESPACE';
export const MOCK_ADMIN_GROUP = 'not_admins';
export const MOCK_AUTHORIZED_GROUPS = 'not_users,not_admins';
