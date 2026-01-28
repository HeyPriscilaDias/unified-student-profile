export interface MeetingTemplate {
  id: string;
  name: string;
  description: string;
  agendaItems: string[];
}

export const MEETING_TEMPLATES: MeetingTemplate[] = [
  {
    id: 'general-checkin',
    name: 'General Check-in',
    description: 'Catch up on academics, well-being, and upcoming plans.',
    agendaItems: [
      'How have things been going since we last met?',
      'Academic progress and any concerns',
      'Social and emotional well-being',
      'Upcoming events or deadlines to prepare for',
      'Action items and next steps',
    ],
  },
  {
    id: 'course-selection',
    name: 'Course Selection',
    description: 'Plan next semester or year courses.',
    agendaItems: [
      'Review current transcript and credit progress',
      'Discuss graduation requirements remaining',
      'Explore elective and AP/honors options',
      'Align course choices with postsecondary goals',
      'Finalize course request list',
    ],
  },
  {
    id: 'college-planning',
    name: 'College Planning',
    description: 'Build a college application strategy.',
    agendaItems: [
      'Review college list and application status',
      'Discuss essay topics and progress',
      'Letters of recommendation — who and when',
      'Standardized test scores and retake plans',
      'Financial aid and scholarship deadlines',
    ],
  },
  {
    id: 'career-exploration',
    name: 'Career Exploration',
    description: 'Explore career interests and pathways.',
    agendaItems: [
      'Discuss career interests and inspirations',
      'Review career assessment results',
      'Identify relevant experiences or internships',
      'Connect interests to academic coursework',
      'Set short-term exploration goals',
    ],
  },
  {
    id: 'academic-concern',
    name: 'Academic Concern',
    description: 'Address falling grades or attendance issues.',
    agendaItems: [
      'Review current grades and attendance data',
      'Identify root causes of academic struggles',
      'Discuss support resources available (tutoring, study groups)',
      'Create an academic improvement plan',
      'Set check-in timeline for follow-up',
    ],
  },
  {
    id: 'goal-setting',
    name: 'Goal Setting',
    description: 'Set or review SMART goals.',
    agendaItems: [
      'Reflect on progress toward existing goals',
      'Identify new goals for this period',
      'Break goals into specific, measurable steps',
      'Assign timelines and accountability checkpoints',
      'Celebrate recent accomplishments',
    ],
  },
  {
    id: 'transition-planning',
    name: 'Transition Planning',
    description: 'Prepare for grade-level or school transitions.',
    agendaItems: [
      'Discuss expectations for the upcoming transition',
      'Review readiness — academic, social, and emotional',
      'Identify resources and support at the new level',
      'Address concerns or anxieties about the change',
      'Create a transition action plan',
    ],
  },
  {
    id: 'social-emotional',
    name: 'Social-Emotional',
    description: 'Focus on well-being and personal development.',
    agendaItems: [
      'Check in on overall mood and stress levels',
      'Discuss relationships with peers and family',
      'Explore coping strategies and self-care habits',
      'Identify any external factors affecting school',
      'Connect to additional support if needed',
    ],
  },
  {
    id: 'parent-conference',
    name: 'Parent Conference',
    description: 'Prep for or debrief a parent/guardian meeting.',
    agendaItems: [
      'Summarize student progress and strengths',
      'Share areas for growth with specific examples',
      'Discuss home and school partnership opportunities',
      'Review postsecondary or career planning updates',
      'Agree on follow-up actions for family and school',
    ],
  },
  {
    id: 'end-of-year',
    name: 'End-of-Year Review',
    description: 'Reflect on the year and plan for summer.',
    agendaItems: [
      'Celebrate accomplishments and growth this year',
      'Review final grades and credit completion',
      'Discuss summer plans — jobs, programs, or enrichment',
      'Preview goals and expectations for next year',
      'Confirm any summer action items or deadlines',
    ],
  },
];

export function templateToHTML(template: MeetingTemplate): string {
  const items = template.agendaItems.map((item) => `<li>${item}</li>`).join('');
  return `<h3>${template.name}</h3><ul>${items}</ul>`;
}
