import { Suspense } from 'react';
import { UnifiedStudentView } from '@/components/UnifiedStudentView';

interface StudentPageProps {
  params: Promise<{ studentId: string }>;
}

export default async function StudentPage({ params }: StudentPageProps) {
  const { studentId } = await params;
  return (
    <Suspense fallback={null}>
      <UnifiedStudentView studentId={studentId} />
    </Suspense>
  );
}

export function generateStaticParams() {
  return [
    { studentId: 'jessica-santiago' },
    { studentId: 'student-a-new' },
    { studentId: 'student-b-low-gpa' },
    { studentId: 'student-c-missed' },
    { studentId: 'student-d-active' },
    { studentId: 'student-e-borderline' },
  ];
}
