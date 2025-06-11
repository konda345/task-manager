# Task Manager Application

## Overview
A collaborative task management application built with React, TypeScript, and modern web technologies. Features include task management with drag-and-drop functionality and a recipe search feature.

## Features
- Task Management (CRUD operations)
- Drag and Drop task organization
- Task filtering and sorting
- Recipe search functionality
- Responsive design
- Form validation

## Tech Stack
- React + TypeScript
- Vite (Build tool)
- TanStack Query (Data fetching)
- Zustand (State management)
- React Hook Form + Zod (Form handling and validation)
- Tailwind CSS (Styling)
- Shadcn UI (Component library)
- @hello-pangea/dnd (Drag and drop)

## Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)

## Installation and Setup

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd task-manager
   npm install
   npm run dev
   ```

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
