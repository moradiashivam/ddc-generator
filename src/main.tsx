import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './context/ThemeContext';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import { ClassificationLog } from './pages/ClassificationLog.tsx';
import './index.css';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing Clerk Publishable Key");
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/classification-log',
    element: <ClassificationLog />
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider 
      publishableKey={clerkPubKey}
      appearance={{
        elements: {
          formButtonPrimary: 
            "bg-blue-600 hover:bg-blue-700 text-white",
          socialButtonsIconButton: 
            "border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800",
          footerActionLink: 
            "text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300",
          card: 
            "bg-white dark:bg-gray-800 shadow-xl",
        },
      }}
    >
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </ClerkProvider>
  </StrictMode>
);