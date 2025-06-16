import React, { useEffect } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquareQuote, 
  Mail,
  Database,
  LogOut,
  Menu,
  X,
  Home
} from 'lucide-react';
import { checkSession, logout } from '../lib/auth';
import { useSessionTimeout } from '../lib/auth';

export function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!checkSession()) {
      navigate('/admin/login', { 
        state: { from: location.pathname }
      });
    }
  }, [navigate, location]);

  // Initialize session timeout
  useSessionTimeout();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', path: '/admin' },
    { icon: <Database className="w-5 h-5" />, label: 'Classifications', path: '/admin/classifications' },
    { icon: <Users className="w-5 h-5" />, label: 'Users', path: '/admin/users' },
    { icon: <MessageSquareQuote className="w-5 h-5" />, label: 'Testimonials', path: '/admin/testimonials' },
    { icon: <Mail className="w-5 h-5" />, label: 'Newsletter', path: '/admin/newsletter' }
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 z-40 h-screen transition-transform
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-white dark:bg-gray-800 w-64">
          <div className="flex items-center justify-between mb-6 px-2">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Admin Panel</h2>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="space-y-2">
            <Link
              to="/"
              className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="ml-3">Back to Site</span>
            </Link>

            <div className="h-px bg-gray-200 dark:bg-gray-700 my-4" />

            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            ))}
            
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="ml-3">Logout</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : ''}`}>
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Welcome, Admin
              </span>
            </div>
          </div>
        </header>

        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}