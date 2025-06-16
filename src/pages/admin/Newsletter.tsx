import React, { useState, useEffect } from 'react';
import { 
  createColumnHelper, 
  flexRender, 
  getCoreRowModel, 
  getSortedRowModel,
  useReactTable,
  type SortingState
} from '@tanstack/react-table';
import { Mail, Download, Search, ArrowUpDown, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

interface Subscriber {
  id: string;
  email: string;
  subscribed: boolean;
  created_at: string;
  updated_at: string;
}

const columnHelper = createColumnHelper<Subscriber>();

export function Newsletter() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      toast.error('Failed to load subscribers');
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    columnHelper.accessor('email', {
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting()}
          className="flex items-center space-x-2"
        >
          <span>Email</span>
          <ArrowUpDown className="w-4 h-4" />
        </button>
      )
    }),
    columnHelper.accessor('subscribed', {
      header: 'Status',
      cell: (info) => (
        <span className={`px-2 py-1 rounded-full text-sm ${
          info.getValue()
            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
        }`}>
          {info.getValue() ? 'Active' : 'Inactive'}
        </span>
      )
    }),
    columnHelper.accessor('created_at', {
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting()}
          className="flex items-center space-x-2"
        >
          <span>Subscribed Date</span>
          <ArrowUpDown className="w-4 h-4" />
        </button>
      ),
      cell: (info) => new Date(info.getValue()).toLocaleString()
    })
  ];

  const filteredData = subscribers.filter(subscriber =>
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  const handleExport = () => {
    try {
      const csv = [
        ['Email', 'Status', 'Subscribed Date'],
        ...subscribers.map(s => [
          s.email,
          s.subscribed ? 'Active' : 'Inactive',
          new Date(s.created_at).toLocaleString()
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'subscribers.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Successfully exported subscribers');
    } catch (error) {
      console.error('Error exporting subscribers:', error);
      toast.error('Failed to export subscribers');
    }
  };

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
          Newsletter Subscribers
        </h1>
        <button
          onClick={handleExport}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="w-5 h-5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Subscribers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {subscribers.length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-400">Active Subscribers</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {subscribers.filter(s => s.subscribed).length}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-400">Last 7 Days</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {subscribers.filter(s => {
              const date = new Date(s.created_at);
              const now = new Date();
              const diff = now.getTime() - date.getTime();
              return diff <= 7 * 24 * 60 * 60 * 1000;
            }).length}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-400">Last 30 Days</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {subscribers.filter(s => {
              const date = new Date(s.created_at);
              const now = new Date();
              const diff = now.getTime() - date.getTime();
              return diff <= 30 * 24 * 60 * 60 * 1000;
            }).length}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search subscribers..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="border-b border-gray-200 dark:border-gray-700">
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="border-b border-gray-200 dark:border-gray-700">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No subscribers found
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