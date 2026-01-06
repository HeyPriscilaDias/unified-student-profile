'use client';

import { use } from 'react';
import { ScheduleMeetingPage } from '@/components/ScheduleMeetingFlow/ScheduleMeetingPage';

interface PageProps {
  params: Promise<{ studentId: string }>;
}

export default function ScheduleMeetingRoute({ params }: PageProps) {
  const { studentId } = use(params);
  return <ScheduleMeetingPage studentId={studentId} />;
}
