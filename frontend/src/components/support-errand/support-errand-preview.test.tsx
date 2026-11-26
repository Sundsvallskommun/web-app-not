import { getSupportErrand } from '@services/supportmanagement/support-errand-service';
import { render, screen } from '@testing-library/react';
import { AxiosError, AxiosHeaders } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import SupportErrandPreview from './support-errand-preview.component';

vi.mock('@services/supportmanagement/support-errand-service', () => ({ getSupportErrand: vi.fn() }));

const mockedGetSupportErrand = vi.mocked(getSupportErrand);

describe('SupportErrandPreview', () => {
  beforeEach(() => {
    mockedGetSupportErrand.mockReset();
  });

  it('shows the errand once it is fetched', async () => {
    mockedGetSupportErrand.mockResolvedValue({ errandNumber: 'NOT-26115412', title: 'Ett ärende', status: 'NEW' });

    render(<SupportErrandPreview identifier="NOT-26115412" />);

    expect(await screen.findByRole('heading', { name: 'Ett ärende' })).toBeInTheDocument();
    expect(screen.getByText('NOT-26115412')).toBeInTheDocument();
    expect(mockedGetSupportErrand).toHaveBeenCalledWith('NOT-26115412');
  });

  it('says so when there is no such errand', async () => {
    mockedGetSupportErrand.mockRejectedValue(
      new AxiosError('Not found', 'ERR_BAD_REQUEST', undefined, undefined, {
        status: 404,
        statusText: 'Not Found',
        data: {},
        headers: {},
        config: { headers: new AxiosHeaders() },
      })
    );

    render(<SupportErrandPreview identifier="NOT-1" />);

    expect(await screen.findByText('supporterrand:error.not_found')).toBeInTheDocument();
  });
});
