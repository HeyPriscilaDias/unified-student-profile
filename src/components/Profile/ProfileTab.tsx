'use client';

import { Box } from '@mui/material';
import { IdDetailsSection } from './IdDetailsSection';
import { StrengthsLanguagesSection } from './StrengthsLanguagesSection';
import { ExperienceSection } from './ExperienceSection';
import { DurableSkillsSection } from './DurableSkillsSection';
import { PersonalityTypeSection } from './PersonalityTypeSection';
import type { Student, StudentProfile } from '@/types/student';

interface ProfileTabProps {
  student: Student;
  profile: StudentProfile;
}

export function ProfileTab({ student, profile }: ProfileTabProps) {
  return (
    <Box sx={{ py: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Personality Type */}
      <PersonalityTypeSection
        personalityType={profile.personalityType}
        onViewDetails={() => console.log('View personality details clicked')}
      />

      {/* Durable Skills */}
      <DurableSkillsSection durableSkills={profile.durableSkills} />

      {/* Work, Leadership & Volunteer Experience */}
      <ExperienceSection experiences={profile.experiences} />

      {/* Interests, Strengths & Languages */}
      <StrengthsLanguagesSection
        interests={profile.interests}
        strengths={profile.strengths}
        languages={profile.languages}
      />

      {/* Contact */}
      <IdDetailsSection location={student.location} email={student.email} />
    </Box>
  );
}

export default ProfileTab;
