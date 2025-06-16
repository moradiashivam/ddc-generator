import React, { useState, useEffect } from 'react';
import { 
  User, 
  Users as UsersIcon, 
  Calendar, 
  Shield,
  Search,
  Loader2,
  Ban,
  CheckCircle,
  Mail,
  Filter,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

interface UserData {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl: string;
  lastSignInAt?: Date;
  createdAt: Date;
  role?: string;
  banned: boolean;
}

interface FilterOptions {
  query: string;
  banned: boolean | null;
  role: string;
  orderBy: string;
}

export function Users() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    query: '',
    banned: null,
    role: 'all',
    orderBy: '-created_at'
  });

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      
      // Mock user data since Clerk is removed
      const mockUsers: UserData[] = [
        {
          id: '1',
          email: 'user1@example.com',
          firstName: 'John',
          lastName: 'Doe',
          imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          lastSignInAt: new Date(),
          createdAt: new Date(Date.now() - 86400000),
          role: 'user',
          banned: false
        },
        {
          id: '2',
          email: 'user2@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
          imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
          lastSignInAt: new Date(Date.now() - 3600000),
          createdAt: new Date(Date.now() - 172800000),
          role: 'user',
          banned: false
        }
      ];

      // Apply filters
      let filteredUsers = mockUsers;
      
      if (filters.query) {
        filteredUsers = filteredUsers.filter(user =>
          user.email.toLowerCase().includes(filters.query.toLowerCase()) ||
          `${user.firstName} ${user.lastName}`.toLowerCase().includes(filters.query.toLowerCase())
        );
      }
      
      if (filters.banned !== null) {
        filteredUsers = filteredUsers.filter(user => user.banned === filters.banned);
      }
      
      if (filters.role !== 'all') {
        filteredUsers = filteredUsers.filter(user => user.role === filters.role);
      }

      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBanUser = async (userId: string, banned: boolean) => {
    try {
      // Mock ban/unban functionality
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, banned } : user
      ));
      toast.success(`User ${banned ? 'banned' : 'unbanned'} successfully`);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  const stats = [
    {
      icon: <UsersIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      label: 'Total Users',
      value: users.length
    },
    {
      icon: <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />,
      label: 'Active Users',
      value: users.filter(u => !u.banned).length
    },
    {
      icon: <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
      label: 'New This Month',
      value: users.filter(u => {
        const date = new Date(u.createdAt);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      }).length
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          User Management
        </h1>
        <button
          onClick={fetchUsers}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stat.value}
                </p>
              </div>
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Filters
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={filters.query}
              onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <select
            value={filters.role}
            onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="user">Users</option>
          </select>

          <select
            value={filters.banned?.toString() ?? 'all'}
            onChange={(e) => setFilters(prev => ({ 
              ...prev, 
              banned: e.target.value === 'all' ? null : e.target.value === 'true'
            }))}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="false">Active</option>
            <option value="true">Banned</option>
          </select>

          <select
            value={filters.orderBy}
            onChange={(e) => setFilters(prev => ({ ...prev, orderBy: e.target.value }))}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="-created_at">Newest First</option>
            <option value="created_at">Oldest First</option>
            <option value="-last_sign_in_at">Recently Active</option>
            <option value="email_address">Email (A-Z)</option>
            <option value="-email_address">Email (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">User</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Last Sign In</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Joined</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.imageUrl}
                        alt={user.firstName || 'User'}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {user.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    {user.banned ? (
                      <span className="flex items-center space-x-1 text-red-600 dark:text-red-400">
                        <Ban className="w-4 h-4" />
                        <span>Banned</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        <span>Active</span>
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleBanUser(user.id, !user.banned)}
                      className={`text-sm font-medium px-3 py-1 rounded-lg transition-colors ${
                        user.banned
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
                      }`}
                    >
                      {user.banned ? 'Unban' : 'Ban'}
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No users found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}