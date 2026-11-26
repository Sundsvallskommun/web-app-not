import SupportErrandPreview from '@components/support-errand/support-errand-preview.component';

interface SupportErrandPageProps {
  params: Promise<{ identifier: string }>;
}

export default async function SupportErrandPage({ params }: SupportErrandPageProps) {
  const { identifier } = await params;
  return <SupportErrandPreview identifier={identifier} />;
}
