import { Task } from '../../types';

export const initialTasks: Task[] = [
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