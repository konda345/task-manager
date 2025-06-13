import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task, TaskFormData, TaskFilters, TaskSort } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { initialTasks } from '../data/initialTasks';

interface TaskState {
  tasks: Task[];
  filters: TaskFilters;
  sort: TaskSort;
}

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: initialTasks,
    filters: {},
    sort: { field: 'createdAt', direction: 'desc' }
  },
  reducers: {
    addTask: (state, action: PayloadAction<TaskFormData>) => {
      const newTask: Task = {
        id: uuidv4(),
        ...action.payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.tasks.push(newTask);
    },
    updateTask: (state, action: PayloadAction<{ id: string; taskData: Partial<TaskFormData> }>) => {
      const { id, taskData } = action.payload;
      const task = state.tasks.find(t => t.id === id);
      if (task) {
        Object.assign(task, {
          ...taskData,
          updatedAt: new Date().toISOString()
        });
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    updateTaskStatus: (state, action: PayloadAction<{ id: string; status: Task['status'] }>) => {
      const { id, status } = action.payload;
      const task = state.tasks.find(t => t.id === id);
      if (task) {
        task.status = status;
        task.updatedAt = new Date().toISOString();
      }
    },
    setFilters: (state, action: PayloadAction<Partial<TaskFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSort: (state, action: PayloadAction<TaskSort>) => {
      state.sort = action.payload;
    }
  }
});

export const { 
  addTask, 
  updateTask, 
  deleteTask, 
  updateTaskStatus, 
  setFilters, 
  setSort 
} = taskSlice.actions;

export default taskSlice.reducer;