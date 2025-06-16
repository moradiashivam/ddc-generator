import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './context/ThemeContext';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.tsx';
import { ClassificationLog } from './pages/ClassificationLog.tsx';
import { CSVExport } from './pages/CSVExport.tsx';
import { AdminLayout } from './components/AdminLayout';
import { Login } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { Users } from './pages/admin/Users';
import { Testimonials } from './pages/admin/Testimonials';
import { Newsletter } from './pages/admin/Newsletter';
import { Classifications } from './pages/admin/Classifications';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/classification-log',
    element: <ClassificationLog />
  },
  {
    path: '/csv-export/:key',
    element: <CSVExport />
  },
  {
    path: '/admin/login',
    element: <Login />
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: '',
        element: <Dashboard />
      },
      {
        path: 'users',
        element: <Users />
      },
      {
        path: 'testimonials',
        element: <Testimonials />
      },
      {
        path: 'newsletter',
        element: <Newsletter />
      },
      {
        path: 'classifications',
        element: <Classifications />
      }
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </ThemeProvider>
  </StrictMode>
);