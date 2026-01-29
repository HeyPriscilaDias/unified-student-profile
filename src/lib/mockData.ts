import type {
  Student,
  StudentProfile,
  Milestone,
  Task,
  SuggestedAction,
  SmartGoal,
  AlmaSnapshot,
  Bookmark,
  Recommendation,
  StudentWork,
  ActivityItem,
  AIReflection,
  QualityFlag,
  StudentData,
  Interaction,
} from '@/types/student';

// =============================================================================
// PRIMARY STUDENT: Jessica Santiago (matches design screenshots)
// =============================================================================

export const jessicaSantiago: Student = {
  id: 'jessica-santiago',
  firstName: 'Jessica',
  lastName: 'Santiago',
  grade: 12,
  email: 'jessica.santiago@student.edu',
  location: 'Austin, TX',
  avatarUrl: '/avatars/jessica-santiago.png',
  missionStatement: 'To use my creativity and empathy to help others through healthcare, combining my love of science with my desire to make a real difference in people\'s lives.',
  gpa: 3.87,
  weightedGpa: 3.87,
  satScore: 1380,
  actScore: 29,
  classRank: 'Top 10%',
  readinessScore: 68,
  onTrackStatus: 'on_track',
};

export const jessicaProfile: StudentProfile = {
  academicAchievements: {
    gpa: 3.87,
    gpaMax: 5,
    actScore: 29,
    satScore: 1380,
    classRank: 'Top 10%',
  },
  awards: [
    { id: 'award-1', name: 'National Honor Society' },
    { id: 'award-2', name: 'AP Scholar with Distinction' },
    { id: 'award-3', name: 'Science Fair Regional Winner' },
  ],
  microCredentials: [
    { id: 'cred-1', name: 'First Aid & CPR Certified' },
    { id: 'cred-2', name: 'Google Data Analytics' },
  ],
  courseHighlights: [
    { id: 'course-1', name: 'AP Biology' },
    { id: 'course-2', name: 'AP Chemistry' },
    { id: 'course-3', name: 'Anatomy & Physiology' },
    { id: 'course-4', name: 'AP Calculus AB' },
  ],
  strengths: ['Critical Thinking', 'Problem Solving', 'Communication', 'Collaboration', 'Adaptability'],
  languages: ['English (Native)', 'Spanish (Fluent)', 'French (Intermediate)'],
  experiences: [
    {
      id: 'exp-1',
      title: 'Hospital Volunteer',
      type: 'volunteer',
      organization: 'St. David\'s Medical Center',
      dateRange: 'Jun 2024 - Present',
      description: 'Assisted nurses with patient care activities, helped maintain a clean and organized environment, and provided emotional support to patients and their families.',
      skills: ['Patient Care', 'Communication', 'Empathy', 'Time Management'],
    },
    {
      id: 'exp-2',
      title: 'Student Council President',
      type: 'leadership',
      organization: 'Westlake High School',
      dateRange: 'Aug 2024 - Present',
      description: 'Lead a team of 12 student council members, organize school-wide events, and serve as liaison between students and administration.',
      skills: ['Leadership', 'Public Speaking', 'Event Planning', 'Team Management'],
    },
    {
      id: 'exp-3',
      title: 'Tutor',
      type: 'work',
      organization: 'Kumon Learning Center',
      dateRange: 'Sep 2023 - May 2024',
      description: 'Provided one-on-one tutoring in math and science to K-8 students, developed personalized learning plans, and tracked student progress.',
      skills: ['Teaching', 'Patience', 'Math', 'Science', 'Communication'],
    },
  ],
  durableSkills: {
    summary: 'Great job on your Durable Skills Assessment! Your strengths in Collaboration and Metacognition truly stand out, showcasing your ability to work well with others and reflect on your own learning processes. It\'s wonderful to see you exceeding expectations in these areas. As you continue to develop your skills in Critical Thinking and Fortitude, remember that every step you take contributes to your growth. Keep up the hard work, and I\'m excited to see how you\'ll build on these skills in the future!',
    topSkills: [
      { name: 'Metacognition', level: 4, status: 'Exceeding', icon: 'metacognition' },
      { name: 'Collaboration', level: 4, status: 'Exceeding', icon: 'collaboration' },
      { name: 'Character', level: 3, status: 'Applying', icon: 'character' },
      { name: 'Creativity', level: 3, status: 'Applying', icon: 'creativity' },
    ],
  },
  personalityType: {
    name: 'Thoughtful Guide',
    traits: [
      { name: 'Empathy', description: 'Naturally understands and shares the feelings of others, making connections easily.' },
      { name: 'Creativity', description: 'Approaches problems with innovative solutions and thinks outside the box.' },
      { name: 'Insightfulness', description: 'Quickly grasps complex situations and identifies underlying patterns.' },
      { name: 'Patience', description: 'Remains calm under pressure and takes time to achieve the best outcomes.' },
    ],
  },
  values: 'I believe in treating everyone with kindness and respect, working hard to achieve my goals, and always being willing to help others in need.',
  mission: 'To use my creativity and empathy to help others through healthcare, combining my love of science with my desire to make a real difference in people\'s lives.',
  careerVision: 'I see myself as a nurse practitioner or physician assistant, working in a community health center where I can provide care to underserved populations and make healthcare more accessible.',
};

export const jessicaMilestones: Milestone[] = [
  {
    id: 'milestone-1',
    title: 'Complete Career Assessment',
    type: 'willow_generated',
    status: 'done',
    progress: 100,
    completedAt: '2024-09-15T10:00:00Z',
  },
  {
    id: 'milestone-2',
    title: 'Build Initial College List',
    type: 'willow_generated',
    status: 'done',
    progress: 100,
    completedAt: '2024-10-01T14:30:00Z',
  },
  {
    id: 'milestone-3',
    title: 'Request Letters of Recommendation',
    type: 'willow_generated',
    status: 'done',
    progress: 100,
    completedAt: '2024-10-20T09:00:00Z',
  },
  {
    id: 'milestone-4',
    title: 'Complete Common App Essay',
    type: 'willow_generated',
    status: 'done',
    progress: 100,
    completedAt: '2024-11-05T16:45:00Z',
  },
  {
    id: 'milestone-5',
    title: 'Submit FAFSA Application',
    type: 'willow_generated',
    status: 'not_done',
    progress: 33,
    progressLabel: '1/3',
    dueDate: '2025-01-15T23:59:59Z',
  },
  {
    id: 'milestone-6',
    title: 'Shadow a Healthcare Professional',
    type: 'custom',
    status: 'not_done',
    progress: 0,
    description: 'Arrange and complete job shadowing experience',
  },
];

export const jessicaTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Schedule college visit to UT Austin',
    dueDate: '2025-01-20',
    status: 'open',
    source: 'manual',
    taskType: 'staff',
  },
  {
    id: 'task-2',
    title: 'Follow up on recommendation letter',
    dueDate: '2025-01-10',
    status: 'open',
    source: 'interaction',
    taskType: 'staff',
  },
  {
    id: 'task-3',
    title: 'Research financial aid options',
    dueDate: '2024-12-15',
    status: 'completed',
    source: 'manual',
    taskType: 'staff',
  },
];

export const jessicaSuggestedActions: SuggestedAction[] = [
  {
    id: 'action-1',
    title: 'Apply to the Hispanic Scholarship Fund',
    description: 'Based on your profile and academic achievements, you may qualify for this scholarship.',
    source: 'alma_snapshot',
    status: 'pending',
    assignee: 'student',
  },
  {
    id: 'action-2',
    title: 'Connect with the pre-nursing advisor at UT Austin',
    description: 'From your recent meeting summary, reaching out to the pre-nursing program could help clarify prerequisites.',
    source: 'meeting_summary',
    sourceDate: '2024-12-28',
    status: 'pending',
    assignee: 'staff',
  },
  {
    id: 'action-3',
    title: 'Add volunteer hours to your activities list',
    description: 'Your hospital volunteer experience should be documented in your applications.',
    source: 'alma_snapshot',
    status: 'pending',
    assignee: 'student',
  },
];

export const jessicaSmartGoals: SmartGoal[] = [
  {
    id: 'goal-1',
    title: 'Complete all college applications by January 15th',
    description: 'Submit applications to my top 5 schools before the regular decision deadline.',
    status: 'active',
    subtasks: [
      { id: 'subtask-1-1', title: 'UT Austin application', completed: true },
      { id: 'subtask-1-2', title: 'Texas State application', completed: true },
      { id: 'subtask-1-3', title: 'Texas A&M application', completed: false },
      { id: 'subtask-1-4', title: 'Baylor application', completed: false },
      { id: 'subtask-1-5', title: 'University of Houston application', completed: false },
    ],
  },
  {
    id: 'goal-2',
    title: 'Improve SAT score by 50 points',
    description: 'Retake SAT in March to improve score for scholarship applications.',
    status: 'active',
    subtasks: [
      { id: 'subtask-2-1', title: 'Complete practice test 1', completed: true },
      { id: 'subtask-2-2', title: 'Complete practice test 2', completed: true },
      { id: 'subtask-2-3', title: 'Review weak areas', completed: false },
      { id: 'subtask-2-4', title: 'Complete practice test 3', completed: false },
    ],
  },
  {
    id: 'goal-3',
    title: 'Complete 50 volunteer hours this semester',
    description: 'Continue hospital volunteering and add community service hours.',
    status: 'completed',
    subtasks: [
      { id: 'subtask-3-1', title: '20 hospital hours', completed: true },
      { id: 'subtask-3-2', title: '15 tutoring hours', completed: true },
      { id: 'subtask-3-3', title: '15 community cleanup hours', completed: true },
    ],
  },
];

export const jessicaAlmaSnapshot: AlmaSnapshot = {
  id: 'snapshot-1',
  generatedAt: '2025-01-03T10:30:00Z',
  content: 'Jessica is a high-achieving senior with a strong interest in healthcare careers, particularly nursing. She has demonstrated leadership through her role as Student Council President and shows genuine empathy through her hospital volunteer work. Her academic performance is solid, and she\'s actively working on college applications.',
  bulletPoints: [
    'Strong candidate for nursing/pre-med programs based on coursework and volunteer experience',
    'FAFSA deadline approaching - needs to complete remaining steps',
    'Consider adding healthcare shadowing experience to strengthen applications',
    'Good scholarship potential based on GPA and extracurricular involvement',
  ],
};

export const jessicaBookmarks: Bookmark[] = [
  {
    id: 'bookmark-1',
    type: 'career',
    title: 'Registered Nurse',
    medianSalary: 81220,
    educationYears: '2-4 years',
    tags: ['Healthcare', 'Patient Care', 'In-Demand'],
    isTopPick: true,
    isBookmarked: true,
  },
  {
    id: 'bookmark-2',
    type: 'career',
    title: 'Nurse Practitioner',
    medianSalary: 121610,
    educationYears: '6-8 years',
    tags: ['Healthcare', 'Advanced Practice', 'High Growth'],
    isTopPick: true,
    isBookmarked: true,
  },
  {
    id: 'bookmark-3',
    type: 'career',
    title: 'Physician Assistant',
    medianSalary: 126010,
    educationYears: '6-7 years',
    tags: ['Healthcare', 'Clinical', 'High Growth'],
    isTopPick: false,
    isBookmarked: true,
  },
  {
    id: 'bookmark-4',
    type: 'school',
    title: 'University of Texas at Austin',
    tags: ['Public', 'Research University', 'Texas'],
    isTopPick: true,
    isBookmarked: true,
  },
  {
    id: 'bookmark-5',
    type: 'school',
    title: 'Texas State University',
    tags: ['Public', 'Nursing Program', 'Texas'],
    isTopPick: false,
    isBookmarked: true,
  },
  {
    id: 'bookmark-6',
    type: 'program',
    title: 'BSN - Bachelor of Science in Nursing',
    educationYears: '4 years',
    tags: ['Undergraduate', 'Direct Entry', 'Licensure'],
    isTopPick: true,
    isBookmarked: true,
  },
];

export const jessicaRecommendations: Recommendation[] = [
  {
    id: 'rec-1',
    type: 'career',
    title: 'Fuel Cell Engineer',
    medianSalary: 99040,
    educationYears: '4-6 years',
    tags: ['Engineering', 'Clean Energy', 'Emerging Field'],
    isTopPick: true,
    recommendedBy: 'Ms. Chen (Science Teacher)',
    isBookmarked: false,
  },
  {
    id: 'rec-2',
    type: 'career',
    title: 'Nurse Anesthetist',
    medianSalary: 203090,
    educationYears: '7-8 years',
    tags: ['Healthcare', 'Advanced Practice', 'High Salary'],
    isTopPick: true,
    recommendedBy: 'Mr. Rodriguez (Counselor)',
    isBookmarked: false,
  },
  {
    id: 'rec-3',
    type: 'school',
    title: 'Baylor University',
    tags: ['Private', 'Nursing Program', 'Texas'],
    isTopPick: false,
    recommendedBy: 'Mr. Rodriguez (Counselor)',
    isBookmarked: true,
  },
];

export const jessicaStudentWork: StudentWork[] = [
  {
    id: 'work-1',
    title: 'AP Biology Research Paper',
    dateRange: 'Oct 2024 - Nov 2024',
    category: 'Academic',
    description: 'Comprehensive research paper on the impact of antibiotic resistance in hospital settings. Received an A+ and was selected for the school science symposium.',
    attachments: [
      { id: 'attach-1', type: 'pdf', name: 'Research_Paper_Final.pdf', url: '/files/research-paper.pdf', size: '2.4 MB' },
      { id: 'attach-2', type: 'link', name: 'Presentation Slides', url: 'https://docs.google.com/presentation/example' },
    ],
  },
  {
    id: 'work-2',
    title: 'Student Council Community Event',
    dateRange: 'Sep 2024',
    category: 'Leadership',
    description: 'Organized and led the annual back-to-school community fair, coordinating with 15 local businesses and managing a team of 30 student volunteers.',
    attachments: [
      { id: 'attach-3', type: 'image', name: 'Event_Photo.jpg', url: '/images/event.jpg', size: '1.8 MB' },
      { id: 'attach-4', type: 'link', name: 'Event Website', url: 'https://school.example.com/community-fair' },
    ],
  },
  {
    id: 'work-3',
    title: 'Personal Essay: My Healthcare Journey',
    dateRange: 'Nov 2024',
    category: 'College Application',
    description: 'Common App personal essay reflecting on my experiences volunteering at the hospital and my passion for nursing.',
    attachments: [
      { id: 'attach-5', type: 'pdf', name: 'Personal_Essay_Draft3.pdf', url: '/files/essay.pdf', size: '156 KB' },
    ],
  },
];

export const jessicaActivityHistory: ActivityItem[] = [
  {
    id: 'activity-1',
    type: 'note',
    content: 'Discussed college application strategy and timeline. Jessica is on track with her applications and feeling confident about her essays.',
    createdAt: '2025-01-02T14:30:00Z',
  },
  {
    id: 'activity-2',
    type: 'alma_snapshot',
    content: 'Generated Alma snapshot highlighting Jessica\'s strong progress and upcoming FAFSA deadline.',
    createdAt: '2025-01-03T10:30:00Z',
  },
  {
    id: 'activity-4',
    type: 'milestone_completion',
    content: 'Completed milestone: Complete Common App Essay',
    milestoneName: 'Complete Common App Essay',
    createdAt: '2024-11-05T16:45:00Z',
  },
  {
    id: 'activity-5',
    type: 'note',
    content: 'Jessica mentioned interest in job shadowing a nurse practitioner. Will help connect her with contacts at the hospital.',
    createdAt: '2024-11-01T11:00:00Z',
  },
];

export const jessicaAIReflections: AIReflection[] = [
  {
    id: 'reflection-1',
    title: 'Understanding Patient Care',
    lessonTitle: 'Healthcare Ethics Unit',
    content: 'Today\'s lesson on patient confidentiality really resonated with me. I realized how important trust is in healthcare relationships. When I volunteer at the hospital, I see how patients share personal information with nurses, and it made me understand why HIPAA exists.',
    createdAt: '2024-12-15T14:00:00Z',
    curriculumUnit: 'Health Sciences',
  },
  {
    id: 'reflection-2',
    title: 'Career Exploration Insights',
    lessonTitle: 'Exploring Nursing Pathways',
    content: 'I learned about the different nursing specializations today. I\'m particularly interested in becoming a Nurse Practitioner because it combines direct patient care with the ability to diagnose and treat. The idea of working in a community health center really appeals to me.',
    createdAt: '2024-12-01T10:30:00Z',
    curriculumUnit: 'Career Development',
  },
  {
    id: 'reflection-3',
    title: 'Leadership Growth',
    lessonTitle: 'Effective Team Management',
    content: 'Leading the community fair taught me so much about delegation and communication. I used to try to do everything myself, but I learned that trusting my team members actually leads to better outcomes.',
    createdAt: '2024-10-20T15:00:00Z',
    curriculumUnit: 'Leadership Skills',
  },
  {
    id: 'reflection-4',
    title: 'Financial Planning for College',
    lessonTitle: 'Understanding FAFSA',
    content: 'The FAFSA process seemed overwhelming at first, but breaking it down step by step made it manageable. I learned that I might qualify for more aid than I expected based on my family\'s situation.',
    createdAt: '2024-10-05T11:00:00Z',
    curriculumUnit: 'College Planning',
  },
];

export const jessicaQualityFlags: QualityFlag[] = [];

export const jessicaInteractions: Interaction[] = [
  // Completed interaction with recording
  {
    id: 'interaction-1',
    studentId: 'jessica-santiago',
    counselorId: 'counselor-rodriguez',
    counselorName: 'Ms. Rodriguez',
    title: 'College Planning Check-in',
    interactionDate: '2024-12-28',
    status: 'completed',
    summary: `<h3>Application Status</h3>
<ul>
<li><strong>Texas A&M:</strong> Submitted</li>
<li><strong>Baylor:</strong> Supplemental essay in progress, target by New Year's</li>
<li><strong>UH:</strong> Not started, using Common App</li>
</ul>

<h3>Financial Aid</h3>
<ul>
<li>FAFSA mostly complete</li>
<li>Waiting on parent tax documents</li>
<li>Priority deadline: <strong>January 15th</strong></li>
</ul>`,
    recordingUrl: 'https://example.com/recording-1',
    transcript: `Counselor: Hi Jessica, thanks for coming in today. How are you feeling about everything?

Student: Pretty good actually! I submitted my Texas A&M application last week and I'm feeling confident about my essays.

Counselor: That's great to hear! Let's go through your application status. You mentioned Texas A&M is done - what about the others?

Student: Baylor is almost ready, I just need to finish the supplemental essay. And Houston I haven't started yet but it uses the Common App so it should be quick.

Counselor: Good plan. What's your timeline for getting those submitted?

Student: I want to have Baylor done by New Year's and Houston by the first week of January.

Counselor: Perfect. Now let's talk about financial aid. Have you started the FAFSA?

Student: Yes! My parents and I got through most of it over the break. We just need to get the tax documents sorted out.

Counselor: That's the most common holdup. Do you know when your parents will have their taxes ready?

Student: They said they're going to try to do them early this year, hopefully by mid-January.

Counselor: Great. The FAFSA deadline for priority consideration is January 15th, so try to submit as soon as you can after that.`,
    aiSummary: {
      overview: 'Jessica is making excellent progress on her college applications. Texas A&M has been submitted, and she has clear plans to complete Baylor and University of Houston applications in early January. FAFSA is mostly complete, pending tax documents from parents.',
      keyPoints: [
        'Texas A&M application submitted successfully',
        'Baylor supplemental essay in progress, target completion by New Year\'s',
        'University of Houston application to be completed first week of January',
        'FAFSA nearly complete, waiting on parent tax documents',
        'Priority FAFSA deadline is January 15th',
      ],
      studentSentiment: 'positive',
      recommendedActions: [
        {
          id: 'action-1-1',
          title: 'Complete Baylor supplemental essay',
          description: 'Finish the supplemental essay for Baylor application',
          priority: 'high',
          dueDate: '2025-01-01',
          status: 'pending',
          assignee: 'student',
        },
        {
          id: 'action-1-2',
          title: 'Submit University of Houston application',
          priority: 'medium',
          dueDate: '2025-01-07',
          status: 'pending',
          assignee: 'student',
        },
        {
          id: 'action-1-3',
          title: 'Follow up with parents on tax documents',
          description: 'Ensure tax documents are ready for FAFSA completion',
          priority: 'high',
          dueDate: '2025-01-10',
          status: 'pending',
          assignee: 'student',
        },
      ],
      generatedAt: '2024-12-28T10:35:00Z',
    },
    createdAt: '2024-12-28T09:00:00Z',
    updatedAt: '2024-12-28T10:35:00Z',
  },
  // Completed interaction (summary only, no recording)
  {
    id: 'interaction-2',
    studentId: 'jessica-santiago',
    counselorId: 'counselor-rodriguez',
    counselorName: 'Ms. Rodriguez',
    title: 'Senior Year Kickoff',
    interactionDate: '2024-09-05',
    status: 'completed',
    summary: `<h3>College List (Finalized)</h3>
<ul>
<li><strong>UT Austin</strong> (reach)</li>
<li><strong>Texas A&M</strong></li>
<li><strong>Baylor</strong></li>
<li><strong>Texas State</strong> (early action Nov 1)</li>
<li><strong>University of Houston</strong></li>
</ul>
<p>All schools have nursing/pre-nursing programs</p>

<h3>Recommendation Letters</h3>
<ul>
<li>Mrs. Johnson (AP Bio)</li>
<li>Mr. Chen (AP Calc)</li>
</ul>

<h3>Next Steps</h3>
<ul>
<li>Request recommendation letters by Sept 15</li>
<li>Start Common App essay brainstorming</li>
<li>Research Texas State early action requirements</li>
</ul>`,
    createdAt: '2024-09-05T09:00:00Z',
    updatedAt: '2024-09-05T10:20:00Z',
  },
  // Draft interaction
  {
    id: 'interaction-3',
    studentId: 'jessica-santiago',
    counselorId: 'counselor-rodriguez',
    counselorName: 'Ms. Rodriguez',
    title: 'FAFSA Follow-up',
    interactionDate: '2025-01-25',
    status: 'draft',
    summary: '',
    createdAt: '2025-01-15T14:00:00Z',
    updatedAt: '2025-01-15T14:00:00Z',
  },
  // Meeting with another counselor (Mr. Chen)
  {
    id: 'interaction-4',
    studentId: 'jessica-santiago',
    counselorId: 'counselor-chen',
    counselorName: 'Mr. Chen',
    title: 'Academic Advising - Math Placement',
    interactionDate: '2024-08-20',
    status: 'completed',
    summary: `<h3>Math Course Selection</h3>
<ul>
<li>Recommended: AP Calculus AB based on strong Precalculus performance</li>
<li>Alternative: AP Statistics if workload becomes too heavy</li>
</ul>

<h3>Notes</h3>
<p>Jessica expressed confidence in her math abilities. She mentioned wanting to keep math strong for nursing prerequisites.</p>`,
    createdAt: '2024-08-20T11:00:00Z',
    updatedAt: '2024-08-20T11:45:00Z',
  },
  // Another meeting with a different counselor (Ms. Thompson)
  {
    id: 'interaction-5',
    studentId: 'jessica-santiago',
    counselorId: 'counselor-thompson',
    counselorName: 'Ms. Thompson',
    title: 'College Essay Workshop',
    interactionDate: '2024-10-15',
    status: 'completed',
    summary: `<h3>Essay Topics Discussed</h3>
<ul>
<li>Personal statement: Hospital volunteering experience as hook</li>
<li>Why nursing: Combine empathy with science passion</li>
<li>Diversity essay: Bilingual/bicultural background</li>
</ul>

<h3>Next Steps</h3>
<ul>
<li>First draft due October 25th</li>
<li>Schedule follow-up review session</li>
</ul>`,
    createdAt: '2024-10-15T14:00:00Z',
    updatedAt: '2024-10-15T15:30:00Z',
  },
];

// Complete Jessica data bundle
export const jessicaData: StudentData = {
  student: jessicaSantiago,
  profile: jessicaProfile,
  milestones: jessicaMilestones,
  tasks: jessicaTasks,
  suggestedActions: jessicaSuggestedActions,
  smartGoals: jessicaSmartGoals,
  almaSnapshot: jessicaAlmaSnapshot,
  bookmarks: jessicaBookmarks,
  recommendations: jessicaRecommendations,
  studentWork: jessicaStudentWork,
  activityHistory: jessicaActivityHistory,
  aiReflections: jessicaAIReflections,
  qualityFlags: jessicaQualityFlags,
  interactions: jessicaInteractions,
};

// =============================================================================
// EDGE CASE STUDENTS
// =============================================================================

// Student A - Brand new (no data) - tests empty states
export const studentANew: Student = {
  id: 'student-a-new',
  firstName: 'Alex',
  lastName: '(new student)',
  grade: 9,
  email: 'alex.new@student.edu',
  location: 'Dallas, TX',
  avatarUrl: '/avatars/default.jpg',
  missionStatement: '',
  gpa: 0,
  satScore: null,
  actScore: null,
  classRank: 'N/A',
  readinessScore: 0,
  onTrackStatus: 'on_track',
};

export const studentAData: StudentData = {
  student: studentANew,
  profile: {
    academicAchievements: { gpa: 0, gpaMax: 5, actScore: null, satScore: null, classRank: 'N/A' },
    awards: [],
    microCredentials: [],
    courseHighlights: [],
    strengths: [],
    languages: ['English (Native)'],
    experiences: [],
    durableSkills: { summary: '', topSkills: [] },
    personalityType: { name: '', traits: [] },
    values: '',
    mission: '',
    careerVision: '',
  },
  milestones: [],
  tasks: [],
  suggestedActions: [],
  smartGoals: [],
  almaSnapshot: null,
  bookmarks: [],
  recommendations: [],
  studentWork: [],
  activityHistory: [],
  aiReflections: [],
  qualityFlags: [],
  interactions: [],
};

// Student B - Off-track (GPA < 2.0)
export const studentBLowGPA: Student = {
  id: 'student-b-low-gpa',
  firstName: 'Blake',
  lastName: '(struggling)',
  grade: 11,
  email: 'blake.struggling@student.edu',
  location: 'Houston, TX',
  avatarUrl: '/avatars/default.jpg',
  missionStatement: 'Still figuring things out.',
  gpa: 1.8,
  satScore: null,
  actScore: null,
  classRank: 'Bottom 50%',
  readinessScore: 25,
  onTrackStatus: 'off_track',
};

export const studentBData: StudentData = {
  student: studentBLowGPA,
  profile: {
    academicAchievements: { gpa: 1.8, gpaMax: 5, actScore: null, satScore: null, classRank: 'Bottom 50%' },
    awards: [],
    microCredentials: [],
    courseHighlights: [{ id: 'course-1', name: 'Art I' }],
    strengths: ['Creativity', 'Persistence'],
    languages: ['English (Native)'],
    experiences: [],
    durableSkills: { summary: 'Blake shows potential in creative problem-solving but needs support in academic areas.', topSkills: [] },
    personalityType: { name: 'Creative Explorer', traits: [{ name: 'Creativity', description: 'Thinks in unique ways.' }] },
    values: '',
    mission: 'Still figuring things out.',
    careerVision: '',
  },
  milestones: [
    { id: 'milestone-1', title: 'Complete Career Assessment', type: 'willow_generated', status: 'not_done', progress: 0 },
  ],
  tasks: [
    { id: 'task-blake-1', title: 'Schedule tutoring session for Blake', dueDate: '2025-01-22', status: 'open', source: 'manual', taskType: 'staff' },
    { id: 'task-blake-2', title: 'Contact Blake\'s parents about academic support', dueDate: '2025-01-18', status: 'open', source: 'suggested_action', taskType: 'staff' },
    { id: 'task-blake-3', title: 'Review Blake\'s progress in Art I', dueDate: null, status: 'completed', source: 'manual', taskType: 'staff' },
  ],
  suggestedActions: [
    { id: 'action-1', title: 'Meet with academic advisor', description: 'Discuss strategies for improving grades.', source: 'alma_snapshot', status: 'pending', assignee: 'staff' },
  ],
  smartGoals: [],
  almaSnapshot: {
    id: 'snapshot-b',
    generatedAt: '2025-01-02T10:00:00Z',
    content: 'Blake is currently struggling academically but shows creative potential. Needs additional support and engagement.',
    bulletPoints: ['GPA below 2.0 - academic intervention recommended', 'Consider creative career pathways', 'Would benefit from tutoring support'],
  },
  bookmarks: [],
  recommendations: [],
  studentWork: [],
  activityHistory: [],
  aiReflections: [],
  qualityFlags: [],
  interactions: [
    {
      id: 'interaction-blake-1',
      studentId: 'student-b-low-gpa',
      counselorId: 'counselor-rodriguez',
      counselorName: 'Ms. Rodriguez',
      title: 'Academic Support Check-in',
      interactionDate: '2025-01-10',
      status: 'completed',
      summary: `<h3>Current Situation</h3>
<ul>
<li>GPA at 1.8 - need to bring up to 2.0 minimum</li>
<li>Struggling in Algebra II and English</li>
<li>Showing improvement in Art class</li>
</ul>

<h3>Support Plan</h3>
<ul>
<li>Enrolled in after-school tutoring for math</li>
<li>Weekly check-ins with Ms. Rodriguez</li>
<li>Explore creative career pathways</li>
</ul>`,
      createdAt: '2025-01-10T09:00:00Z',
      updatedAt: '2025-01-10T10:00:00Z',
    },
    {
      id: 'interaction-blake-2',
      studentId: 'student-b-low-gpa',
      counselorId: 'counselor-chen',
      counselorName: 'Mr. Chen',
      title: 'Course Recovery Options',
      interactionDate: '2024-12-15',
      status: 'completed',
      summary: `<h3>Recovery Options Discussed</h3>
<ul>
<li>Credit recovery program available in summer</li>
<li>Online course options for failed classes</li>
<li>Grade improvement plan with teachers</li>
</ul>`,
      createdAt: '2024-12-15T14:00:00Z',
      updatedAt: '2024-12-15T15:00:00Z',
    },
  ],
};

// Student C - Off-track (missed deadline)
export const studentCMissedDeadline: Student = {
  id: 'student-c-missed',
  firstName: 'Casey',
  lastName: '(behind)',
  grade: 12,
  email: 'casey.behind@student.edu',
  location: 'San Antonio, TX',
  avatarUrl: '/avatars/default.jpg',
  missionStatement: 'Working to get back on track.',
  gpa: 3.2,
  satScore: 1200,
  actScore: 25,
  classRank: 'Top 30%',
  readinessScore: 45,
  onTrackStatus: 'off_track',
};

export const studentCData: StudentData = {
  student: studentCMissedDeadline,
  profile: {
    academicAchievements: { gpa: 3.2, gpaMax: 5, actScore: 25, satScore: 1200, classRank: 'Top 30%' },
    awards: [],
    microCredentials: [],
    courseHighlights: [],
    strengths: ['Organization', 'Detail-oriented'],
    languages: ['English (Native)'],
    experiences: [],
    durableSkills: { summary: 'Casey has good organizational skills but has fallen behind on key milestones.', topSkills: [] },
    personalityType: { name: 'Careful Planner', traits: [] },
    values: '',
    mission: 'Working to get back on track.',
    careerVision: '',
  },
  milestones: [
    { id: 'milestone-1', title: 'Complete Career Assessment', type: 'willow_generated', status: 'done', progress: 100 },
    { id: 'milestone-2', title: 'Build Initial College List', type: 'willow_generated', status: 'not_done', progress: 50, dueDate: '2024-11-01T23:59:59Z' }, // Past due
    { id: 'milestone-3', title: 'Request Letters of Recommendation', type: 'willow_generated', status: 'not_done', progress: 0, dueDate: '2024-12-01T23:59:59Z' }, // Past due
  ],
  tasks: [
    { id: 'task-1', title: 'Finish college list ASAP', dueDate: null, status: 'open', source: 'manual', taskType: 'staff' },
  ],
  suggestedActions: [],
  smartGoals: [],
  almaSnapshot: null,
  bookmarks: [],
  recommendations: [],
  studentWork: [],
  activityHistory: [],
  aiReflections: [],
  qualityFlags: [],
  interactions: [
    {
      id: 'interaction-casey-1',
      studentId: 'student-c-missed',
      counselorId: 'counselor-rodriguez',
      counselorName: 'Ms. Rodriguez',
      title: 'Deadline Recovery Planning',
      interactionDate: '2025-01-20',
      status: 'completed',
      summary: `<h3>Missed Deadlines</h3>
<ul>
<li>College list was due Nov 1 - only 50% done</li>
<li>Recommendation letters not requested yet (was due Dec 1)</li>
</ul>

<h3>Recovery Plan</h3>
<ul>
<li>Finalize college list this week - focus on schools with rolling admissions</li>
<li>Request recommendation letters immediately</li>
<li>Identify 2-3 backup schools with later deadlines</li>
</ul>`,
      createdAt: '2025-01-20T10:00:00Z',
      updatedAt: '2025-01-20T11:00:00Z',
    },
  ],
};

// Student D - Many reflections (20+) - tests pagination
export const studentDActive: Student = {
  id: 'student-d-active',
  firstName: 'Dana',
  lastName: '(active)',
  grade: 11,
  email: 'dana.active@student.edu',
  location: 'Austin, TX',
  avatarUrl: '/avatars/default.jpg',
  missionStatement: 'Always learning and growing.',
  gpa: 3.5,
  satScore: null,
  actScore: null,
  classRank: 'Top 25%',
  readinessScore: 55,
  onTrackStatus: 'on_track',
};

// Generate 25 AI reflections for Dana
const danaReflections: AIReflection[] = Array.from({ length: 25 }, (_, i) => ({
  id: `reflection-d-${i + 1}`,
  title: `Reflection ${i + 1}: Learning Journey`,
  lessonTitle: `Unit ${Math.floor(i / 5) + 1} Lesson`,
  content: `This is reflection ${i + 1}. I learned important concepts about personal growth and career development.`,
  createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
  curriculumUnit: `Unit ${Math.floor(i / 5) + 1}`,
}));

export const studentDData: StudentData = {
  student: studentDActive,
  profile: {
    academicAchievements: { gpa: 3.5, gpaMax: 5, actScore: null, satScore: null, classRank: 'Top 25%' },
    awards: [{ id: 'award-1', name: 'Most Improved' }],
    microCredentials: [],
    courseHighlights: [],
    strengths: ['Curiosity', 'Dedication'],
    languages: ['English (Native)'],
    experiences: [],
    durableSkills: { summary: 'Dana is highly engaged with learning activities and shows consistent growth.', topSkills: [] },
    personalityType: { name: 'Eager Learner', traits: [] },
    values: '',
    mission: 'Always learning and growing.',
    careerVision: '',
  },
  milestones: [
    { id: 'milestone-1', title: 'Complete Career Assessment', type: 'willow_generated', status: 'done', progress: 100 },
  ],
  tasks: [
    { id: 'task-dana-1', title: 'Review Dana\'s reflection portfolio', dueDate: '2025-01-25', status: 'open', source: 'manual', taskType: 'staff' },
    { id: 'task-dana-2', title: 'Discuss summer internship options', dueDate: null, status: 'open', source: 'interaction', taskType: 'staff' },
  ],
  suggestedActions: [],
  smartGoals: [],
  almaSnapshot: null,
  bookmarks: [],
  recommendations: [],
  studentWork: [],
  activityHistory: [],
  aiReflections: danaReflections,
  qualityFlags: [],
  interactions: [],
};

// Student E - GPA exactly 2.0 - boundary condition
export const studentEBorderline: Student = {
  id: 'student-e-borderline',
  firstName: 'Elliott',
  lastName: '(borderline)',
  grade: 10,
  email: 'elliott.borderline@student.edu',
  location: 'Fort Worth, TX',
  avatarUrl: '/avatars/default.jpg',
  missionStatement: 'Taking it one day at a time.',
  gpa: 2.0, // Exactly at threshold - should be on_track (< 2.0 is off-track)
  satScore: null,
  actScore: null,
  classRank: 'Top 50%',
  readinessScore: 35,
  onTrackStatus: 'on_track',
};

export const studentEData: StudentData = {
  student: studentEBorderline,
  profile: {
    academicAchievements: { gpa: 2.0, gpaMax: 5, actScore: null, satScore: null, classRank: 'Top 50%' },
    awards: [],
    microCredentials: [],
    courseHighlights: [],
    strengths: ['Resilience'],
    languages: ['English (Native)'],
    experiences: [],
    durableSkills: { summary: 'Elliott is working to maintain academic standing.', topSkills: [] },
    personalityType: { name: 'Determined', traits: [] },
    values: '',
    mission: 'Taking it one day at a time.',
    careerVision: '',
  },
  milestones: [],
  tasks: [],
  suggestedActions: [],
  smartGoals: [],
  almaSnapshot: null,
  bookmarks: [],
  recommendations: [],
  studentWork: [],
  activityHistory: [],
  aiReflections: [],
  qualityFlags: [],
  interactions: [],
};

// =============================================================================
// DATA LOOKUP FUNCTIONS
// =============================================================================

const allStudentData: Record<string, StudentData> = {
  'jessica-santiago': jessicaData,
  'student-a-new': studentAData,
  'student-b-low-gpa': studentBData,
  'student-c-missed': studentCData,
  'student-d-active': studentDData,
  'student-e-borderline': studentEData,
};

export function getStudentData(studentId: string): StudentData | null {
  return allStudentData[studentId] || null;
}

export function getAllStudents(): Student[] {
  return Object.values(allStudentData).map(data => data.student);
}

export function getAllStudentInteractions(): Record<string, Interaction[]> {
  const result: Record<string, Interaction[]> = {};
  for (const [studentId, data] of Object.entries(allStudentData)) {
    if (data.interactions.length > 0) {
      result[studentId] = data.interactions;
    }
  }
  return result;
}

export function getAllStudentTasks(): Record<string, Task[]> {
  const result: Record<string, Task[]> = {};
  for (const [studentId, data] of Object.entries(allStudentData)) {
    if (data.tasks.length > 0) {
      result[studentId] = data.tasks;
    }
  }
  return result;
}

export const defaultStudentId = 'jessica-santiago';
