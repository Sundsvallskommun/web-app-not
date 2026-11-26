'use client';

import { PopupMenu } from '@sk-web-gui/react';
import { capitalize } from 'lodash';
import { ChevronDown } from 'lucide-react';
import NextLink from 'next/link';
import { useTranslation } from 'react-i18next';

import { useFullName } from './use-full-name';

export default function UserMenu() {
  const fullName = useFullName();
  const { t } = useTranslation();

  if (!fullName) return null;

  return (
    <div className="relative">
      <PopupMenu align="end">
        <PopupMenu.Button
          className="text-dark-primary"
          variant="tertiary"
          showBackground={false}
          rightIcon={<ChevronDown />}
        >
          {fullName}
        </PopupMenu.Button>
        <PopupMenu.Panel>
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
