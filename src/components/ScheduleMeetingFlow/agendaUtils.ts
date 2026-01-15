import type { TopicRecommendation, AgendaItem } from '@/types/student';

/**
 * Generates agenda items from selected topic recommendations and custom topics.
 * Automatically allocates time for each item and adds a wrap-up section.
 */
export function generateAgendaFromTopics(
  recommendations: TopicRecommendation[],
  selectedIds: Set<string>,
  customTopics: string[],
  totalDuration: number
): AgendaItem[] {
  const selectedRecs = recommendations.filter((r) => selectedIds.has(r.id));
  const totalItems = selectedRecs.length + customTopics.length;

  if (totalItems === 0) return [];

  // Calculate duration per item (reserve 5 min for wrap-up)
  const availableTime = totalDuration - 5;
  const timePerItem = Math.floor(availableTime / totalItems);

  const agendaItems: AgendaItem[] = [];

  // Add selected recommendations
  selectedRecs.forEach((rec, index) => {
    const srcRef = rec.sourceReference;
    const agendaSourceRef = srcRef
      ? {
          type: srcRef.type as 'milestone' | 'task' | 'reflection' | 'bookmark' | 'grade_level' | 'goal',
          id: srcRef.id,
        }
      : undefined;
    agendaItems.push({
      id: `agenda-new-${index}`,
      topic: rec.topic,
      description: rec.description,
      source: 'ai_recommended',
      sourceReason: rec.reason,
      sourceReference: agendaSourceRef,
      duration: timePerItem,
      covered: false,
    });
  });

  // Add custom topics
  customTopics.forEach((topic, index) => {
    agendaItems.push({
      id: `agenda-custom-${index}`,
      topic,
      source: 'counselor_added',
      duration: timePerItem,
      covered: false,
    });
  });

  // Add wrap-up
  agendaItems.push({
    id: 'agenda-wrapup',
    topic: 'Wrap-up & Next Steps',
    description: 'Summarize action items and schedule follow-up if needed',
    source: 'counselor_added',
    duration: 5,
    covered: false,
  });

  return agendaItems;
}
