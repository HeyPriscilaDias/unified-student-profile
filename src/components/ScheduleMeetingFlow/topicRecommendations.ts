import type { StudentData, TopicRecommendation, TopicCategory } from '@/types/student';
import { generateAITopicRecommendations } from '@/lib/geminiService';

/**
 * Generates topic recommendations using AI (Gemini) with fallback to static generation.
 * This is the primary async function that should be used.
 */
export async function generateTopicRecommendationsAsync(
  studentData: StudentData
): Promise<TopicRecommendation[]> {
  try {
    // Try AI-powered recommendations first
    const aiRecommendations = await generateAITopicRecommendations(studentData);

    if (aiRecommendations.length > 0) {
      console.log('Using AI-generated topic recommendations');
      return aiRecommendations;
    }
  } catch (error) {
    console.error('AI recommendation generation failed:', error);
  }

  // Fall back to static recommendations
  console.log('Falling back to static topic recommendations');
  return generateTopicRecommendations(studentData);
}

/**
 * Generates topic recommendations based on student data (static/rule-based).
 * Used as a fallback when AI recommendations are unavailable.
 */
export function generateTopicRecommendations(studentData: StudentData): TopicRecommendation[] {
  const recommendations: TopicRecommendation[] = [];
  const now = new Date();

  // 1. Check for upcoming deadlines (milestones)
  studentData.milestones
    .filter((m) => m.status === 'not_done' && m.dueDate)
    .forEach((milestone) => {
      const dueDate = new Date(milestone.dueDate!);
      const daysUntil = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (daysUntil <= 14 && daysUntil > 0) {
        recommendations.push({
          id: `milestone-${milestone.id}`,
          topic: milestone.title,
          description: `Review progress and discuss any blockers`,
          category: 'deadline',
          priority: daysUntil <= 7 ? 'high' : 'medium',
          reason: `Due in ${daysUntil} day${daysUntil !== 1 ? 's' : ''} (${milestone.progressLabel || `${milestone.progress}%`} complete)`,
          sourceReference: {
            type: 'milestone',
            id: milestone.id,
            title: milestone.title,
          },
        });
      }
    });

  // 2. Check for active goals with incomplete subtasks
  studentData.smartGoals
    .filter((g) => g.status === 'active')
    .forEach((goal) => {
      const completedCount = goal.subtasks.filter((s) => s.completed).length;
      const totalCount = goal.subtasks.length;

      if (completedCount < totalCount) {
        recommendations.push({
          id: `goal-${goal.id}`,
          topic: `Progress on: ${goal.title}`,
          description: goal.description,
          category: 'goal',
          priority: 'medium',
          reason: `${completedCount}/${totalCount} subtasks completed`,
          sourceReference: {
            type: 'goal',
            id: goal.id,
            title: goal.title,
          },
        });
      }
    });

  // 3. Check for recent AI reflections with career interests
  const recentReflections = studentData.aiReflections
    .filter((r) => {
      const reflectionDate = new Date(r.createdAt);
      const daysSince = Math.ceil((now.getTime() - reflectionDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysSince <= 30;
    })
    .slice(0, 2);

  recentReflections.forEach((reflection) => {
    recommendations.push({
      id: `reflection-${reflection.id}`,
      topic: `Follow up: ${reflection.title}`,
      description: `Discuss insights from "${reflection.lessonTitle}"`,
      category: 'reflection',
      priority: 'low',
      reason: `From AI reflection on ${new Date(reflection.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      sourceReference: {
        type: 'reflection',
        id: reflection.id,
        title: reflection.title,
      },
    });
  });

  // 4. Check top-pick bookmarks for discussion
  const topPickBookmarks = studentData.bookmarks.filter((b) => b.isTopPick).slice(0, 2);
  if (topPickBookmarks.length > 0) {
    recommendations.push({
      id: 'bookmark-careers',
      topic: 'Career Exploration',
      description: `Discuss bookmarked ${topPickBookmarks[0].type}s: ${topPickBookmarks.map((b) => b.title).join(', ')}`,
      category: 'bookmark',
      priority: 'low',
      reason: `${topPickBookmarks.length} top pick${topPickBookmarks.length !== 1 ? 's' : ''} bookmarked`,
      sourceReference: {
        type: 'bookmark',
        title: topPickBookmarks[0].title,
      },
    });
  }

  // 5. Grade-level recommendations
  const gradeRecommendations = getGradeLevelTopics(studentData.student.grade);
  recommendations.push(...gradeRecommendations);

  // 6. Check for follow-ups from previous meetings
  const lastMeeting = studentData.meetings
    .filter((m) => m.status === 'completed')
    .sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime())[0];

  if (lastMeeting) {
    const pendingActions = lastMeeting.summary?.recommendedActions?.filter(
      (a) => a.status === 'pending'
    );

    if (pendingActions && pendingActions.length > 0) {
      recommendations.push({
        id: 'follow-up-previous',
        topic: 'Follow Up on Previous Meeting',
        description: `Review ${pendingActions.length} pending action${pendingActions.length !== 1 ? 's' : ''} from last meeting`,
        category: 'follow_up',
        priority: 'medium',
        reason: `From "${lastMeeting.title}" on ${new Date(lastMeeting.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
        sourceReference: {
          type: 'meeting',
          id: lastMeeting.id,
          title: lastMeeting.title,
        },
      });
    }
  }

  // Sort by priority (high first, then medium, then low)
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return recommendations;
}

function getGradeLevelTopics(grade: number): TopicRecommendation[] {
  const topics: TopicRecommendation[] = [];

  if (grade === 12) {
    topics.push({
      id: 'grade-12-applications',
      topic: 'College Application Status',
      description: 'Review submitted applications and upcoming deadlines',
      category: 'grade_level',
      priority: 'medium',
      reason: 'Senior year checklist item',
      sourceReference: { type: 'grade_level' },
    });
    topics.push({
      id: 'grade-12-financial-aid',
      topic: 'Financial Aid & Scholarships',
      description: 'Discuss FAFSA status, scholarship opportunities',
      category: 'grade_level',
      priority: 'medium',
      reason: 'Senior year checklist item',
      sourceReference: { type: 'grade_level' },
    });
  } else if (grade === 11) {
    topics.push({
      id: 'grade-11-testing',
      topic: 'Standardized Testing Plan',
      description: 'Discuss SAT/ACT preparation and test dates',
      category: 'grade_level',
      priority: 'medium',
      reason: 'Junior year checklist item',
      sourceReference: { type: 'grade_level' },
    });
    topics.push({
      id: 'grade-11-college-list',
      topic: 'Building College List',
      description: 'Start researching and comparing colleges',
      category: 'grade_level',
      priority: 'low',
      reason: 'Junior year checklist item',
      sourceReference: { type: 'grade_level' },
    });
  } else if (grade === 10) {
    topics.push({
      id: 'grade-10-activities',
      topic: 'Extracurricular Activities',
      description: 'Review current activities and explore new opportunities',
      category: 'grade_level',
      priority: 'low',
      reason: 'Sophomore year checklist item',
      sourceReference: { type: 'grade_level' },
    });
  } else if (grade === 9) {
    topics.push({
      id: 'grade-9-transition',
      topic: 'High School Transition',
      description: 'Check in on adjustment to high school',
      category: 'grade_level',
      priority: 'low',
      reason: 'Freshman year checklist item',
      sourceReference: { type: 'grade_level' },
    });
  }

  return topics;
}
