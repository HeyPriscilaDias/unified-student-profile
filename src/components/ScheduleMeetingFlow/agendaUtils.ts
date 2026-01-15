import type { TopicRecommendation, AgendaItem } from '@/types/student';

/**
 * Converts AgendaItem[] to plain text format for editing
 */
export function agendaItemsToText(items: AgendaItem[], studentName: string, gradeLevel?: number, meetingDate?: string): string {
  if (!items || items.length === 0) {
    return `Meeting with ${studentName}\n${gradeLevel ? `Grade ${gradeLevel} | ` : ''}${meetingDate || ''}\n\nPRIORITY ITEMS\n- \n\nDISCUSSION TOPICS\n- \n\nNOTES\n`;
  }

  const lines: string[] = [];
  lines.push(`Meeting with ${studentName}`);
  if (gradeLevel || meetingDate) {
    lines.push(`${gradeLevel ? `Grade ${gradeLevel}` : ''}${gradeLevel && meetingDate ? ' | ' : ''}${meetingDate || ''}`);
  }
  lines.push('');

  // Separate priority items (AI recommended with high priority) from discussion topics
  const priorityItems = items.filter(item => item.source === 'ai_recommended');
  const discussionItems = items.filter(item => item.source === 'counselor_added');

  if (priorityItems.length > 0) {
    lines.push('PRIORITY ITEMS');
    priorityItems.forEach(item => {
      lines.push(`- ${item.topic}`);
      if (item.description) {
        lines.push(`  ${item.description}`);
      }
    });
    lines.push('');
  }

  if (discussionItems.length > 0) {
    lines.push('DISCUSSION TOPICS');
    discussionItems.forEach(item => {
      lines.push(`- ${item.topic}`);
      if (item.description) {
        lines.push(`  ${item.description}`);
      }
    });
    lines.push('');
  }

  lines.push('NOTES');
  // Add any notes from items
  const notes = items.filter(item => item.notes).map(item => item.notes);
  if (notes.length > 0) {
    notes.forEach(note => lines.push(note || ''));
  }

  return lines.join('\n');
}

/**
 * Parses plain text agenda into AgendaItem[]
 */
export function textToAgendaItems(text: string, totalDuration: number = 30): AgendaItem[] {
  const items: AgendaItem[] = [];
  const lines = text.split('\n').map(line => line.trim());

  let currentSection: 'priority' | 'discussion' | 'notes' | null = null;
  let currentItem: { topic: string; description?: string } | null = null;

  for (const line of lines) {
    const upperLine = line.toUpperCase();

    // Detect section headers
    if (upperLine.includes('PRIORITY')) {
      currentSection = 'priority';
      // Save any pending item
      if (currentItem) {
        items.push(createAgendaItem(currentItem, currentSection === 'priority' ? 'ai_recommended' : 'counselor_added', items.length));
        currentItem = null;
      }
      continue;
    }
    if (upperLine.includes('DISCUSSION')) {
      // Save any pending item
      if (currentItem) {
        items.push(createAgendaItem(currentItem, 'ai_recommended', items.length));
        currentItem = null;
      }
      currentSection = 'discussion';
      continue;
    }
    if (upperLine === 'NOTES') {
      // Save any pending item
      if (currentItem) {
        items.push(createAgendaItem(currentItem, currentSection === 'priority' ? 'ai_recommended' : 'counselor_added', items.length));
        currentItem = null;
      }
      currentSection = 'notes';
      continue;
    }

    // Skip header lines (Meeting with..., Grade X...)
    if (line.startsWith('Meeting with') || line.match(/^Grade \d+/)) {
      continue;
    }

    // Parse items
    if (currentSection === 'priority' || currentSection === 'discussion') {
      if (line.startsWith('-') || line.startsWith('•')) {
        // Save previous item
        if (currentItem) {
          items.push(createAgendaItem(currentItem, currentSection === 'priority' ? 'ai_recommended' : 'counselor_added', items.length));
        }
        // Start new item
        const topic = line.substring(1).trim();
        if (topic) {
          currentItem = { topic };
        }
      } else if (line && currentItem && !line.startsWith('-') && !line.startsWith('•')) {
        // This is a description line for the current item
        currentItem.description = currentItem.description ? `${currentItem.description} ${line}` : line;
      }
    }
  }

  // Save any remaining item
  if (currentItem) {
    items.push(createAgendaItem(currentItem, currentSection === 'priority' ? 'ai_recommended' : 'counselor_added', items.length));
  }

  // Allocate duration
  if (items.length > 0) {
    const timePerItem = Math.floor(totalDuration / items.length);
    items.forEach(item => {
      item.duration = timePerItem;
    });
  }

  return items;
}

function createAgendaItem(
  data: { topic: string; description?: string },
  source: 'ai_recommended' | 'counselor_added',
  index: number
): AgendaItem {
  return {
    id: `agenda-${index}-${Date.now()}`,
    topic: data.topic,
    description: data.description,
    source,
    covered: false,
  };
}

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
