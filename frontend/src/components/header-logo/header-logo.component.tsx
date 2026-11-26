import { Logo } from '@sk-web-gui/react';
import NextLink from 'next/link';

interface HeaderLogoProps {
  title: string;
  subtitle: string;
}

export default function HeaderLogo({ title, subtitle }: HeaderLogoProps) {
  return (
    <NextLink
      href="/"
      className="flex items-center gap-12 no-underline"
      aria-label={`${title} ${subtitle}. Gå till startsidan.`}
    >
      <Logo variant="symbol" className="h-40" />
      <span className="flex flex-col leading-tight">
        <span className="font-header font-bold text-large">{title}</span>
        <span className="text-small">{subtitle}</span>
      </span>
    </NextLink>
  );
}
