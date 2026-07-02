import Examination from '@/core/widgets/academic/Examination';
import PageHero from '@/core/widgets/shared/PageHero';

export interface ExamNotice {
  _id: string;
  title: string;
  examDateFrom: string;
  examDateTo: string;
  description: string;
  pdf: { fileId: string; fileName: string; viewLink: string; directLink: string };
  createdAt: string;
}

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

async function getExamNotices(): Promise<ExamNotice[]> {
  try {
    const res = await fetch(`${BASE}/api/exam-notice`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.notices ?? [];
  } catch { return []; }
}

export default async function ExaminationPage() {
  const notices = await getExamNotices();
  return (
    <>
      <PageHero
        title="Examination Announcement"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Academic', href: '/' },
          { label: 'Examination Announcement' },
        ]}
      />
      <Examination notices={notices} />
    </>
  );
}
