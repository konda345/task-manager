import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import TaskFiltersComponent from './TaskFilters';
import { Task, TaskFormData, TaskStatus } from '../types';
import { useAppDispatch, useAppSelector } from '../hooks/useStore';
import {
  addTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  setFilters,
  setSort,
} from '../store/slices/taskSlice';
import {
  selectAllTasks,
  selectFilters,
  selectSort,
  selectTasksByStatus,
} from '../store/selectors/taskSelectors';

const COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'To Do', title: 'To Do', color: 'border-gray-200' },
  { id: 'In Progress', title: 'In Progress', color: 'border-blue-200' },
  { id: 'Done', title: 'Done', color: 'border-green-200' },
];

const TaskBoard: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as TaskStatus;
    handleUpdateTaskStatus(draggableId, newStatus);
  };

  const handleCreateTask = (taskData: TaskFormData) => {
    addTask(taskData);
    setIsFormOpen(false);
  };

  const tasks = useAppSelector(selectAllTasks);
  const filters = useAppSelector(selectFilters);
  const sort = useAppSelector(selectSort);
  const dispatch = useAppDispatch();

  // Replace direct function calls with dispatch
  const handleAddTask = (taskData: TaskFormData) => {
    dispatch(addTask(taskData));
  };

  const handleUpdateTask = (id: string, taskData: Partial<TaskFormData>) => {
    dispatch(updateTask({ id, taskData }));
  };

  const handleDeleteTask = (id: string) => {
    dispatch(deleteTask(id));
  };

  const handleUpdateTaskStatus = (id: string, status: Task['status']) => {
    dispatch(updateTaskStatus({ id, status }));
  };

  const handleSetFilters = (newFilters: Partial<typeof filters>) => {
    dispatch(setFilters(newFilters));
  };

  const handleSetSort = (newSort: typeof sort) => {
    dispatch(setSort(newSort as { field: "createdAt" | "priority" | "dueDate"; direction: "asc" | "desc" }));
  };

  const getTasksByStatusList = (status: Task['status']) => {
    return useAppSelector(state => selectTasksByStatus(state, status));
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Task Board</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Filters */}
      <TaskFiltersComponent
        filters={filters}
        sort={sort as { field: "createdAt" | "priority" | "dueDate"; direction: "asc" | "desc" }}
        onFiltersChange={setFilters}
        onSortChange={setSort}
        onClearFilters={handleClearFilters}
      />

      {/* Task Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {COLUMNS.map((column) => {
            const columnTasks = getTasksByStatusList(column.id);

            return (
              <Card key={column.id} className={`${column.color}`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{column.title}</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      {columnTasks.length}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`space-y-3 min-h-[200px] p-2 rounded-lg transition-colors ${
                          snapshot.isDraggingOver ? 'bg-gray-50' : ''
                        }`}
                      >
                        {columnTasks.map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <TaskCard
                                  task={task}
                                  onEdit={setEditingTask}
                                  onDelete={setDeletingTaskId}
                                  isDragging={snapshot.isDragging}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </DragDropContext>

      {/* Create Task Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <TaskForm
              task={editingTask}
              onSubmit={(data) => handleUpdateTask(editingTask.id, data)}
              onCancel={() => setEditingTask(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingTaskId} onOpenChange={() => setDeletingTaskId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deletingTaskId && handleDeleteTask(deletingTaskId)} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TaskBoard;
