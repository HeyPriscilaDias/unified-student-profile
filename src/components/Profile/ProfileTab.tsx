'use client';

import { Box } from '@mui/material';
import { IdDetailsSection } from './IdDetailsSection';
import { AcademicAchievementsSection } from './AcademicAchievementsSection';
import { StrengthsLanguagesSection } from './StrengthsLanguagesSection';
import { ExperienceSection } from './ExperienceSection';
import { DurableSkillsSection } from './DurableSkillsSection';
import { PersonalityTypeSection } from './PersonalityTypeSection';
import { ValuesSection } from './ValuesSection';
import { MissionSection } from './MissionSection';
import { CareerVisionSection } from './CareerVisionSection';
import type { Student, StudentProfile } from '@/types/student';

interface ProfileTabProps {
  student: Student;
  profile: StudentProfile;
}

export function ProfileTab({ student, profile }: ProfileTabProps) {
  return (
    <Box sx={{ py: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* ID Details */}
      <IdDetailsSection location={student.location} email={student.email} />

      {/* Academic Achievements */}
      <AcademicAchievementsSection
        achievements={profile.academicAchievements}
        awards={profile.awards}
        microCredentials={profile.microCredentials}
        courseHighlights={profile.courseHighlights}
      />

      {/* Strengths & Languages */}
      <StrengthsLanguagesSection
        strengths={profile.strengths}
        languages={profile.languages}
      />

      {/* Experience */}
      <ExperienceSection experiences={profile.experiences} />

      {/* Durable Skills */}
      <DurableSkillsSection durableSkills={profile.durableSkills} />

      {/* Personality Type */}
      <PersonalityTypeSection
        personalityType={profile.personalityType}
        onViewDetails={() => console.log('View personality details clicked')}
      />

      {/* Values, Mission, Career Vision */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr 1fr' }, gap: 2 }}>
        <ValuesSection values={profile.values} />
        <MissionSection mission={profile.mission} />
        <CareerVisionSection careerVision={profile.careerVision} />
      </Box>
    </Box>
  );
}

export default ProfileTab;
