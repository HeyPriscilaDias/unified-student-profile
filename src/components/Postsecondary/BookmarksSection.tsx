'use client';

import { useState } from 'react';
import { Box, Typography, Chip, Tabs, Tab } from '@mui/material';
import { Bookmark, Star } from 'lucide-react';
import type { Bookmark as BookmarkType } from '@/types/student';

interface BookmarksSectionProps {
  bookmarks: BookmarkType[];
  onBookmarkToggle?: (bookmark: BookmarkType) => void;
}

function formatSalary(salary?: number): string {
  if (!salary) return 'Unknown';
  return `$${salary.toLocaleString()}`;
}

// Top pick badge component
function TopPickBadge() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        backgroundColor: '#F0FFAC',
        borderRadius: 1,
        px: 1,
        py: 0.5,
        width: 'fit-content',
      }}
    >
      <Star size={14} fill="#D4B300" color="#D4B300" />
      <Typography sx={{ fontWeight: 600, fontSize: '12px', color: '#111827' }}>
        Top pick for you
      </Typography>
    </Box>
  );
}

function CareerRow({
  bookmark,
  isFirst,
}: {
  bookmark: BookmarkType;
  isFirst: boolean;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        borderTop: isFirst ? 'none' : '1px solid #E5E7EB',
        backgroundColor: 'white',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
        {/* Bookmark Icon */}
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: '#D1FAE5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Bookmark size={20} color="#111827" />
        </Box>

        {/* Career Info */}
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: '18px',
              color: '#111827',
              mb: 0.5,
            }}
          >
            {bookmark.title}
          </Typography>

          {/* Top pick indicator */}
          {bookmark.isTopPick && (
            <Box sx={{ mb: 1 }}>
              <TopPickBadge />
            </Box>
          )}

          {/* Tags */}
          {bookmark.tags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {bookmark.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: '12px',
                    height: '24px',
                    borderColor: '#D1D5DB',
                    color: '#4B5563',
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* Salary and Education */}
      <Box sx={{ display: 'flex', gap: 4, minWidth: '240px' }}>
        <Box sx={{ textAlign: 'center', flex: 1 }}>
          <Typography sx={{ fontWeight: 600, fontSize: '16px', color: '#111827' }}>
            {formatSalary(bookmark.medianSalary)}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center', flex: 1 }}>
          <Typography sx={{ fontWeight: 600, fontSize: '16px', color: '#111827' }}>
            {bookmark.educationYears || 'Unknown'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

function SchoolRow({
  bookmark,
  isFirst,
}: {
  bookmark: BookmarkType;
  isFirst: boolean;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 2,
        borderTop: isFirst ? 'none' : '1px solid #E5E7EB',
        backgroundColor: 'white',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
        {/* Bookmark Icon */}
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: '#D1FAE5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Bookmark size={20} color="#111827" />
        </Box>

        {/* School Info */}
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: '18px',
              color: '#111827',
              mb: 0.5,
            }}
          >
            {bookmark.title}
          </Typography>

          {/* Top pick indicator */}
          {bookmark.isTopPick && (
            <Box sx={{ mb: 1 }}>
              <TopPickBadge />
            </Box>
          )}

          {/* Tags */}
          {bookmark.tags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {bookmark.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: '12px',
                    height: '24px',
                    borderColor: '#D1D5DB',
                    color: '#4B5563',
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

function ProgramRow({
  bookmark,
  isFirst,
}: {
  bookmark: BookmarkType;
  isFirst: boolean;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        borderTop: isFirst ? 'none' : '1px solid #E5E7EB',
        backgroundColor: 'white',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
        {/* Bookmark Icon */}
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: '#D1FAE5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Bookmark size={20} color="#111827" />
        </Box>

        {/* Program Info */}
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: '18px',
              color: '#111827',
              mb: 0.5,
            }}
          >
            {bookmark.title}
          </Typography>

          {/* Top pick indicator */}
          {bookmark.isTopPick && (
            <Box sx={{ mb: 1 }}>
              <TopPickBadge />
            </Box>
          )}

          {/* Tags */}
          {bookmark.tags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {bookmark.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: '12px',
                    height: '24px',
                    borderColor: '#D1D5DB',
                    color: '#4B5563',
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* Duration */}
      <Box sx={{ minWidth: '120px', textAlign: 'center' }}>
        <Typography sx={{ fontWeight: 600, fontSize: '16px', color: '#111827' }}>
          {bookmark.educationYears || 'Unknown'}
        </Typography>
      </Box>
    </Box>
  );
}

export function BookmarksSection({ bookmarks }: BookmarksSectionProps) {
  const [activeTab, setActiveTab] = useState(0);

  const careerBookmarks = bookmarks.filter((b) => b.type === 'career');
  const schoolBookmarks = bookmarks.filter((b) => b.type === 'school');
  const programBookmarks = bookmarks.filter((b) => b.type === 'program');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const renderEmptyState = (message: string) => (
    <Box
      sx={{
        border: '2px dashed #E5E7EB',
        borderRadius: 2,
        p: 3,
        textAlign: 'center',
      }}
    >
      <Typography sx={{ fontSize: '14px', color: '#6B7280' }}>
        {message}
      </Typography>
    </Box>
  );

  return (
    <Box>
      {/* Title */}
      <Typography
        component="h3"
        sx={{
          fontFamily: '"Poppins", sans-serif',
          fontWeight: 600,
          fontSize: '22px',
          color: '#111827',
          mb: 3,
        }}
      >
        Bookmarks
      </Typography>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{
          mb: 3,
          '& .MuiTabs-indicator': {
            backgroundColor: '#111827',
          },
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '16px',
            color: '#6B7280',
            '&.Mui-selected': {
              color: '#111827',
              fontWeight: 600,
            },
          },
        }}
      >
        <Tab label="Careers" />
        <Tab label="Schools" />
        <Tab label="Professional Programs" />
      </Tabs>

      {/* Careers Tab */}
      {activeTab === 0 && (
        <>
          {careerBookmarks.length > 0 ? (
            <Box>
              {/* Column Headers */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 2,
                  py: 1,
                }}
              >
                <Box sx={{ flex: 1 }} />
                <Box sx={{ display: 'flex', gap: 4, minWidth: '240px' }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: '12px',
                      color: '#6B7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      textAlign: 'center',
                      flex: 1,
                    }}
                  >
                    Median Salary
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: '12px',
                      color: '#6B7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      textAlign: 'center',
                      flex: 1,
                    }}
                  >
                    Education
                  </Typography>
                </Box>
              </Box>

              {/* Career Rows */}
              {careerBookmarks.map((bookmark, index) => (
                <CareerRow
                  key={bookmark.id}
                  bookmark={bookmark}
                  isFirst={index === 0}
                />
              ))}
            </Box>
          ) : (
            renderEmptyState('No bookmarked careers yet')
          )}
        </>
      )}

      {/* Schools Tab */}
      {activeTab === 1 && (
        <>
          {schoolBookmarks.length > 0 ? (
            <Box>
              {schoolBookmarks.map((bookmark, index) => (
                <SchoolRow
                  key={bookmark.id}
                  bookmark={bookmark}
                  isFirst={index === 0}
                />
              ))}
            </Box>
          ) : (
            renderEmptyState('No bookmarked schools yet')
          )}
        </>
      )}

      {/* Programs Tab */}
      {activeTab === 2 && (
        <>
          {programBookmarks.length > 0 ? (
            <Box>
              {/* Column Header */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 2,
                  py: 1,
                }}
              >
                <Box sx={{ flex: 1 }} />
                <Box sx={{ minWidth: '120px', textAlign: 'center' }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: '12px',
                      color: '#6B7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Duration
                  </Typography>
                </Box>
              </Box>

              {/* Program Rows */}
              {programBookmarks.map((bookmark, index) => (
                <ProgramRow
                  key={bookmark.id}
                  bookmark={bookmark}
                  isFirst={index === 0}
                />
              ))}
            </Box>
          ) : (
            renderEmptyState('No bookmarked programs yet')
          )}
        </>
      )}
    </Box>
  );
}

export default BookmarksSection;
