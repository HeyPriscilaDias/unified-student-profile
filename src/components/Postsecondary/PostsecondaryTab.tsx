'use client';

import { Box } from '@mui/material';
import { ApplicationsSection } from './ApplicationsSection';
import { BookmarksSection } from './BookmarksSection';
import { RecommendationsSection } from './RecommendationsSection';
import type { Bookmark, Recommendation } from '@/types/student';

interface PostsecondaryTabProps {
  bookmarks: Bookmark[];
  recommendations: Recommendation[];
}

export function PostsecondaryTab({
  bookmarks,
  recommendations,
}: PostsecondaryTabProps) {
  const handleBookmarkToggle = (bookmark: Bookmark) => {
    console.log('Bookmark toggled:', bookmark.title);
  };

  const handleRecommendationBookmark = (rec: Recommendation) => {
    console.log('Recommendation bookmark toggled:', rec.title);
  };

  return (
    <Box>
      <Box sx={{ py: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Applications */}
        <ApplicationsSection />

        {/* Bookmarks */}
        <BookmarksSection
          bookmarks={bookmarks}
          onBookmarkToggle={handleBookmarkToggle}
        />

        {/* Recommendations */}
        <RecommendationsSection
          recommendations={recommendations}
          onBookmarkToggle={handleRecommendationBookmark}
        />
      </Box>
    </Box>
  );
}

export default PostsecondaryTab;
