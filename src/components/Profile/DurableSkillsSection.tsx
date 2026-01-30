'use client';

import { Box, Typography } from '@mui/material';
import { Brain, Users, Shield, Lightbulb, MessageCircle, Target } from 'lucide-react';
import type { DurableSkillsResult, DurableSkill } from '@/types/student';

interface DurableSkillsSectionProps {
  durableSkills: DurableSkillsResult;
  onViewDetails?: () => void;
}

// Hexagon SVG component
function HexagonIcon({ children, color = '#1E3A5F' }: { children: React.ReactNode; color?: string }) {
  return (
    <Box
      sx={{
        position: 'relative',
        width: 64,
        height: 72,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        width="64"
        height="72"
        viewBox="0 0 64 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute' }}
      >
        <path
          d="M32 0L61.5 17.5V54.5L32 72L2.5 54.5V17.5L32 0Z"
          fill={color}
        />
      </svg>
      <Box sx={{ position: 'relative', zIndex: 1, color: 'white', display: 'flex' }}>
        {children}
      </Box>
    </Box>
  );
}

// Get icon for skill
function getSkillIcon(iconType?: string) {
  const iconProps = { size: 28, strokeWidth: 2, color: 'white' };
  switch (iconType) {
    case 'metacognition':
      return <Brain {...iconProps} />;
    case 'collaboration':
      return <Users {...iconProps} />;
    case 'character':
      return <Shield {...iconProps} />;
    case 'creativity':
      return <Lightbulb {...iconProps} />;
    case 'communication':
      return <MessageCircle {...iconProps} />;
    case 'critical-thinking':
      return <Target {...iconProps} />;
    default:
      return <Brain {...iconProps} />;
  }
}

// Skill card component
function SkillCard({ skill }: { skill: DurableSkill }) {
  const isExceeding = skill.status === 'Exceeding';
  const statusColor = isExceeding ? '#111827' : '#3B82F6';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px 16px',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        backgroundColor: 'white',
        gap: 2,
      }}
    >
      <HexagonIcon color="#1E3A5F">
        {getSkillIcon(skill.icon)}
      </HexagonIcon>
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: '16px',
          color: '#111827',
          textAlign: 'center',
        }}
      >
        {skill.name}
      </Typography>
      <Typography
        sx={{
          fontSize: '14px',
          color: statusColor,
        }}
      >
        Level {skill.level} • {skill.status}
      </Typography>
    </Box>
  );
}

export function DurableSkillsSection({ durableSkills, onViewDetails }: DurableSkillsSectionProps) {
  const hasSkills = durableSkills.topSkills && durableSkills.topSkills.length > 0;

  if (!durableSkills.summary && !hasSkills) {
    return (
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #E5E7EB',
          padding: '24px',
        }}
      >
        <Typography
          component="h3"
          sx={{
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 600,
            fontSize: '22px',
            color: '#111827',
          }}
        >
          Durable Skills Assessment
        </Typography>
        <Typography sx={{ fontSize: '14px', color: '#9CA3AF', mt: 1 }}>
          No durable skills assessment completed yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #E5E7EB',
        padding: '24px',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography
          component="h3"
          sx={{
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 600,
            fontSize: '22px',
            color: '#111827',
          }}
        >
          Durable Skills Assessment
        </Typography>
        {onViewDetails && (
          <Typography
            onClick={onViewDetails}
            sx={{
              fontSize: '14px',
              color: '#111827',
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            View details
          </Typography>
        )}
      </Box>

      {/* At a Glance */}
      {durableSkills.summary && (
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: '16px',
              color: '#111827',
              mb: 1.5,
            }}
          >
            At a Glance
          </Typography>
          <Typography
            sx={{
              fontSize: '14px',
              color: '#4B5563',
              lineHeight: 1.6,
            }}
          >
            {durableSkills.summary}
          </Typography>
        </Box>
      )}

      {/* Top 4 Skills */}
      {hasSkills && (
        <Box>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: '16px',
              color: '#111827',
              mb: 2,
            }}
          >
            Top 4 Skills
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: '1fr 1fr',
                md: 'repeat(4, 1fr)',
              },
              gap: 2,
            }}
          >
            {[...durableSkills.topSkills]
              .sort((a, b) => b.level - a.level)
              .slice(0, 4)
              .map((skill, index) => (
                <SkillCard key={index} skill={skill} />
              ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default DurableSkillsSection;
