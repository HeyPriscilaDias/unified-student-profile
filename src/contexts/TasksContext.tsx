'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import type { Task } from '@/types/student';
import { getAllStudents, getAllStudentTasks } from '@/lib/mockData';
import { setArchiveTasksForGoalCallback } from './SmartGoalsContext';

export interface TaskWithStudent extends Task {
  studentId?: string;
  studentName?: string;
}

interface NewTaskData {
  studentId?: string;
  title: string;
  description?: string;
  dueDate?: string | null;
  source?: Task['source'];
  taskType?: Task['taskType'];
  smartGoalId?: string;
}

const GLOBAL_TASKS_KEY = '__global__';

interface TasksContextType {
  tasks: Map<string, Task[]>; // studentId -> tasks (GLOBAL_TASKS_KEY for student-independent)
  getTasksForStudent: (studentId: string) => Task[];
  getTasksForGoal: (studentId: string, goalId: string) => Task[];
  getAllCounselorTasks: () => TaskWithStudent[];
  addTask: (data: NewTaskData) => Task;
  updateTask: (studentId: string | undefined, taskId: string, updates: Partial<Task>) => void;
  toggleTask: (studentId: string | undefined, taskId: string) => void;
  deleteTask: (studentId: string | undefined, taskId: string) => void;
  linkTaskToGoal: (studentId: string, taskId: string, goalId: string) => void;
  unlinkTaskFromGoal: (studentId: string, taskId: string) => void;
  archiveTasksForGoal: (studentId: string, goalId: string) => void;
  initializeTasks: (studentId: string, tasks: Task[]) => void;
}

const TasksContext = createContext<TasksContextType | null>(null);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Map<string, Task[]>>(() => {
    // Eagerly load all student tasks so the tasks tab is populated
    const allTasks = getAllStudentTasks();
    const map = new Map<string, Task[]>();
    for (const [studentId, studentTasks] of Object.entries(allTasks)) {
      map.set(studentId, studentTasks);
    }
    return map;
  });
  const [initialized, setInitialized] = useState<Set<string>>(() => {
    // Mark all eagerly-loaded students as initialized
    const allTasks = getAllStudentTasks();
    return new Set(Object.keys(allTasks));
  });

  const getTasksForStudent = useCallback((studentId: string): Task[] => {
    return tasks.get(studentId) || [];
  }, [tasks]);

  const getTasksForGoal = useCallback((studentId: string, goalId: string): Task[] => {
    const studentTasks = tasks.get(studentId) || [];
    return studentTasks.filter(t => t.smartGoalId === goalId);
  }, [tasks]);

  const getAllCounselorTasks = useCallback((): TaskWithStudent[] => {
    const allStudents = getAllStudents();
    const studentNameMap = new Map(allStudents.map(s => [s.id, `${s.firstName} ${s.lastName}`]));

    const allTasks: TaskWithStudent[] = [];
    tasks.forEach((studentTasks, key) => {
      const isGlobal = key === GLOBAL_TASKS_KEY;
      const studentName = isGlobal ? undefined : (studentNameMap.get(key) || 'Unknown Student');
      studentTasks.forEach((task) => {
        allTasks.push({
          ...task,
          studentId: isGlobal ? undefined : key,
          studentName,
        });
      });
    });

    return allTasks;
  }, [tasks]);

  const initializeTasks = useCallback((studentId: string, initialTasks: Task[]) => {
    if (initialized.has(studentId)) return;

    setTasks(prev => {
      const newMap = new Map(prev);
      newMap.set(studentId, initialTasks);
      return newMap;
    });
    setInitialized(prev => new Set(prev).add(studentId));
  }, [initialized]);

  const addTask = useCallback((data: NewTaskData): Task => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: data.title,
      description: data.description,
      dueDate: data.dueDate || null,
      status: 'open',
      source: data.source || 'manual',
      taskType: data.taskType || 'staff',
      smartGoalId: data.smartGoalId,
    };

    const key = data.studentId || GLOBAL_TASKS_KEY;
    setTasks(prev => {
      const newMap = new Map(prev);
      const existingTasks = newMap.get(key) || [];
      // Add new task at the beginning
      newMap.set(key, [newTask, ...existingTasks]);
      return newMap;
    });

    return newTask;
  }, []);

  const updateTask = useCallback((studentId: string | undefined, taskId: string, updates: Partial<Task>) => {
    const key = studentId || GLOBAL_TASKS_KEY;
    setTasks(prev => {
      const newMap = new Map(prev);
      const existingTasks = newMap.get(key) || [];
      const taskIndex = existingTasks.findIndex(t => t.id === taskId);

      if (taskIndex === -1) return prev;

      const existingTask = existingTasks[taskIndex];
      const updatedTask = {
        ...existingTask,
        ...updates,
      };

      const newTasks = [...existingTasks];
      newTasks[taskIndex] = updatedTask;
      newMap.set(key, newTasks);

      return newMap;
    });
  }, []);

  const toggleTask = useCallback((studentId: string | undefined, taskId: string) => {
    const key = studentId || GLOBAL_TASKS_KEY;
    setTasks(prev => {
      const newMap = new Map(prev);
      const existingTasks = newMap.get(key) || [];
      const taskIndex = existingTasks.findIndex(t => t.id === taskId);

      if (taskIndex === -1) return prev;

      const existingTask = existingTasks[taskIndex];
      const updatedTask = {
        ...existingTask,
        status: existingTask.status === 'open' ? 'completed' as const : 'open' as const,
      };

      const newTasks = [...existingTasks];
      newTasks[taskIndex] = updatedTask;
      newMap.set(key, newTasks);

      return newMap;
    });
  }, []);

  const deleteTask = useCallback((studentId: string | undefined, taskId: string) => {
    const key = studentId || GLOBAL_TASKS_KEY;
    setTasks(prev => {
      const newMap = new Map(prev);
      const existingTasks = newMap.get(key) || [];
      const filteredTasks = existingTasks.filter(t => t.id !== taskId);
      newMap.set(key, filteredTasks);
      return newMap;
    });
  }, []);

  const linkTaskToGoal = useCallback((studentId: string, taskId: string, goalId: string) => {
    setTasks(prev => {
      const newMap = new Map(prev);
      const existingTasks = newMap.get(studentId) || [];
      const taskIndex = existingTasks.findIndex(t => t.id === taskId);

      if (taskIndex === -1) return prev;

      const existingTask = existingTasks[taskIndex];
      const updatedTask = {
        ...existingTask,
        smartGoalId: goalId,
      };

      const newTasks = [...existingTasks];
      newTasks[taskIndex] = updatedTask;
      newMap.set(studentId, newTasks);

      return newMap;
    });
  }, []);

  const unlinkTaskFromGoal = useCallback((studentId: string, taskId: string) => {
    setTasks(prev => {
      const newMap = new Map(prev);
      const existingTasks = newMap.get(studentId) || [];
      const taskIndex = existingTasks.findIndex(t => t.id === taskId);

      if (taskIndex === -1) return prev;

      const existingTask = existingTasks[taskIndex];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { smartGoalId: _removed, ...taskWithoutGoal } = existingTask;
      const updatedTask = taskWithoutGoal as Task;

      const newTasks = [...existingTasks];
      newTasks[taskIndex] = updatedTask;
      newMap.set(studentId, newTasks);

      return newMap;
    });
  }, []);

  const archiveTasksForGoal = useCallback((studentId: string, goalId: string) => {
    setTasks(prev => {
      const newMap = new Map(prev);
      const existingTasks = newMap.get(studentId) || [];

      const updatedTasks = existingTasks.map(task => {
        if (task.smartGoalId === goalId) {
          return { ...task, status: 'archived' as const };
        }
        return task;
      });

      newMap.set(studentId, updatedTasks);
      return newMap;
    });
  }, []);

  // Register the archiveTasksForGoal callback with SmartGoalsContext
  useEffect(() => {
    setArchiveTasksForGoalCallback(archiveTasksForGoal);
  }, [archiveTasksForGoal]);

  return (
    <TasksContext.Provider value={{
      tasks,
      getTasksForStudent,
      getTasksForGoal,
      getAllCounselorTasks,
      addTask,
      updateTask,
      toggleTask,
      deleteTask,
      linkTaskToGoal,
      unlinkTaskFromGoal,
      archiveTasksForGoal,
      initializeTasks,
    }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasksContext() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasksContext must be used within a TasksProvider');
  }
  return context;
}

/**
 * Hook to get tasks for a student, merging context state with initial data
 */
export function useTasks(studentId: string, initialTasks: Task[]): Task[] {
  const { getTasksForStudent, initializeTasks } = useTasksContext();

  // Initialize tasks from mock data on first render
  useEffect(() => {
    initializeTasks(studentId, initialTasks);
  }, [studentId, initialTasks, initializeTasks]);

  return getTasksForStudent(studentId);
}
