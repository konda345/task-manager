import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Layout from './components/Layout';
import TaskBoard from './components/TaskBoard';
import RecipeList from './components/RecipeList';
import { Toaster } from './components/ui/toaster';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

type ActiveTab = 'tasks' | 'recipes';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('tasks');

  const renderContent = () => {
    switch (activeTab) {
      case 'tasks':
        return <TaskBoard />;
      case 'recipes':
        return <RecipeList />;
      default:
        return <TaskBoard />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Layout activeTab={activeTab} onTabChange={setActiveTab}>
          {renderContent()}
        </Layout>
        <Toaster />
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;