import { RootState } from '../store';
import { Task } from '../../types';

export const selectAllTasks = (state: RootState) => state.tasks.tasks;
export const selectFilters = (state: RootState) => state.tasks.filters;
export const selectSort = (state: RootState) => state.tasks.sort; 

export const selectFilteredTasks = (state: RootState) => {
  const tasks = selectAllTasks(state);
  const filters = selectFilters(state);
  const sort = selectSort(state);
  
  let filteredTasks = [...tasks];

  if (filters && 'status' in filters && filters.status) {
    filteredTasks = filteredTasks.filter((task) => task.status === filters.status);
  }

  if (filters && 'priority' in filters && filters.priority) {
    filteredTasks = filteredTasks.filter((task) => task.priority === filters.priority);
  }

  if (filters && 'search' in filters && filters.search) {
    const searchLower = (filters.search as string).toLowerCase();
    filteredTasks = filteredTasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower) ||
        task.assignee?.toLowerCase().includes(searchLower)
    );
  }

  return applySorting(filteredTasks, sort);
};

export const selectTasksByStatus = (state: RootState, status: Task['status']) => {
  const filteredTasks = selectFilteredTasks(state);
  return filteredTasks.filter((task) => task.status === status);
};

const applySorting = (tasks: Task[], sort: any) => {
  return [...tasks].sort((a, b) => {
    let aValue: string | number | undefined;
    let bValue: string | number | undefined;

    switch (sort.field) {
      case 'dueDate':
        aValue = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        bValue = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        break;
      case 'priority':
        let priorityOrder = { Low: 1, Medium: 2, High: 3 };
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

    return sort.direction === 'asc'
? (() => {
    if (aValue < bValue) return -1;
    if (aValue > bValue) return 1;
    return 0;
  })()
: (() => {
        if (aValue > bValue) return -1;
        if (aValue < bValue) return 1;
        return 0;
      })();
  });
};