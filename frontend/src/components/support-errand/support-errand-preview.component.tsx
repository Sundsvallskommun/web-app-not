'use client';

import { SupportErrand } from '@data-contracts/backend/data-contracts';
import { getSupportErrand } from '@services/supportmanagement/support-errand-service';
import { Alert, Disclosure, Spinner } from '@sk-web-gui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type ErrandState =
  { status: 'loading' } | { status: 'loaded'; errand: SupportErrand } | { status: 'failed'; httpStatus?: number };

/** A deliberately plain view of a SupportManagement errand, to prove the frontend → backend → SupportManagement chain. */
const SupportErrandPreview = ({ identifier }: { identifier: string }) => {
  const { t } = useTranslation();
  const [state, setState] = useState<ErrandState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading' });
    getSupportErrand(identifier)
      .then((errand) => {
        if (!cancelled) setState({ status: 'loaded', errand });
      })
      .catch((error: unknown) => {
        if (!cancelled)
          setState({ status: 'failed', httpStatus: axios.isAxiosError(error) ? error.response?.status : undefined });
      });
    return () => {
      cancelled = true;
    };
  }, [identifier]);

  if (state.status === 'loading') {
    return <Spinner size={8} aria-label={t('supporterrand:loading')} />;
  }

  if (state.status === 'failed') {
    const reason =
      state.httpStatus === 404 ? 'not_found'
      : state.httpStatus === 400 ? 'invalid_identifier'
      : 'unknown';
    return (
      <Alert type="error">
        <Alert.Content>
          <Alert.Content.Title>{t(`supporterrand:error.${reason}`, { identifier })}</Alert.Content.Title>
        </Alert.Content>
      </Alert>
    );
  }

  const { errand } = state;
  const fields: [string, string | undefined][] = [
    [t('supporterrand:field.errandNumber'), errand.errandNumber],
    [t('supporterrand:field.title'), errand.title],
    [t('supporterrand:field.status'), errand.status],
    [t('supporterrand:field.priority'), errand.priority],
    [t('supporterrand:field.assignedUserId'), errand.assignedUserId],
    [t('supporterrand:field.created'), errand.created],
  ];

  return (
    <div className="flex flex-col gap-24">
      <h1>{errand.title ?? errand.errandNumber}</h1>
      <dl className="grid grid-cols-[max-content_1fr] gap-x-24 gap-y-8">
        {fields.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="font-bold">{label}</dt>
            <dd>{value ?? '–'}</dd>
          </div>
        ))}
      </dl>
      <Disclosure>
        <Disclosure.Header>
          <Disclosure.Title>{t('supporterrand:raw_errand')}</Disclosure.Title>
          <Disclosure.Button aria-label={t('supporterrand:raw_errand')} />
        </Disclosure.Header>
        <Disclosure.Content>
          <pre className="overflow-auto text-small">{JSON.stringify(errand, null, 2)}</pre>
        </Disclosure.Content>
      </Disclosure>
    </div>
  );
};

export default SupportErrandPreview;
