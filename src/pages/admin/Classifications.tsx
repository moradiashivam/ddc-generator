import React, { useState, useEffect } from 'react';
import { 
  createColumnHelper, 
  flexRender, 
  getCoreRowModel, 
  getSortedRowModel,
  useReactTable,
  type SortingState
} from '@tanstack/react-table';
import { Database, Download, Search, ArrowUpDown, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getClassificationLogs } from '../../lib/storage';

interface Classification {
  id: string;
  inputText: string;
  number: string;
  category: string;
  timestamp: number;
}

const columnHelper = createColumnHelper<Classification>();

export function Classifications() {
  const [classifications, setClassifications] = useState<Classification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchClassifications();
  }, []);

  const fetchClassifications = async () => {
    try {
      const logs = getClassificationLogs();
      const classifications = logs.map(log => ({
        id: log.id,
        inputText: log.inputText,
        number: log.number,
        category: log.category,
        timestamp: log.timestamp
      }));
      setClassifications(classifications);
    } catch (error) {
      console.error('Error fetching classifications:', error);
      toast.error('Failed to load classifications');
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    columnHelper.accessor('inputText', {
      header: 'Input Text',
      cell: (info) => (
        <div className="max-w-xs truncate" title={info.getValue()}>
          {info.getValue()}
        </div>
      )
    }),
    columnHelper.accessor('number', {
      header: 'DDC Number',
      cell: (info) => (
        <span className="font-mono text-blue-600 dark:text-blue-400">
          {info.getValue()}
        </span>
      )
    }),
    columnHelper.accessor('category', {
      header: 'Category'
    }),
    columnHelper.accessor('timestamp', {
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting()}
          className="flex items-center space-x-2"
        >
          <span>Date</span>
          <ArrowUpDown className="w-4 h-4" />
        </button>
      ),
      cell: (info) => (
        <span>{new Date(info.getValue()).toLocaleString()}</span>
      )
    })
  ];

  const filteredData = classifications.filter(classification =>
    classification.inputText.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classification.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classification.number.includes(searchTerm)
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
        ['Input Text', 'DDC Number', 'Category', 'Date'],
        ...classifications.map(c => [
          c.inputText,
          c.number,
          c.category,
          new Date(c.timestamp).toLocaleString()
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'classifications.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Successfully exported classifications');
    } catch (error) {
      console.error('Error exporting classifications:', error);
      toast.error('Failed to export classifications');
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
          Classification History
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
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Classifications</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {classifications.length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-400">Last 24 Hours</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {classifications.filter(c => {
              const date = new Date(c.created_at);
              const now = new Date();
              return now.getTime() - date.getTime() <= 24 * 60 * 60 * 1000;
            }).length}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-400">Average Confidence</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {classifications.length > 0
              ? `${Math.round(
                  (classifications.reduce((acc, c) => acc + c.confidence_score, 0) / 
                  classifications.length) * 100
                )}%`
              : 'N/A'
            }
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-400">Unique Categories</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {new Set(classifications.map(c => c.category)).size}
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
          placeholder="Search classifications..."
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
                    No classifications found
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