import React from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Edit, Trash2, Calendar, User } from 'lucide-react';
import { Task } from '../types';
import { cn } from '../lib/utils';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  isDragging?: boolean;
}

// Memoize the TaskCard component
const TaskCard: React.FC<TaskCardProps> = React.memo(({ task, onEdit, onDelete, isDragging }) => {
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && task.status !== 'Done';
  };

  return (
    <Card 
      className={cn(
        "cursor-grab active:cursor-grabbing transition-all hover:shadow-md",
        isDragging && "rotate-2 shadow-lg",
        isOverdue(task.dueDate) && "border-red-300 bg-red-50"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-sm leading-tight">{task.title}</h3>
          <Badge variant="outline" className={cn("text-xs", getPriorityColor(task.priority))}>
            {task.priority}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {task.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="space-y-2 mb-4">
          {task.dueDate && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="w-3 h-3 mr-1" />
              <span className={isOverdue(task.dueDate) ? "text-red-600 font-medium" : ""}>
                Due: {formatDate(task.dueDate)}
              </span>
              {isOverdue(task.dueDate) && (
                <Badge variant="destructive" className="ml-2 text-xs py-0">
                  Overdue
                </Badge>
              )}
            </div>
          )}

          {task.assignee && (
            <div className="flex items-center text-xs text-muted-foreground">
              <User className="w-3 h-3 mr-1" />
              <span>{task.assignee}</span>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
            className="h-8 w-8 p-0"
          >
            <Edit className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task.id)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

export default TaskCard;