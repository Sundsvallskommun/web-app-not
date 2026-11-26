'use client';

import HeaderLogo from '@components/header-logo/header-logo.component';
import MobileMenu from '@components/user-menu/mobile-menu.component';
import UserMenu from '@components/user-menu/user-menu.component';
import { CookieConsent, Header, Link } from '@sk-web-gui/react';
import NextLink from 'next/link';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface DefaultLayoutProps {
  children: ReactNode;
}

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? 'NOT';

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  const { t } = useTranslation();

  const headerTitle = t('layout:header.title');
  const headerSubtitle = t('layout:header.subtitle');

  const setFocusToMain = () => {
    const contentElement = document.getElementById('content');
    contentElement?.focus();
  };

  return (
    <div className="DefaultLayout full-page-layout bg-background-200">
      <NextLink href="#content" onClick={setFocusToMain} accessKey="s" className="next-link-a">
        {t('layout:header.goto_content')}
      </NextLink>

      <Header
        logo={<HeaderLogo title={headerTitle} subtitle={headerSubtitle} />}
        userMenu={<UserMenu />}
        mobileMenu={<MobileMenu />}
        wrapperClasses="bg-background-200 shadow-none py-12 px-24 md:py-12 md:px-24 xl:py-12 xl:px-24 [&>.sk-header-container]:max-w-full"
      />

      <div className="main-container flex-grow relative w-full flex flex-col">
        <div className="main-content-padding">{children}</div>
      </div>

      <CookieConsent
        title={t('layout:cookies.title', { app: appName })}
        body={
          <p>
            {t('layout:cookies.description')} <Link href="/kakor">{t('layout:cookies.read_more')}</Link>
          </p>
        }
        cookies={[
          {
            optional: false,
            displayName: t('layout:cookies.necessary.displayName'),
            description: t('layout:cookies.necessary.description'),
            cookieName: 'necessary',
          },
          {
            optional: true,
            displayName: t('layout:cookies.func.displayName'),
            description: t('layout:cookies.func.description'),
            cookieName: 'func',
          },
          {
            optional: true,
            displayName: t('layout:cookies.stats.displayName'),
            description: t('layout:cookies.stats.description'),
            cookieName: 'stats',
          },
        ]}
        resetConsentOnInit={false}
        onConsent={() => undefined}
      />
    </div>
  );
}
