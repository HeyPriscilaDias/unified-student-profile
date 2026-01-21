import { Suspense } from 'react';
import { UnifiedStudentView } from '@/components/UnifiedStudentView';

// Disable static generation to debug build issues
export const dynamic = 'force-dynamic';

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
