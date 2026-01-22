'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import type { Task } from '@/types/student';

interface NewTaskData {
  studentId: string;
  title: string;
  dueDate?: string | null;
  source?: Task['source'];
  taskType: Task['taskType'];
}

interface TasksContextType {
  tasks: Map<string, Task[]>; // studentId -> tasks
  getTasksForStudent: (studentId: string) => Task[];
  addTask: (data: NewTaskData) => Task;
  updateTask: (studentId: string, taskId: string, updates: Partial<Task>) => void;
  toggleTask: (studentId: string, taskId: string) => void;
  deleteTask: (studentId: string, taskId: string) => void;
  initializeTasks: (studentId: string, tasks: Task[]) => void;
}

const TasksContext = createContext<TasksContextType | null>(null);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Map<string, Task[]>>(new Map());
  const [initialized, setInitialized] = useState<Set<string>>(new Set());

  const getTasksForStudent = useCallback((studentId: string): Task[] => {
    return tasks.get(studentId) || [];
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
      dueDate: data.dueDate || null,
      status: 'open',
      source: data.source || 'interaction',
      taskType: data.taskType,
    };

    setTasks(prev => {
      const newMap = new Map(prev);
      const studentTasks = newMap.get(data.studentId) || [];
      // Add new task at the beginning
      newMap.set(data.studentId, [newTask, ...studentTasks]);
      return newMap;
    });

    return newTask;
  }, []);

  const updateTask = useCallback((studentId: string, taskId: string, updates: Partial<Task>) => {
    setTasks(prev => {
      const newMap = new Map(prev);
      const studentTasks = newMap.get(studentId) || [];
      const taskIndex = studentTasks.findIndex(t => t.id === taskId);

      if (taskIndex === -1) return prev;

      const existingTask = studentTasks[taskIndex];
      const updatedTask = {
        ...existingTask,
        ...updates,
      };

      const newStudentTasks = [...studentTasks];
      newStudentTasks[taskIndex] = updatedTask;
      newMap.set(studentId, newStudentTasks);

      return newMap;
    });
  }, []);

  const toggleTask = useCallback((studentId: string, taskId: string) => {
    setTasks(prev => {
      const newMap = new Map(prev);
      const studentTasks = newMap.get(studentId) || [];
      const taskIndex = studentTasks.findIndex(t => t.id === taskId);

      if (taskIndex === -1) return prev;

      const existingTask = studentTasks[taskIndex];
      const updatedTask = {
        ...existingTask,
        status: existingTask.status === 'open' ? 'completed' as const : 'open' as const,
      };

      const newStudentTasks = [...studentTasks];
      newStudentTasks[taskIndex] = updatedTask;
      newMap.set(studentId, newStudentTasks);

      return newMap;
    });
  }, []);

  const deleteTask = useCallback((studentId: string, taskId: string) => {
    setTasks(prev => {
      const newMap = new Map(prev);
      const studentTasks = newMap.get(studentId) || [];
      const filteredTasks = studentTasks.filter(t => t.id !== taskId);
      newMap.set(studentId, filteredTasks);
      return newMap;
    });
  }, []);

  return (
    <TasksContext.Provider value={{
      tasks,
      getTasksForStudent,
      addTask,
      updateTask,
      toggleTask,
      deleteTask,
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
