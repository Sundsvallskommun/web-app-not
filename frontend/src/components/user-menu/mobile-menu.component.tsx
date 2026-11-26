'use client';

import { Icon, PopupMenu } from '@sk-web-gui/react';
import { capitalize } from 'lodash';
import { Menu } from 'lucide-react';
import NextLink from 'next/link';
import { useTranslation } from 'react-i18next';

import { useFullName } from './use-full-name';

export default function MobileMenu() {
  const fullName = useFullName();
  const { t } = useTranslation();

  if (!fullName) return null;

  return (
    <div className="relative">
      <PopupMenu align="end">
        <PopupMenu.Button iconButton variant="tertiary" aria-label={t('layout:header.menu')}>
          <Icon icon={<Menu />} />
        </PopupMenu.Button>
        <PopupMenu.Panel>
          <PopupMenu.Group>
            <label>{fullName}</label>
          </PopupMenu.Group>
          <PopupMenu.Items>
            <PopupMenu.Item>
              <NextLink href="/logout">{capitalize(t('common:logout'))}</NextLink>
            </PopupMenu.Item>
          </PopupMenu.Items>
        </PopupMenu.Panel>
      </PopupMenu>
    </div>
  );
}
