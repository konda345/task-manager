import { ActiveTab } from "@/types";
import { CheckSquare, ChefHat } from "lucide-react";

export const navigation = [
    {
      id: 'tasks' as ActiveTab,
      name: 'Task Manager',
      icon: CheckSquare,
      description: 'Manage your tasks and projects',
    },
    {
      id: 'recipes' as ActiveTab,
      name: 'Recipe Collection',
      icon: ChefHat,
      description: 'Discover delicious recipes',
    },
  ];