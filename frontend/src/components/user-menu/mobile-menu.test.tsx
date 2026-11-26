import { emptyUser } from '@services/user-service/defaults';
import { useUserStore } from '@services/user-service/user-service';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import MobileMenu from './mobile-menu.component';

describe('MobileMenu', () => {
  afterEach(() => {
    useUserStore.getState().reset();
  });

  it('opens from the menu button and shows the full name and a logout link', () => {
    useUserStore.getState().setUser({ ...emptyUser, firstName: 'Anna', lastName: 'Andersson' });
    render(<MobileMenu />);

    fireEvent.click(screen.getByRole('button', { name: /menu/i }));

    expect(screen.getByText('Anna Andersson')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /logout/i })).toHaveAttribute('href', '/logout');
  });
});
