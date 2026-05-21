import TCDownload from '@/core/widgets/online/TCDownload';
import PageHero from '@/core/widgets/shared/PageHero';

export default function TCPage() {
  console.log("Hello,,....")
  return (
    <>
      <PageHero
        title="Transfer Certificate"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Online', href: '/online' },
          { label: 'Transfer Certificate' },
        ]}
      />
      <TCDownload />
    </>
  );
}
