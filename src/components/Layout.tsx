import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { CheckSquare, ChefHat, Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

type ActiveTab = 'tasks' | 'recipes';

interface LayoutState {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

const Layout: React.FC<LayoutProps & LayoutState> = ({ 
  children, 
  activeTab, 
  onTabChange 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between p-4 bg-white shadow-sm">
          <h1 className="text-xl font-semibold">Collaborative Task Manager</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b">
              <h1 className="text-xl font-bold text-gray-900">
                Task Manager
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Collaborative workspace
              </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      setSidebarOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className={cn(
                        "text-xs mt-1",
                        isActive ? "text-primary-foreground/80" : "text-gray-500"
                      )}>
                        {item.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>

          
          </div>
        </div>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="flex-1 lg:ml-0">
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;