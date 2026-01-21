import { Suspense } from 'react';
import { InteractionDetailView } from '@/components/InteractionDetail';

// Disable static generation to debug build issues
export const dynamic = 'force-dynamic';

interface InteractionPageProps {
  params: Promise<{ studentId: string; interactionId: string }>;
}

export default async function InteractionPage({ params }: InteractionPageProps) {
  const { studentId, interactionId } = await params;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InteractionDetailView studentId={studentId} interactionId={interactionId} />
    </Suspense>
  );
}
