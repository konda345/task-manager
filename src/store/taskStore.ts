import { create } from 'zustand';
import { Task, TaskFormData, TaskFilters, TaskSort } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { persist } from 'zustand/middleware';

interface TaskState {
  tasks: Task[];
  filters: TaskFilters;
  sort: TaskSort;
  
  // Actions
  addTask: (taskData: TaskFormData) => void;
  updateTask: (id: string, taskData: Partial<TaskFormData>) => void;
  deleteTask: (id: string) => void;
  updateTaskStatus: (id: string, status: Task['status']) => void;
  setFilters: (filters: Partial<TaskFilters>) => void;
  setSort: (sort: TaskSort) => void;
  
  // Getters
  getFilteredTasks: () => Task[];
  getTasksByStatus: (status: Task['status']) => Task[];
}

// Mock initial data
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Setup project structure',
    description: 'Create the basic folder structure and install dependencies',
    status: 'Done',
    priority: 'High',
    assignee: 'John Doe',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    title: 'Implement task management',
    description: 'Build CRUD operations for tasks',
    status: 'In Progress',
    priority: 'High',
    dueDate: new Date(Date.now() + 172800000).toISOString(),
    assignee: 'Jane Smith',
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    updatedAt: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: '3',
    title: 'Add drag and drop functionality',
    description: 'Implement drag and drop between columns',
    status: 'To Do',
    priority: 'Medium',
    dueDate: new Date(Date.now() + 259200000).toISOString(),
    assignee: 'Bob Johnson',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useTaskStore = create(
  persist<TaskState>(
    (set, get) => ({
      tasks: initialTasks,
      filters: {},
      sort: { field: 'createdAt', direction: 'desc' },
  
      addTask: (taskData: TaskFormData) => {
        const newTask: Task = {
          id: uuidv4(),
          ...taskData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));
      },
  
      updateTask: (id: string, taskData: Partial<TaskFormData>) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...taskData, updatedAt: new Date().toISOString() }
              : task
          ),
        }));
      },
  
      deleteTask: (id: string) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },
  
      updateTaskStatus: (id: string, status: Task['status']) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, status, updatedAt: new Date().toISOString() }
              : task
          ),
        }));
      },
  
      setFilters: (filters: Partial<TaskFilters>) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
        }));
      },
  
      setSort: (sort: TaskSort) => {
        set({ sort });
      },
  
      getFilteredTasks: () => {
        const { tasks, filters, sort } = get();
        let filteredTasks = [...tasks];
  
        // Apply filters
        if (filters.status) {
          filteredTasks = filteredTasks.filter((task) => task.status === filters.status);
        }
  
        if (filters.priority) {
          filteredTasks = filteredTasks.filter((task) => task.priority === filters.priority);
        }
  
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredTasks = filteredTasks.filter(
            (task) =>
              task.title.toLowerCase().includes(searchLower) ||
              task.description?.toLowerCase().includes(searchLower) ||
              task.assignee?.toLowerCase().includes(searchLower)
          );
        }
  
        // Apply sorting
        filteredTasks.sort((a, b) => {
          let aValue: string | number | undefined;
          let bValue: string | number | undefined;
  
          switch (sort.field) {
            case 'dueDate':
              aValue = a.dueDate ? new Date(a.dueDate).getTime() : 0;
              bValue = b.dueDate ? new Date(b.dueDate).getTime() : 0;
              break;
            case 'priority':
              const priorityOrder = { Low: 1, Medium: 2, High: 3 };
              aValue = priorityOrder[a.priority];
              bValue = priorityOrder[b.priority];
              break;
            case 'createdAt':
              aValue = new Date(a.createdAt).getTime();
              bValue = new Date(b.createdAt).getTime();
              break;
          }
  
          if (aValue === undefined || aValue === 0) return 1;
          if (bValue === undefined || bValue === 0) return -1;
  
          if (sort.direction === 'asc') {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
          } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
          }
        });
  
        return filteredTasks;
      },
  
      getTasksByStatus: (status: Task['status']) => {
        const filteredTasks = get().getFilteredTasks();
        return filteredTasks.filter((task) => task.status === status);
      },
    }),
    {
      name: 'task-storage',
    }
  )
);