'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Avatar,
  LinearProgress,
  Chip,
} from '@mui/material';
import { Search, Users } from 'lucide-react';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { getAllStudents } from '@/lib/mockData';
import type { Student } from '@/types/student';

// Staff name (in a real app this would come from auth context)
const STAFF_NAME = 'Ms. Olivia';

// Grade options
const gradeOptions = [
  { value: 9, label: '9th' },
  { value: 10, label: '10th' },
  { value: 11, label: '11th' },
  { value: 12, label: '12th' },
];

// Status options
const statusOptions = [
  { value: 'on_track', label: 'On Track' },
  { value: 'off_track', label: 'Off Track' },
];

// Tab definitions
const tabs = [
  { id: 0, label: 'Overview' },
  { id: 1, label: 'Milestones' },
  { id: 2, label: 'List Building' },
  { id: 3, label: 'Applications' },
  { id: 4, label: 'Portfolio' },
];

// Student Avatar component
const StudentAvatar = ({
  firstName,
  lastName,
  avatarUrl,
}: {
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}) => {
  return (
    <Avatar
      alt={`${firstName} ${lastName}`}
      src={avatarUrl}
      sx={{ width: 40, height: 40, bgcolor: '#8B5CF6' }}
    >
      {!avatarUrl && `${firstName?.charAt(0) || '?'}${lastName?.charAt(0) || '?'}`}
    </Avatar>
  );
};

// Format grade level
const formatGradeLevel = (grade: number) => {
  switch (grade) {
    case 9: return '9th';
    case 10: return '10th';
    case 11: return '11th';
    case 12: return '12th';
    default: return 'Unknown';
  }
};

// Get status display text and color
const getStatusDisplay = (status: 'on_track' | 'off_track') => {
  return status === 'on_track'
    ? { text: 'On Track', color: '#4CAF50' }
    : { text: 'Off Track', color: '#F44336' };
};

export function StaffDashboard() {
  const router = useRouter();
  const allStudents = useMemo(() => getAllStudents(), []);

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState(0);

  // Pagination
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 15,
  });

  // Sort model
  const [sortModel, setSortModel] = useState<any>([
    { field: 'student', sort: 'asc' }
  ]);

  // Filter students
  const filteredStudents = useMemo(() => {
    return allStudents.filter((student) => {
      const searchMatch =
        searchTerm === '' ||
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());

      const gradeMatch = selectedGrade === '' || student.grade === Number(selectedGrade);
      const statusMatch = selectedStatus === '' || student.onTrackStatus === selectedStatus;

      return searchMatch && gradeMatch && statusMatch;
    });
  }, [allStudents, searchTerm, selectedGrade, selectedStatus]);

  // Sort students
  const sortedStudents = useMemo(() => {
    if (sortModel.length === 0) return filteredStudents;

    const { field, sort } = sortModel[0];
    const sorted = [...filteredStudents].sort((a, b) => {
      let aValue, bValue;

      switch (field) {
        case 'student':
          aValue = a.lastName?.toLowerCase() || '';
          bValue = b.lastName?.toLowerCase() || '';
          break;
        case 'grade':
          aValue = a.grade;
          bValue = b.grade;
          break;
        case 'readinessScore':
          aValue = a.readinessScore;
          bValue = b.readinessScore;
          break;
        case 'gpa':
          aValue = a.gpa || 0;
          bValue = b.gpa || 0;
          break;
        case 'onTrackStatus':
          aValue = a.onTrackStatus === 'on_track' ? 1 : 0;
          bValue = b.onTrackStatus === 'on_track' ? 1 : 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sort === 'asc' ? -1 : 1;
      if (aValue > bValue) return sort === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredStudents, sortModel]);

  // Handle row click - navigate to student profile
  const handleRowClick = useCallback(
    (params: GridRowParams) => {
      router.push(`/students/${params.row.id}`);
    },
    [router]
  );

  // DataGrid columns
  const columns: GridColDef[] = [
    {
      field: 'student',
      headerName: 'Student',
      flex: 2,
      minWidth: 200,
      sortable: true,
      renderHeader: () => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Student
        </Typography>
      ),
      renderCell: (params) => {
        const { firstName, lastName, avatarUrl, location } = params.row;

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
            <StudentAvatar firstName={firstName} lastName={lastName} avatarUrl={avatarUrl} />
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: '#374151',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '14px',
                  fontWeight: 600,
                  lineHeight: '20px',
                }}
              >
                {firstName} {lastName}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#6B7280',
                  fontSize: '12px',
                  fontWeight: 400,
                }}
              >
                {location}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      field: 'grade',
      headerName: 'Grade',
      flex: 0.5,
      minWidth: 80,
      sortable: true,
      renderHeader: () => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Grade
        </Typography>
      ),
      renderCell: (params) => (
        <Typography variant="body2">
          {formatGradeLevel(params.value)}
        </Typography>
      ),
    },
    {
      field: 'onTrackStatus',
      headerName: 'Status',
      flex: 1,
      minWidth: 120,
      sortable: true,
      renderHeader: () => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Status
        </Typography>
      ),
      renderCell: (params) => {
        const { text, color } = getStatusDisplay(params.value);
        return (
          <Chip
            label={text}
            size="small"
            sx={{
              backgroundColor: params.value === 'on_track' ? '#E8F5E9' : '#FFEBEE',
              color: color,
              fontWeight: 500,
              fontSize: '12px',
            }}
          />
        );
      },
    },
    {
      field: 'readinessScore',
      headerName: 'Career Readiness',
      flex: 1.2,
      minWidth: 150,
      sortable: true,
      renderHeader: () => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Career Readiness
        </Typography>
      ),
      renderCell: (params) => {
        const score = params.value || 0;
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', py: 1 }}>
            <Typography variant="body2" sx={{ fontSize: '12px', mb: 0.5 }}>
              {score > 0 ? `${score}%` : 'Unknown'}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={score}
              sx={{
                width: '90%',
                height: 6,
                borderRadius: 3,
                backgroundColor: 'rgba(0,0,0,0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: score >= 80 ? '#4caf50' : score >= 60 ? '#ff9800' : '#f44336',
                },
              }}
            />
          </Box>
        );
      },
    },
    {
      field: 'gpa',
      headerName: 'GPA',
      flex: 0.7,
      minWidth: 100,
      sortable: true,
      renderHeader: () => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          GPA
        </Typography>
      ),
      renderCell: (params) => {
        const gpa = params.value;
        return (
          <Typography variant="body2" sx={{ fontSize: '14px' }}>
            {gpa ? gpa.toFixed(2) : '-'}
          </Typography>
        );
      },
    },
    {
      field: 'satScore',
      headerName: 'SAT',
      flex: 0.6,
      minWidth: 80,
      sortable: true,
      renderHeader: () => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          SAT
        </Typography>
      ),
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontSize: '14px' }}>
          {params.value || '-'}
        </Typography>
      ),
    },
    {
      field: 'actScore',
      headerName: 'ACT',
      flex: 0.6,
      minWidth: 80,
      sortable: true,
      renderHeader: () => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          ACT
        </Typography>
      ),
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontSize: '14px' }}>
          {params.value || '-'}
        </Typography>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      {/* Welcome Header */}
      <Typography
        variant="h1"
        sx={{
          fontSize: '28px',
          fontWeight: 600,
          color: '#111827',
          mb: 1,
        }}
      >
        Welcome back, {STAFF_NAME}!
      </Typography>

      {/* Your Students Section Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 4,
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Users size={24} color="#6B7280" />
          <Typography
            variant="h2"
            sx={{
              fontSize: '20px',
              fontWeight: 600,
              color: '#111827',
            }}
          >
            Your students
          </Typography>
        </Box>
      </Box>

      {/* Filter Row */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
          alignItems: 'center',
        }}
      >
        <TextField
          placeholder="Search students..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 250, maxWidth: 300, flex: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} color="#9CA3AF" />
              </InputAdornment>
            ),
          }}
        />

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Grade</InputLabel>
          <Select
            value={selectedGrade}
            label="Grade"
            onChange={(e) => setSelectedGrade(e.target.value)}
          >
            <MenuItem value="">All Grades</MenuItem>
            {gradeOptions.map((grade) => (
              <MenuItem key={grade.value} value={grade.value}>
                {grade.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={selectedStatus}
            label="Status"
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <MenuItem value="">All Statuses</MenuItem>
            {statusOptions.map((status) => (
              <MenuItem key={status.value} value={status.value}>
                {status.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Tabs */}
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        {tabs.map((tab) => (
          <Box
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            sx={{
              px: 2,
              py: 0.75,
              borderRadius: '100px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: selectedTab === tab.id ? 600 : 500,
              color: selectedTab === tab.id ? '#fff' : '#6B7280',
              backgroundColor: selectedTab === tab.id ? '#062F29' : 'transparent',
              border: '1px solid',
              borderColor: selectedTab === tab.id ? '#062F29' : '#E5E7EB',
              transition: 'all 0.15s ease',
              '&:hover': {
                backgroundColor: selectedTab === tab.id ? '#062F29' : '#F9FAFB',
                borderColor: selectedTab === tab.id ? '#062F29' : '#D1D5DB',
              },
            }}
          >
            {tab.label}
          </Box>
        ))}
      </Box>

      {/* Data Grid */}
      <Box sx={{ width: '100%' }}>
        <DataGrid
          rows={sortedStudents}
          columns={columns}
          sortModel={sortModel}
          onSortModelChange={(model) => setSortModel(model)}
          onRowClick={handleRowClick}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[15, 30, 50]}
          pagination
          autoHeight
          checkboxSelection={false}
          disableRowSelectionOnClick={false}
          disableColumnMenu={true}
          getRowHeight={() => 'auto'}
          sx={{
            border: 'none',
            '& .MuiDataGrid-root': {
              border: 'none',
            },
            '& .MuiDataGrid-row': {
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#F9FAFB',
              },
              '&:focus': {
                outline: '2px solid #8B5CF6',
                outlineOffset: '-2px',
              },
            },
            '& .MuiDataGrid-cell': {
              display: 'flex',
              alignItems: 'center',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              borderBottom: '1px solid #F3F4F6',
              '&:focus': {
                outline: 'none',
              },
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#F9FAFB',
              borderBottom: '1px solid #E5E7EB',
              '& .MuiDataGrid-columnHeader': {
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 600,
              },
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '1px solid #E5E7EB',
            },
          }}
        />
      </Box>
    </Box>
  );
}

export default StaffDashboard;
