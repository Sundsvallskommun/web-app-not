import { emptyUser } from '@services/user-service/defaults';
import { useUserStore } from '@services/user-service/user-service';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import UserMenu from './user-menu.component';

describe('UserMenu', () => {
  afterEach(() => {
    useUserStore.getState().reset();
  });

  it('shows the full name and a logout link in the dropdown', () => {
    useUserStore.getState().setUser({ ...emptyUser, firstName: 'Anna', lastName: 'Andersson' });
    render(<UserMenu />);

    fireEvent.click(screen.getByRole('button', { name: 'Anna Andersson' }));

    expect(screen.getByRole('menuitem', { name: /logout/i })).toHaveAttribute('href', '/logout');
  });
});
