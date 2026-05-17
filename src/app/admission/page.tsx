import AdmissionForm from '@/core/widgets/admission/AdmissionForm';
import PageHero from '@/core/widgets/shared/PageHero';

export default function AdmissionPage() {
  return (
    <>
      <PageHero
        title="Admissions Enquiry"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Admission' }]}
      />
      <AdmissionForm />
    </>
  );
}
