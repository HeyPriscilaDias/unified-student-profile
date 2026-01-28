import type { StudentData } from '@/types/student';

// Types for AI topic recommendations (used only in this service)
export type TopicCategory = 'deadline' | 'milestone' | 'goal' | 'reflection' | 'bookmark' | 'grade_level' | 'follow_up';

export interface TopicRecommendation {
  id: string;
  topic: string;
  description?: string;
  category: TopicCategory;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  sourceReference?: {
    type: 'milestone' | 'task' | 'reflection' | 'bookmark' | 'grade_level' | 'goal' | 'interaction';
    id?: string;
    title?: string;
  };
}

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/**
 * Grade-level breakdown for counselor-student meeting topics
 */
const GRADE_LEVEL_GUIDANCE = `
## 9th Grade
**Focus:** Discovery | **Exposure:** Awareness

**Milestones to Check:**
- Personality Quiz, Life Map, Who Am I? Statement
- Portfolio: Strengths, Interests, Values
- Mission Statement + Action Plan

**Conversation Topics:**
- Relationship building & counselor role
- Personality quiz results → connection to interests
- Values → connection to Mission Statement
- Course selection alignment with emerging interests
- Extracurricular engagement (depth over breadth)

**Key Decision Point:** Interest-course misalignment

---

## 10th Grade
**Focus:** Exploration | **Exposure:** Engagement

**Milestones to Check:**
- Durable Skills Quiz
- Career Vision, Career Evaluation Matrix
- 3 Careers bookmarked + added to Matrix
- Impact Project (Proposal, Presentation, Careers)
- Career Pathways Analysis + Presentation
- 1 Career Interview or Job Shadow

**Conversation Topics:**
- Career exploration progress → which Global Pressing Challenges resonate?
- Career Matrix review → are choices grounded in interests/values?
- Impact Project reflection → what did you learn about yourself?
- Alignment with emerging career pathways
- Job shadow/interview debrief (if complete)

**Key Decision Point:** Career interests misaligned with current course trajectory

---

## 11th Grade
**Focus:** Launch | **Exposure:** Experience

**Milestones to Check:**
- Updated Portfolio (Strengths, Interests, Work Experience)
- Polished Resume
- Balanced List (8 schools/programs)
- Program Comparison Matrix with rationale
- Application-Ready Personal Statement

**Conversation Topics:**
- Balanced list review → reach/match/safety calibration using Willow ROI data
- Program Comparison Matrix → is rationale grounded in career goals + financial reality?
- Personal statement progress → authentic story emerging?
- Resume review → gaps to address before senior year?
- Financial reality check → net price calculator results, family expectations

**Key Decision Points:**
- Financial reality conflicts with college preferences
- Options overwhelm (can't narrow list)
- Family-student disagreement on pathway

---

## 12th Grade
**Focus:** Launch | **Exposure:** Experience

**Milestones to Check:**
- On-Track Review (transcript, graduation requirements)
- FAFSA submitted
- Scholarship applications submitted
- CSS Profile / State Financial Aid (if applicable)
- Applications submitted (college or trade/apprenticeship)
- Finalized Balanced List + Personal Statement
- Postsecondary Decision Defense
- Durable Skills Quiz, Workplace Ready Resume, LinkedIn Profile

**Conversation Topics:**
- Application status check → what's submitted, what's pending?
- Financial aid progress → FAFSA complete? Scholarships submitted?
- Decision support → comparing offers using Willow ROI data
- Postsecondary Decision Defense prep → can student articulate rationale?
- Transition readiness → next steps after commitment

**Key Decision Points:**
- Financial aid package comparison
- Student goes silent on deadlines
- Family-student disagreement on final decision
`;

/**
 * Build the prompt for Gemini to generate topic recommendations
 */
function buildTopicRecommendationPrompt(studentData: StudentData): string {
  const { student, milestones, smartGoals, bookmarks, aiReflections, interactions, profile } = studentData;

  // Get incomplete milestones
  const incompleteMilestones = milestones
    .filter(m => m.status !== 'done')
    .map(m => `- ${m.title} (${m.status}, ${m.progress}% complete${m.dueDate ? `, due: ${m.dueDate}` : ''})`)
    .join('\n');

  // Get active goals
  const activeGoals = smartGoals
    .filter(g => g.status === 'active')
    .map(g => {
      const completedSubtasks = g.subtasks.filter(s => s.completed).length;
      return `- ${g.title}: ${completedSubtasks}/${g.subtasks.length} subtasks complete`;
    })
    .join('\n');

  // Get bookmarked careers/programs
  const bookmarkedItems = bookmarks
    .slice(0, 5)
    .map(b => `- ${b.title} (${b.type}${b.isTopPick ? ', TOP PICK' : ''})`)
    .join('\n');

  // Get recent AI reflections
  const recentReflections = aiReflections
    .slice(0, 3)
    .map(r => `- "${r.title}" from lesson "${r.lessonTitle}"`)
    .join('\n');

  // Get last interaction summary if available
  const completedInteractions = interactions.filter(m => m.status === 'completed' && m.interactionDate);
  const lastInteraction = completedInteractions.length > 0
    ? completedInteractions.sort((a, b) =>
        new Date(b.interactionDate!).getTime() - new Date(a.interactionDate!).getTime()
      )[0]
    : null;

  const lastInteractionSummary = lastInteraction?.summary || lastInteraction?.aiSummary
    ? `Last interaction "${lastInteraction.title}"${lastInteraction.interactionDate ? ` on ${new Date(lastInteraction.interactionDate).toLocaleDateString()}` : ''}:
- Summary: ${lastInteraction.aiSummary?.overview || lastInteraction.summary || 'No summary'}
- Key points: ${lastInteraction.aiSummary?.keyPoints?.join(', ') || 'None'}
- Pending actions: ${lastInteraction.aiSummary?.recommendedActions?.filter(a => a.status === 'pending').map(a => a.title).join(', ') || 'None'}`
    : 'No previous interaction data available.';

  // Build profile context
  const profileContext = profile ? `
**Durable Skills:** ${profile.durableSkills?.topSkills?.map(s => `${s.name} (${s.level})`).join(', ') || 'Not assessed'}
**Personality Type:** ${profile.personalityType?.name || 'Not assessed'}
**Career Vision:** ${profile.careerVision || 'Not specified'}
**Work Experience:** ${profile.experiences?.length || 0} experiences logged
**Strengths:** ${profile.strengths?.join(', ') || 'Not specified'}
` : '';

  return `You are a high school counselor assistant helping prepare for a student meeting. Generate personalized topic recommendations based on the student's grade level, progress, and data.

${GRADE_LEVEL_GUIDANCE}

---

## Student Context

**Student:** ${student.firstName} ${student.lastName}
**Grade:** ${student.grade}
**GPA:** ${student.gpa}
**On-Track Status:** ${student.onTrackStatus}
**SAT Score:** ${student.satScore || 'Not taken'}
**ACT Score:** ${student.actScore || 'Not taken'}
${profileContext}

**Incomplete Milestones:**
${incompleteMilestones || 'All milestones complete'}

**Active Goals:**
${activeGoals || 'No active goals'}

**Bookmarked Careers/Programs:**
${bookmarkedItems || 'No bookmarks'}

**Recent AI Reflections:**
${recentReflections || 'No recent reflections'}

**Previous Interaction Context:**
${lastInteractionSummary}

---

## Instructions

Based on the grade-level guidance above and this student's specific data, recommend 4-6 topics for the upcoming counselor meeting. For each topic:

1. Consider the student's grade level and what milestones/conversations are most relevant
2. Identify any red flags or key decision points that need attention
3. Connect recommendations to specific student data (milestones, goals, bookmarks, etc.)
4. Prioritize topics that address immediate needs or upcoming deadlines

Return a JSON array of topic recommendations with this exact structure:
\`\`\`json
[
  {
    "id": "unique-id",
    "topic": "Brief topic title",
    "description": "1-2 sentence description of what to discuss",
    "category": "deadline|milestone|goal|reflection|bookmark|grade_level|follow_up",
    "priority": "high|medium|low",
    "reason": "Why this topic is recommended based on student data",
    "sourceReference": {
      "type": "milestone|task|reflection|bookmark|grade_level|goal|interaction",
      "id": "optional-id-if-applicable",
      "title": "optional-title"
    }
  }
]
\`\`\`

Categories explained:
- deadline: Time-sensitive items with upcoming due dates
- milestone: Progress on required milestones for the grade level
- goal: Active SMART goals the student is working on
- reflection: Follow-up on recent AI reflections or self-discovery
- bookmark: Career/program exploration based on bookmarked items
- grade_level: Standard topics for this grade level from the guidance
- follow_up: Items from previous interactions that need follow-up

Return ONLY the JSON array, no other text.`;
}

/**
 * Parse Gemini response into TopicRecommendation array
 */
function parseGeminiResponse(responseText: string): TopicRecommendation[] {
  try {
    // Extract JSON from response (handle markdown code blocks)
    let jsonStr = responseText;
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    const parsed = JSON.parse(jsonStr);

    if (!Array.isArray(parsed)) {
      console.error('Gemini response is not an array');
      return [];
    }

    // Validate and transform each recommendation
    return parsed.map((item, index) => {
      const srcRef = item.sourceReference;
      return {
        id: item.id || `gemini-${index}-${Date.now()}`,
        topic: item.topic || 'Untitled Topic',
        description: item.description,
        category: validateCategory(item.category),
        priority: validatePriority(item.priority),
        reason: item.reason || '',
        sourceReference: srcRef ? {
          type: srcRef.type as 'milestone' | 'task' | 'reflection' | 'bookmark' | 'grade_level' | 'goal' | 'interaction',
          id: srcRef.id,
          title: srcRef.title,
        } : undefined,
      };
    });
  } catch (error) {
    console.error('Failed to parse Gemini response:', error);
    return [];
  }
}

function validateCategory(category: string): TopicCategory {
  const validCategories: TopicCategory[] = ['deadline', 'milestone', 'goal', 'reflection', 'bookmark', 'grade_level', 'follow_up'];
  return validCategories.includes(category as TopicCategory)
    ? (category as TopicCategory)
    : 'grade_level';
}

function validatePriority(priority: string): 'high' | 'medium' | 'low' {
  const validPriorities = ['high', 'medium', 'low'];
  return validPriorities.includes(priority)
    ? (priority as 'high' | 'medium' | 'low')
    : 'medium';
}

/**
 * Generate topic recommendations using Gemini API
 */
export async function generateAITopicRecommendations(
  studentData: StudentData
): Promise<TopicRecommendation[]> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('Gemini API key not configured, falling back to static recommendations');
    return [];
  }

  const prompt = buildTopicRecommendationPrompt(studentData);

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      return [];
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      console.error('No response text from Gemini');
      return [];
    }

    return parseGeminiResponse(responseText);
  } catch (error) {
    console.error('Failed to call Gemini API:', error);
    return [];
  }
}

/**
 * Build the prompt for Gemini to generate a text-based meeting agenda
 */
function buildTextAgendaPrompt(studentData: StudentData, interactionDate?: string): string {
  const { student, milestones, smartGoals, bookmarks, aiReflections, interactions, profile } = studentData;

  // Get incomplete milestones
  const incompleteMilestones = milestones
    .filter(m => m.status !== 'done')
    .map(m => `- ${m.title} (${m.progress}% complete${m.dueDate ? `, due: ${m.dueDate}` : ''})`)
    .join('\n');

  // Get active goals
  const activeGoals = smartGoals
    .filter(g => g.status === 'active')
    .map(g => {
      const completedSubtasks = g.subtasks.filter(s => s.completed).length;
      return `- ${g.title}: ${completedSubtasks}/${g.subtasks.length} subtasks complete`;
    })
    .join('\n');

  // Get bookmarked careers/programs
  const bookmarkedItems = bookmarks
    .slice(0, 5)
    .map(b => `- ${b.title} (${b.type}${b.isTopPick ? ', TOP PICK' : ''})`)
    .join('\n');

  // Get recent AI reflections
  const recentReflections = aiReflections
    .slice(0, 3)
    .map(r => `- "${r.title}" from lesson "${r.lessonTitle}"`)
    .join('\n');

  // Get last interaction summary if available
  const completedInteractions = interactions.filter(m => m.status === 'completed' && m.interactionDate);
  const lastInteraction = completedInteractions.length > 0
    ? completedInteractions.sort((a, b) =>
        new Date(b.interactionDate!).getTime() - new Date(a.interactionDate!).getTime()
      )[0]
    : null;

  const lastInteractionContext = lastInteraction?.summary || lastInteraction?.aiSummary
    ? `Last interaction "${lastInteraction.title}"${lastInteraction.interactionDate ? ` on ${new Date(lastInteraction.interactionDate).toLocaleDateString()}` : ''}:
- Summary: ${lastInteraction.aiSummary?.overview || lastInteraction.summary || 'No summary'}
- Pending actions: ${lastInteraction.aiSummary?.recommendedActions?.filter(a => a.status === 'pending').map(a => a.title).join(', ') || 'None'}`
    : 'No previous interaction data available.';

  // Build profile context
  const profileContext = profile ? `
**Career Vision:** ${profile.careerVision || 'Not specified'}
**Strengths:** ${profile.strengths?.join(', ') || 'Not specified'}
**Work Experience:** ${profile.experiences?.length || 0} experiences logged` : '';

  const formattedDate = interactionDate
    ? new Date(interactionDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : 'Upcoming';

  return `You are a high school counselor preparing an interaction agenda for a student. Generate a clear, readable text agenda that can be edited by the counselor.

${GRADE_LEVEL_GUIDANCE}

---

## Student Context

**Student:** ${student.firstName} ${student.lastName}
**Grade:** ${student.grade}
**GPA:** ${student.gpa}
**On-Track Status:** ${student.onTrackStatus}
${profileContext}

**Incomplete Milestones:**
${incompleteMilestones || 'All milestones complete'}

**Active Goals:**
${activeGoals || 'No active goals'}

**Bookmarked Careers/Programs:**
${bookmarkedItems || 'No bookmarks'}

**Recent AI Reflections:**
${recentReflections || 'No recent reflections'}

**Previous Interaction Context:**
${lastInteractionContext}

---

## Instructions

Generate a meeting agenda as HTML that follows this format exactly:

<div><b>Meeting with ${student.firstName} ${student.lastName}</b></div>
<div>Grade ${student.grade} | ${formattedDate}</div>
<br>
<div><b>PRIORITY ITEMS</b></div>
<ul>
<li><b>[Topic title]</b><br>[1-2 sentence context based on student data]</li>
</ul>
<br>
<div><b>DISCUSSION TOPICS</b></div>
<ul>
<li><b>[Topic title]</b><br>[1-2 sentence context based on student data]</li>
</ul>
<br>
<div><b>NOTES</b></div>
<div></div>

Requirements:
1. Include 2-3 priority items based on urgent deadlines, incomplete milestones, or key decision points for this grade level
2. Include 2-3 discussion topics for career exploration, goals, or grade-level milestones
3. Each item should have specific context from the student's data
4. Keep descriptions brief but personalized
5. Output ONLY the HTML agenda, no additional commentary or markdown formatting
6. Use <b> tags for bold text, <ul> and <li> for lists, <br> for line breaks, and <div> for paragraphs`;
}

/**
 * Generate a text-based interaction agenda using Gemini API
 */
export async function generateTextAgenda(
  studentData: StudentData,
  interactionDate?: string
): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('Gemini API key not configured, using fallback text agenda');
    return generateFallbackTextAgenda(studentData, interactionDate);
  }

  const prompt = buildTextAgendaPrompt(studentData, interactionDate);

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      return generateFallbackTextAgenda(studentData, interactionDate);
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      console.error('No response text from Gemini');
      return generateFallbackTextAgenda(studentData, interactionDate);
    }

    return responseText.trim();
  } catch (error) {
    console.error('Failed to call Gemini API:', error);
    return generateFallbackTextAgenda(studentData, interactionDate);
  }
}

/**
 * Generate a fallback HTML agenda when AI is unavailable
 */
export function generateFallbackTextAgenda(
  studentData: StudentData,
  interactionDate?: string
): string {
  const { student, milestones, smartGoals, bookmarks, interactions } = studentData;
  const now = new Date();

  const formattedDate = interactionDate
    ? new Date(interactionDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : 'Upcoming';

  const priorityItems: string[] = [];
  const discussionItems: string[] = [];

  // Add urgent milestones
  const urgentMilestones = milestones
    .filter(m => m.status === 'not_done' && m.dueDate)
    .filter(m => {
      const dueDate = new Date(m.dueDate!);
      const daysUntil = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntil <= 14 && daysUntil > 0;
    })
    .slice(0, 2);

  if (urgentMilestones.length > 0) {
    urgentMilestones.forEach(m => {
      const dueDate = new Date(m.dueDate!);
      const daysUntil = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      priorityItems.push(`<li><b>${m.title}</b><br>Due in ${daysUntil} days. Currently ${m.progress}% complete.</li>`);
    });
  }

  // Add active goals if no urgent milestones
  if (urgentMilestones.length < 2) {
    const activeGoals = smartGoals
      .filter(g => g.status === 'active')
      .slice(0, 2 - urgentMilestones.length);

    activeGoals.forEach(g => {
      const completedCount = g.subtasks.filter(s => s.completed).length;
      priorityItems.push(`<li><b>${g.title}</b><br>${completedCount}/${g.subtasks.length} subtasks completed.</li>`);
    });
  }

  if (priorityItems.length === 0) {
    priorityItems.push('<li><b>Review current progress</b><br>Check in on overall academic and career planning progress.</li>');
  }

  // Add grade-level topic
  const gradeTopic = getGradeTopicForText(student.grade);
  if (gradeTopic) {
    discussionItems.push(`<li><b>${gradeTopic.topic}</b><br>${gradeTopic.description}</li>`);
  }

  // Add career exploration if they have bookmarks
  const topPicks = bookmarks.filter(b => b.isTopPick).slice(0, 2);
  if (topPicks.length > 0) {
    discussionItems.push(`<li><b>Career Exploration</b><br>Discuss interest in ${topPicks.map(b => b.title).join(', ')}.</li>`);
  }

  // Add follow-up from previous interaction
  const completedWithDates = interactions.filter(m => m.status === 'completed' && m.interactionDate);
  const lastInteraction = completedWithDates.length > 0
    ? completedWithDates.sort((a, b) => new Date(b.interactionDate!).getTime() - new Date(a.interactionDate!).getTime())[0]
    : null;

  if (lastInteraction?.aiSummary?.recommendedActions?.some(a => a.status === 'pending') && lastInteraction.interactionDate) {
    discussionItems.push(`<li><b>Follow Up from Previous Interaction</b><br>Review pending action items from ${new Date(lastInteraction.interactionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}.</li>`);
  }

  if (discussionItems.length === 0) {
    discussionItems.push('<li><b>General Check-in</b><br>Review overall progress and upcoming goals.</li>');
  }

  return `<div><b>Meeting with ${student.firstName} ${student.lastName}</b></div>
<div>Grade ${student.grade} | ${formattedDate}</div>
<br>
<div><b>PRIORITY ITEMS</b></div>
<ul>${priorityItems.join('')}</ul>
<br>
<div><b>DISCUSSION TOPICS</b></div>
<ul>${discussionItems.join('')}</ul>
<br>
<div><b>NOTES</b></div>
<div></div>`;
}

function getGradeTopicForText(grade: number): { topic: string; description: string } | null {
  switch (grade) {
    case 12:
      return { topic: 'College Application Status', description: 'Review submitted applications and financial aid progress.' };
    case 11:
      return { topic: 'College Planning', description: 'Discuss college list development and testing plans.' };
    case 10:
      return { topic: 'Career Exploration', description: 'Review career interests and extracurricular involvement.' };
    case 9:
      return { topic: 'High School Transition', description: 'Check in on adjustment and course planning.' };
    default:
      return null;
  }
}

/**
 * Export the grade level guidance for use in other components
 */
export { GRADE_LEVEL_GUIDANCE };

// =============================================================================
// Audio Processing with Gemini Multimodal
// =============================================================================

/**
 * Types for audio processing results
 */
export interface AudioProcessingResult {
  transcript: string;
  summary: string;
  actionItems: ExtractedActionItem[];
}

export interface ExtractedActionItem {
  id: string;
  text: string;
  assignee: 'student' | 'counselor';
  status: 'pending' | 'added' | 'dismissed';
}

/**
 * Convert audio blob to base64 for Gemini API
 */
async function audioToBase64(audioBlob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(audioBlob);
  });
}

/**
 * Process audio recording with Gemini 2.0 Flash multimodal
 * Transcribes the audio, generates a summary, and extracts action items
 */
export async function processAudioWithGemini(
  audioBlob: Blob
): Promise<AudioProcessingResult> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Gemini API key not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to your .env.local file.');
  }

  const audioBase64 = await audioToBase64(audioBlob);
  const mimeType = audioBlob.type || 'audio/webm';

  const prompt = `You are an expert at analyzing counselor-student meeting recordings.
Please analyze this audio recording and provide:

1. **TRANSCRIPT**: A detailed transcript of the conversation, formatted as:
   Counselor: [text]
   Student: [text]
   (alternating based on speakers - use your best judgment to identify who is speaking)

2. **SUMMARY**: A concise 2-3 paragraph summary of the meeting covering:
   - Main topics discussed
   - Key decisions made
   - Student's current situation/concerns
   - Next steps identified

3. **ACTION ITEMS**: Extract specific, actionable tasks from the conversation. Categorize each as either:
   - "counselor": Tasks for the counselor to complete (e.g., send resources, schedule meetings, follow up)
   - "student": Tasks for the student to complete (e.g., submit applications, create accounts, gather documents)

Be specific with action items - they should be clear, actionable tasks that came up during the conversation.

Format your response as JSON:
{
  "transcript": "Counselor: ... \\n\\nStudent: ...",
  "summary": "The meeting covered...",
  "actionItems": [
    { "text": "Send scholarship list to student", "assignee": "counselor" },
    { "text": "Create FSA ID at studentaid.gov", "assignee": "student" }
  ]
}

Return ONLY the JSON, no additional text or markdown formatting.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              inline_data: {
                mime_type: mimeType,
                data: audioBase64,
              }
            },
            {
              text: prompt
            }
          ]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      throw new Error('No response from Gemini');
    }

    return parseAudioProcessingResponse(responseText);
  } catch (error) {
    console.error('Failed to process audio with Gemini:', error);
    throw error;
  }
}

/**
 * Parse Gemini audio processing response into structured data
 */
function parseAudioProcessingResponse(responseText: string): AudioProcessingResult {
  try {
    // Extract JSON from response (handle markdown code blocks)
    let jsonStr = responseText;
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    const parsed = JSON.parse(jsonStr);

    return {
      transcript: parsed.transcript || '',
      summary: parsed.summary || '',
      actionItems: (parsed.actionItems || []).map((item: { text: string; assignee: string }, index: number) => ({
        id: `action-${Date.now()}-${index}`,
        text: item.text,
        assignee: item.assignee === 'student' ? 'student' : 'counselor',
        status: 'pending' as const,
      })),
    };
  } catch (error) {
    console.error('Failed to parse Gemini audio response:', error, responseText);
    // Return a basic result with the raw text as transcript
    return {
      transcript: responseText,
      summary: 'Unable to generate summary from recording.',
      actionItems: [],
    };
  }
}

// =============================================================================
// Custom Talking Points Generation
// =============================================================================

/**
 * Build the prompt for custom talking points generation
 */
function buildCustomTalkingPointsPrompt(userPrompt: string, studentData: StudentData): string {
  const { student, profile, milestones, smartGoals, bookmarks } = studentData;

  // Build student context section
  const incompleteMilestones = milestones
    .filter(m => m.status !== 'done')
    .slice(0, 5)
    .map(m => `- ${m.title} (${m.progress}% complete${m.dueDate ? `, due ${m.dueDate}` : ''})`)
    .join('\n');

  const activeGoals = smartGoals
    .filter(g => g.status === 'active')
    .slice(0, 3)
    .map(g => {
      const completed = g.subtasks.filter(s => s.completed).length;
      return `- ${g.title} (${completed}/${g.subtasks.length} subtasks done)`;
    })
    .join('\n');

  const topBookmarks = bookmarks
    .filter(b => b.isTopPick)
    .slice(0, 5)
    .map(b => `- ${b.title} (${b.type})`)
    .join('\n');

  return `You are an expert high school counselor assistant. Generate personalized meeting talking points based on the counselor's request and the student's data.

## Counselor's Request
${userPrompt}

## Student Profile
- Name: ${student.firstName} ${student.lastName}
- Grade: ${student.grade}
- GPA: ${student.gpa || 'Not available'}
- On-Track Status: ${student.onTrackStatus === 'on_track' ? 'On Track' : 'Needs Attention'}
${profile.careerVision ? `- Career Vision: ${profile.careerVision}` : ''}

## Current Milestones
${incompleteMilestones || 'No pending milestones'}

## Active Goals
${activeGoals || 'No active goals'}

## Top Career/School Picks
${topBookmarks || 'No bookmarks yet'}

${GRADE_LEVEL_GUIDANCE}

## Instructions
Generate talking points that directly address the counselor's request while incorporating relevant student data. The talking points should be:
1. Specific and actionable
2. Personalized to this student's situation
3. Appropriate for their grade level
4. Organized into clear sections

Format as HTML compatible with a rich text editor:
<h3>Section Title</h3>
<ul>
<li><strong>Topic</strong> - Brief description or question to discuss</li>
</ul>

Return ONLY the HTML, no additional commentary or markdown formatting.`;
}

/**
 * Generate custom talking points using Gemini API based on user prompt and student data
 */
export async function generateCustomTalkingPoints(
  userPrompt: string,
  studentData: StudentData
): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('Gemini API key not configured, using fallback talking points');
    return generateFallbackCustomTalkingPoints(userPrompt, studentData);
  }

  const prompt = buildCustomTalkingPointsPrompt(userPrompt, studentData);

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      return generateFallbackCustomTalkingPoints(userPrompt, studentData);
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      console.error('No response text from Gemini');
      return generateFallbackCustomTalkingPoints(userPrompt, studentData);
    }

    // Clean up any markdown code blocks if present
    let cleanedResponse = responseText.trim();
    const htmlMatch = cleanedResponse.match(/```(?:html)?\s*([\s\S]*?)```/);
    if (htmlMatch) {
      cleanedResponse = htmlMatch[1].trim();
    }

    return cleanedResponse;
  } catch (error) {
    console.error('Failed to call Gemini API:', error);
    return generateFallbackCustomTalkingPoints(userPrompt, studentData);
  }
}

/**
 * Generate fallback talking points when AI is unavailable
 */
function generateFallbackCustomTalkingPoints(
  userPrompt: string,
  studentData: StudentData
): string {
  const { student } = studentData;

  return `<h3>Custom Meeting Topics</h3>
<p><em>Based on your request: "${userPrompt}"</em></p>
<ul>
<li><strong>Discussion Point 1</strong> - Review with ${student.firstName}</li>
<li><strong>Discussion Point 2</strong> - Follow up on recent progress</li>
<li><strong>Discussion Point 3</strong> - Plan next steps</li>
</ul>
<h3>Notes</h3>
<p></p>`;
}
