'use client';

import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Typography,
  styled,
  Collapse,
  FormControl,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { getAllStudents } from '@/lib/mockData';
import {
  Home,
  BookOpen,
  Award,
  Briefcase,
  GraduationCap,
  DollarSign,
  Settings,
  Compass,
  List as ListIcon,
  FileText,
  Bell,
} from 'lucide-react';

// Inline color tokens (replacing @willow/ui-kit)
const essentials = { white: '#ffffff' };
const neutral: Record<number, string> = { 200: '#E5E7EB', 500: '#6B7280' };
const Slate: Record<number, string> = { 700: '#334155' };

interface SidebarProps {
  currentStudentId?: string;
}

// Styled components
const SidebarContainer = styled(Box)(() => ({
  width: '220px',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: essentials.white,
  overflowY: 'auto',
  borderRight: `1px solid ${neutral[200]}`,
  position: 'fixed',
  left: 0,
  top: 0,
  zIndex: 100,
}));

const LogoContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  padding: '16px 11px',
  marginLeft: '16px',
});

const NavList = styled(List)({
  flexGrow: 0,
  display: 'flex',
  flexDirection: 'column',
  padding: '0',
  width: '100%',
});

const NavItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ active }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '8px 16px',
  borderRadius: '24px',
  backgroundColor: active ? neutral[200] : 'transparent',
  margin: '6px 8px',
  width: 'calc(100% - 16px)',
  '&:hover': {
    backgroundColor: active ? neutral[200] : 'rgba(0, 0, 0, 0.04)',
  },
}));

const NavItemIcon = styled(ListItemIcon, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ active }) => ({
  color: active ? Slate[700] : neutral[500],
  minWidth: '24px',
  marginRight: '12px',
  justifyContent: 'center',
}));

const SubNavItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ active }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '6px 16px 6px 44px',
  borderRadius: '24px',
  backgroundColor: active ? neutral[200] : 'transparent',
  margin: '2px 8px',
  width: 'calc(100% - 16px)',
  '&:hover': {
    backgroundColor: active ? neutral[200] : 'rgba(0, 0, 0, 0.04)',
  },
}));

const SubNavItemIcon = styled(ListItemIcon, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ active }) => ({
  color: active ? Slate[700] : neutral[500],
  minWidth: '20px',
  marginRight: '8px',
  justifyContent: 'center',
}));

const TestingSection = styled(Box)({
  marginTop: 'auto',
  borderTop: `1px solid ${neutral[200]}`,
  padding: '12px',
});

const TestingSectionHeader = styled(Typography)({
  fontSize: '10px',
  color: neutral[500],
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: '8px',
  paddingLeft: '4px',
});

// Navigation items
const navItems = [
  {
    id: 'home',
    label: 'Home',
    Icon: Home,
    submenu: undefined,
  },
  {
    id: 'curriculum',
    label: 'Lessons',
    Icon: BookOpen,
    submenu: undefined,
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    Icon: Award,
    submenu: undefined,
  },
  {
    id: 'feed',
    label: 'Feed',
    Icon: Bell,
    submenu: undefined,
  },
  {
    id: 'careers',
    label: 'Careers',
    Icon: Briefcase,
    submenu: undefined,
  },
  {
    id: 'schools',
    label: 'Schools',
    Icon: GraduationCap,
    submenu: [
      {
        id: 'explore-schools',
        label: 'Explore Schools',
        Icon: Compass,
      },
      {
        id: 'my-list',
        label: 'My List',
        Icon: ListIcon,
      },
      {
        id: 'applications',
        label: 'Applications',
        Icon: FileText,
      },
      {
        id: 'recommendations',
        label: 'Recommendations',
        Icon: Award,
      },
    ],
  },
  {
    id: 'finances',
    label: 'Finances',
    Icon: DollarSign,
    submenu: undefined,
  },
  {
    id: 'preferences',
    label: 'Preferences',
    Icon: Settings,
    submenu: undefined,
  },
];

function WillowLogo() {
  return (
    <svg
      width="105"
      height="29"
      viewBox="0 0 116 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M52.7341 4.02488L49.5825 14.6578H47.6089L45.3752 6.61044L43.0038 14.6578L41.0455 14.6731L38.0316 4.02488H39.8828L42.0859 12.6842L44.4725 4.02488H46.4308L48.6492 12.6383L50.8676 4.02488H52.7341Z"
        fill="#062F29"
      />
      <path
        d="M55.2129 5.11112C54.8967 5.11112 54.6315 5.00403 54.4173 4.78984C54.2032 4.57565 54.0961 4.31046 54.0961 3.99428C54.0961 3.6781 54.2032 3.41291 54.4173 3.19872C54.6315 2.98454 54.8967 2.87744 55.2129 2.87744C55.5189 2.87744 55.779 2.98454 55.9932 3.19872C56.2074 3.41291 56.3144 3.6781 56.3144 3.99428C56.3144 4.31046 56.2074 4.57565 55.9932 4.78984C55.779 5.00403 55.5189 5.11112 55.2129 5.11112ZM56.0697 6.22796V14.6578H54.3256V6.22796H56.0697Z"
        fill="#062F29"
      />
      <path
        d="M60.2566 3.33642V14.6578H58.5125V3.33642H60.2566Z"
        fill="#062F29"
      />
      <path
        d="M64.4436 3.33642V14.6578H62.6995V3.33642H64.4436Z"
        fill="#062F29"
      />
      <path
        d="M70.5429 14.7955C69.7473 14.7955 69.0283 14.617 68.3857 14.26C67.7432 13.8928 67.2383 13.3829 66.8711 12.7301C66.5039 12.0671 66.3203 11.3022 66.3203 10.4352C66.3203 9.57847 66.509 8.81862 66.8864 8.15565C67.2638 7.49269 67.7789 6.98272 68.4316 6.62574C69.0844 6.26876 69.8136 6.09027 70.6194 6.09027C71.4252 6.09027 72.1544 6.26876 72.8072 6.62574C73.4599 6.98272 73.975 7.49269 74.3524 8.15565C74.7298 8.81862 74.9185 9.57847 74.9185 10.4352C74.9185 11.292 74.7247 12.0518 74.3371 12.7148C73.9495 13.3778 73.4191 13.8928 72.746 14.26C72.083 14.617 71.3487 14.7955 70.5429 14.7955ZM70.5429 13.2809C70.9917 13.2809 71.4099 13.1738 71.7974 12.9596C72.1952 12.7454 72.5165 12.4241 72.7613 11.9957C73.0061 11.5674 73.1285 11.0472 73.1285 10.4352C73.1285 9.82326 73.0112 9.30819 72.7766 8.89001C72.542 8.46164 72.2309 8.14035 71.8433 7.92616C71.4558 7.71198 71.0376 7.60488 70.5888 7.60488C70.14 7.60488 69.7218 7.71198 69.3343 7.92616C68.9569 8.14035 68.656 8.46164 68.4316 8.89001C68.2072 9.30819 68.095 9.82326 68.095 10.4352C68.095 11.343 68.3245 12.0467 68.7835 12.5465C69.2527 13.0361 69.8391 13.2809 70.5429 13.2809Z"
        fill="#062F29"
      />
      <path
        d="M88.117 6.22796L85.5008 14.6578H83.6649L81.9667 8.43104L80.2685 14.6578H78.4326L75.8012 6.22796H77.5759L79.3353 13.0055L81.1253 6.22796H82.9459L84.6594 12.9749L86.4035 6.22796H88.117Z"
        fill="#062F29"
      />
      <path
        d="M41.0351 21.1342V24.2552H44.7069V25.6781H41.0351V28.9368H45.1658V30.3596H39.291V19.7114H45.1658V21.1342H41.0351Z"
        fill="#062F29"
      />
      <path
        d="M46.8857 26.1064C46.8857 25.2599 47.0591 24.5102 47.4058 23.8575C47.7628 23.2047 48.2422 22.6998 48.844 22.3428C49.4559 21.9757 50.1342 21.7921 50.8787 21.7921C51.4295 21.7921 51.9701 21.9145 52.5005 22.1593C53.041 22.3938 53.4694 22.71 53.7856 23.1078V19.0382H55.545V30.3596H53.7856V29.0898C53.5 29.4978 53.1022 29.8343 52.5923 30.0995C52.0925 30.3647 51.5162 30.4973 50.8635 30.4973C50.1291 30.4973 49.4559 30.3137 48.844 29.9465C48.2422 29.5691 47.7628 29.049 47.4058 28.386C47.0591 27.7129 46.8857 26.953 46.8857 26.1064ZM53.7856 26.137C53.7856 25.5557 53.6632 25.0508 53.4184 24.6224C53.1838 24.194 52.8727 23.8677 52.4852 23.6433C52.0976 23.4189 51.6794 23.3067 51.2306 23.3067C50.7819 23.3067 50.3637 23.4189 49.9761 23.6433C49.5885 23.8575 49.2723 24.1787 49.0276 24.6071C48.793 25.0253 48.6757 25.5251 48.6757 26.1064C48.6757 26.6878 48.793 27.1978 49.0276 27.6364C49.2723 28.0749 49.5885 28.4115 49.9761 28.6461C50.3739 28.8705 50.7288 28.9827 51.2306 28.9827C51.6794 28.9827 52.0976 28.8705 52.4852 28.6461C52.8727 28.4217 53.1838 28.0953 53.4184 27.667C53.6632 27.2284 53.7856 26.7184 53.7856 26.137Z"
        fill="#062F29"
      />
      <path
        d="M65.6231 21.9298V30.3596H63.879V29.3652C63.6036 29.7119 63.2415 29.9873 62.7927 30.1913C62.3542 30.3851 61.885 30.482 61.3852 30.482C60.7222 30.482 60.1256 30.3443 59.5952 30.0689C59.075 29.7935 58.662 29.3856 58.356 28.845C58.0602 28.3044 57.9123 27.6517 57.9123 26.8867V21.9298H59.6411V26.6266C59.6411 27.3814 59.8298 27.9627 60.2072 28.3707C60.5846 28.7685 61.0996 28.9674 61.7524 28.9674C62.4052 28.9674 62.9202 28.7685 63.2976 28.3707C63.6852 27.9627 63.879 27.3814 63.879 26.6266V21.9298H65.6231Z"
        fill="#062F29"
      />
      <path
        d="M67.4959 26.137C67.4959 25.2701 67.6693 24.5102 68.0161 23.8575C68.3731 23.1945 68.8626 22.6845 69.4848 22.3275C70.107 21.9706 70.8209 21.7921 71.6267 21.7921C72.6466 21.7921 73.4881 22.0369 74.151 22.5264C74.8242 23.0058 75.2781 23.6943 75.5127 24.5918H73.6309C73.4779 24.1736 73.2331 23.8473 72.8965 23.6127C72.5599 23.3781 72.1367 23.2608 71.6267 23.2608C70.9127 23.2608 70.3416 23.5158 69.9132 24.0258C69.495 24.5255 69.2859 25.2293 69.2859 26.137C69.2859 27.0448 69.495 27.7536 69.9132 28.2636C70.3416 28.7736 70.9127 29.0286 71.6267 29.0286C72.6364 29.0286 73.3045 28.5849 73.6309 27.6976H75.5127C75.2679 28.5543 74.8089 29.2377 74.1357 29.7476C73.4626 30.2474 72.6262 30.4973 71.6267 30.4973C70.8209 30.4973 70.107 30.3188 69.4848 29.9618C68.8626 29.5946 68.3731 29.0847 68.0161 28.4319C67.6693 27.7689 67.4959 27.004 67.4959 26.137Z"
        fill="#062F29"
      />
      <path
        d="M76.8224 26.1064C76.8224 25.2599 76.9958 24.5102 77.3426 23.8575C77.6996 23.2047 78.1789 22.6998 78.7807 22.3428C79.3927 21.9757 80.0658 21.7921 80.8002 21.7921C81.4632 21.7921 82.0394 21.9247 82.529 22.1899C83.0288 22.4448 83.4266 22.7661 83.7223 23.1537V21.9298H85.4817V30.3596H83.7223V29.1051C83.4266 29.5029 83.0237 29.8343 82.5137 30.0995C82.0037 30.3647 81.4224 30.4973 80.7696 30.4973C80.0454 30.4973 79.3825 30.3137 78.7807 29.9465C78.1789 29.5691 77.6996 29.049 77.3426 28.386C76.9958 27.7129 76.8224 26.953 76.8224 26.1064ZM83.7223 26.137C83.7223 25.5557 83.6 25.0508 83.3552 24.6224C83.1206 24.194 82.8095 23.8677 82.4219 23.6433C82.0343 23.4189 81.6162 23.3067 81.1674 23.3067C80.7186 23.3067 80.3004 23.4189 79.9129 23.6433C79.5253 23.8575 79.2091 24.1787 78.9643 24.6071C78.7297 25.0253 78.6124 25.5251 78.6124 26.1064C78.6124 26.6878 78.7297 27.1978 78.9643 27.6364C79.2091 28.0749 79.5253 28.4115 79.9129 28.6461C80.3106 28.8705 80.7288 28.9827 81.1674 28.9827C81.6162 28.9827 82.0343 28.8705 82.4219 28.6461C82.8095 28.4217 83.1206 28.0953 83.3552 27.667C83.6 27.2284 83.7223 26.7184 83.7223 26.137Z"
        fill="#062F29"
      />
      <path
        d="M89.9603 23.3526V28.0188C89.9603 28.335 90.0317 28.5645 90.1745 28.7073C90.3275 28.8399 90.5825 28.9062 90.9395 28.9062H92.0104V30.3596H90.6335C89.8481 30.3596 89.2464 30.176 88.8282 29.8088C88.41 29.4417 88.2009 28.845 88.2009 28.0188V23.3526H87.2065V21.9298H88.2009V19.8338H89.9603V21.9298H92.0104V23.3526H89.9603Z"
        fill="#062F29"
      />
      <path
        d="M94.6583 20.8129C94.3421 20.8129 94.0769 20.7058 93.8627 20.4916C93.6485 20.2775 93.5414 20.0123 93.5414 19.6961C93.5414 19.3799 93.6485 19.1147 93.8627 18.9005C94.0769 18.6863 94.3421 18.5793 94.6583 18.5793C94.9642 18.5793 95.2243 18.6863 95.4385 18.9005C95.6527 19.1147 95.7598 19.3799 95.7598 19.6961C95.7598 20.0123 95.6527 20.2775 95.4385 20.4916C95.2243 20.7058 94.9642 20.8129 94.6583 20.8129ZM95.515 21.9298V30.3596H93.7709V21.9298H95.515Z"
        fill="#062F29"
      />
      <path
        d="M101.614 30.4973C100.819 30.4973 100.1 30.3188 99.4572 29.9618C98.8146 29.5946 98.3097 29.0847 97.9426 28.4319C97.5754 27.7689 97.3918 27.004 97.3918 26.137C97.3918 25.2803 97.5805 24.5204 97.9579 23.8575C98.3352 23.1945 98.8503 22.6845 99.5031 22.3275C100.156 21.9706 100.885 21.7921 101.691 21.7921C102.497 21.7921 103.226 21.9706 103.879 22.3275C104.531 22.6845 105.046 23.1945 105.424 23.8575C105.801 24.5204 105.99 25.2803 105.99 26.137C105.99 26.9938 105.796 27.7536 105.409 28.4166C105.021 29.0796 104.491 29.5946 103.817 29.9618C103.154 30.3188 102.42 30.4973 101.614 30.4973ZM101.614 28.9827C102.063 28.9827 102.481 28.8756 102.869 28.6614C103.267 28.4472 103.588 28.1259 103.833 27.6976C104.078 27.2692 104.2 26.749 104.2 26.137C104.2 25.5251 104.083 25.01 103.848 24.5918C103.613 24.1634 103.302 23.8422 102.915 23.628C102.527 23.4138 102.109 23.3067 101.66 23.3067C101.211 23.3067 100.793 23.4138 100.406 23.628C100.028 23.8422 99.7275 24.1634 99.5031 24.5918C99.2787 25.01 99.1665 25.5251 99.1665 26.137C99.1665 27.0448 99.396 27.7485 99.8549 28.2483C100.324 28.7379 100.911 28.9827 101.614 28.9827Z"
        fill="#062F29"
      />
      <path
        d="M112.12 21.7921C112.783 21.7921 113.375 21.9298 113.895 22.2052C114.425 22.4805 114.838 22.8885 115.134 23.4291C115.43 23.9697 115.578 24.6224 115.578 25.3874V30.3596H113.849V25.6475C113.849 24.8927 113.66 24.3164 113.283 23.9187C112.906 23.5107 112.391 23.3067 111.738 23.3067C111.085 23.3067 110.565 23.5107 110.177 23.9187C109.8 24.3164 109.611 24.8927 109.611 25.6475V30.3596H107.867V21.9298H109.611V22.8936C109.897 22.5468 110.259 22.2765 110.697 22.0828C111.146 21.889 111.62 21.7921 112.12 21.7921Z"
        fill="#062F29"
      />
      <path
        d="M8.61854 15.0063C8.61829 14.3889 8.08318 13.8253 7.34375 13.8253C6.6044 13.8254 6.06922 14.3889 6.06897 15.0063V25.4794H4.45905V15.0063C4.45929 13.4302 5.78588 12.2154 7.34375 12.2154C8.90168 12.2154 10.2293 13.4302 10.2295 15.0063V25.4794H8.61854V15.0063ZM21.1002 15.0063C21.1 14.3889 20.5638 13.8253 19.8244 13.8253C19.0852 13.8255 18.5498 14.389 18.5496 15.0063V25.4794H16.9397V15.0063C16.9399 13.4303 18.2666 12.2156 19.8244 12.2154C21.3823 12.2154 22.7099 13.4302 22.7101 15.0063V25.4794H21.1002V15.0063ZM14.8588 7.06235C14.8588 6.44477 14.3236 5.88131 13.5841 5.88131C12.8446 5.88146 12.3093 6.44485 12.3093 7.06235V10.2078C12.817 10.6912 13.2475 11.2496 13.5841 11.8641C13.9206 11.2496 14.3511 10.6912 14.8588 10.2078V7.06235ZM16.4698 9.05912C17.2455 8.65524 18.1075 8.38874 19.0194 8.28864V7.06235C19.0194 4.25087 16.6213 1.90825 13.5841 1.90825C10.5469 1.9084 8.14871 4.25096 8.14871 7.06235V8.28864C9.06096 8.3887 9.92338 8.65505 10.6994 9.05912V7.06235C10.6994 5.48612 12.0261 4.27047 13.5841 4.27032C15.1421 4.27032 16.4698 5.48602 16.4698 7.06235V9.05912ZM20.6304 8.28864C24.1147 8.67121 26.8705 11.5025 26.8707 15.0063V25.4794H25.2597V15.0063C25.2595 12.195 22.8615 9.8533 19.8244 9.8533C16.7875 9.85352 14.3903 12.1952 14.3901 15.0063V26.7348C14.3901 28.5538 15.945 30.0914 17.9429 30.0914H19.8244V31.7014H17.9429C16.1265 31.7014 14.5064 30.7903 13.5841 29.3986C12.6618 30.79 11.0424 31.7012 9.22629 31.7014H7.34375V30.0914H9.22629C11.224 30.0913 12.7791 28.5537 12.7791 26.7348V15.0063C12.7789 12.195 10.3809 9.8533 7.34375 9.8533C4.30671 9.85337 1.90865 12.1951 1.90841 15.0063V25.4794H0.298492V15.0063C0.298718 11.5023 3.05424 8.67099 6.53879 8.28864V7.06235C6.53879 3.29222 9.72844 0.29849 13.5841 0.29834C17.4398 0.29834 20.6304 3.29212 20.6304 7.06235V8.28864Z"
        fill="#062F29"
      />
    </svg>
  );
}

export function Sidebar({ currentStudentId }: SidebarProps) {
  const router = useRouter();
  const students = getAllStudents();
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({});
  const [viewMode, setViewMode] = useState<'student' | 'staff'>('student');

  // For demo purposes, no active page tracking since menu items are non-functional
  const activePageId: string | null = null;
  const activeSubmenuId: string | null = null;

  const handleStudentChange = (studentId: string) => {
    router.push(`/students/${studentId}`);
  };

  const toggleSubmenu = (itemId: string) => {
    setOpenSubmenus((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const handleNavItemClick = (item: typeof navItems[0]) => {
    if (item.submenu) {
      toggleSubmenu(item.id);
    }
    router.push('/');
  };

  const handleViewModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMode: 'student' | 'staff' | null
  ) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  return (
    <SidebarContainer>
      <LogoContainer>
        <WillowLogo />
      </LogoContainer>

      <NavList>
        {navItems.map((item) => {
          const isActive = activePageId === item.id;
          const isSubmenuOpen = openSubmenus[item.id];

          return (
            <React.Fragment key={item.id}>
              <ListItem disablePadding sx={{ display: 'block' }}>
                <NavItem active={isActive} onClick={() => handleNavItemClick(item)}>
                  <NavItemIcon active={isActive}>
                    <item.Icon size={20} />
                  </NavItemIcon>
                  <Typography
                    sx={{
                      fontWeight: isActive ? 600 : 400,
                      fontSize: '14px',
                      color: isActive ? Slate[700] : neutral[700],
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.label}
                  </Typography>
                </NavItem>
              </ListItem>

              {item.submenu && (
                <Collapse in={isSubmenuOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.submenu.map((submenuItem) => {
                      const isSubmenuItemActive = activeSubmenuId === submenuItem.id;

                      return (
                        <ListItem key={submenuItem.id} disablePadding sx={{ display: 'block' }}>
                          <SubNavItem active={isSubmenuItemActive} onClick={() => {}}>
                            <SubNavItemIcon active={isSubmenuItemActive}>
                              <submenuItem.Icon size={16} />
                            </SubNavItemIcon>
                            <Typography
                              sx={{
                                fontWeight: isSubmenuItemActive ? 600 : 400,
                                fontSize: '14px',
                                color: isSubmenuItemActive ? Slate[700] : neutral[700],
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {submenuItem.label}
                            </Typography>
                          </SubNavItem>
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          );
        })}
      </NavList>

      {/* Testing Section */}
      <TestingSection>
        <TestingSectionHeader>Testing</TestingSectionHeader>

        {/* Student Picker */}
        <Box sx={{ mb: 1.5 }}>
          <Typography
            sx={{
              fontSize: '11px',
              color: neutral[500],
              mb: 0.5,
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              px: 0.5,
            }}
          >
            Test Student
          </Typography>
          <FormControl size="small" fullWidth>
            <Select
              value={currentStudentId || ''}
              onChange={(e) => handleStudentChange(e.target.value as string)}
              displayEmpty
              sx={{
                fontSize: '13px',
                backgroundColor: neutral[50],
                '& .MuiSelect-select': {
                  padding: '8px 12px',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: neutral[200],
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: neutral[300],
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: Slate[700],
                },
              }}
            >
              <MenuItem value="" disabled>
                <Typography sx={{ fontSize: '13px', color: neutral[500] }}>
                  Select a student...
                </Typography>
              </MenuItem>
              {students.map((student) => (
                <MenuItem key={student.id} value={student.id} sx={{ py: 1 }}>
                  <Box>
                    <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>
                      {student.firstName} {student.lastName}
                    </Typography>
                    <Typography sx={{ fontSize: '11px', color: neutral[500] }}>
                      Grade {student.grade} •{' '}
                      {student.onTrackStatus === 'on_track' ? 'On Track' : 'Off Track'}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* View Mode Toggle - Hidden for now, will be re-enabled later */}
        {/* TODO: Set SHOW_VIEW_MODE_TOGGLE to true to re-enable */}
        {false && (
          <Box>
            <Typography
              sx={{
                fontSize: '11px',
                color: neutral[500],
                mb: 0.5,
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                px: 0.5,
              }}
            >
              View Mode
            </Typography>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              size="small"
              fullWidth
              sx={{
                '& .MuiToggleButtonGroup-grouped': {
                  border: `1px solid ${neutral[200]}`,
                  '&:not(:first-of-type)': {
                    borderLeft: `1px solid ${neutral[200]}`,
                    marginLeft: 0,
                  },
                  '&.Mui-selected': {
                    backgroundColor: Slate[700],
                    color: essentials.white,
                    '&:hover': {
                      backgroundColor: Slate[600],
                    },
                  },
                  '&:not(.Mui-selected)': {
                    backgroundColor: neutral[50],
                    color: neutral[700],
                    '&:hover': {
                      backgroundColor: neutral[100],
                    },
                  },
                },
              }}
            >
              <ToggleButton
                value="student"
                sx={{
                  fontSize: '12px',
                  fontWeight: 500,
                  textTransform: 'none',
                  py: 0.75,
                }}
              >
                Student
              </ToggleButton>
              <ToggleButton
                value="staff"
                sx={{
                  fontSize: '12px',
                  fontWeight: 500,
                  textTransform: 'none',
                  py: 0.75,
                }}
              >
                Staff
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        )}
      </TestingSection>
    </SidebarContainer>
  );
}

export default Sidebar;
