import { UserController } from '@controllers/user.controller';
import { describe, expect, it } from 'vitest';

import { RequestWithUser } from '@/interfaces/auth.interface';
import { User } from '@/interfaces/users.interface';

import { mockUser } from './helpers/mock-data';

const sessionUser: User = { ...mockUser, nameID: 'name-id', sessionIndex: 'session-1' };

const requestWith = (user: User) => ({ user }) as RequestWithUser;

describe('UserController', () => {
  it('returns the session user with permissions, without groups or SAML session data', () => {
    const controller = new UserController();

    expect(controller.getUser(requestWith(sessionUser))).toEqual({
      data: {
        name: mockUser.name,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        username: mockUser.username,
        email: mockUser.email,
        permissions: { canEditSupportManagement: true },
      },
      message: 'success',
    });
  });

  it('answers 400 when the session user has no name', () => {
    const controller = new UserController();

    expect(() => controller.getUser(requestWith({ ...sessionUser, name: '' }))).toThrow(
      expect.objectContaining({ httpCode: 400, message: 'Bad Request' }) as Error,
    );
  });
});
