import { Suspense } from 'react';
import { MeetingDetailView } from '@/components/MeetingDetail';

interface MeetingPageProps {
  params: Promise<{ studentId: string; meetingId: string }>;
}

export default async function MeetingPage({ params }: MeetingPageProps) {
  const { studentId, meetingId } = await params;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MeetingDetailView studentId={studentId} meetingId={meetingId} />
    </Suspense>
  );
}

export function generateStaticParams() {
  // Generate params for Jessica's meetings
  return [
    { studentId: 'jessica-santiago', meetingId: 'meeting-1' },
    { studentId: 'jessica-santiago', meetingId: 'meeting-2' },
    { studentId: 'jessica-santiago', meetingId: 'meeting-3' },
  ];
}
