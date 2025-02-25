import React from 'react';
import { Clock, Trash2, XCircle } from 'lucide-react';
import type { HistoryItem } from '../types';

interface HistoryProps {
  items: HistoryItem[];
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export function History({ items, onDelete, onClearAll }: HistoryProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/20 dark:bg-blue-500/30 rounded-lg">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">History</h2>
          <span className="px-3 py-1 text-sm bg-blue-100/50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full font-medium">
            {items.length} items
          </span>
        </div>
        <button
          onClick={onClearAll}
          className="flex items-center space-x-2 px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors"
        >
          <XCircle className="w-4 h-4" />
          <span>Clear All</span>
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="p-5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300 text-transparent bg-clip-text">
                    {item.number}
                  </span>
                  <span className="text-gray-400 dark:text-gray-500">•</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {item.category}
                  </span>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                  <p className="text-gray-700 dark:text-gray-300 line-clamp-2">
                    {item.text}
                  </p>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {new Date(item.timestamp).toLocaleString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              <button
                onClick={() => onDelete(item.id)}
                className="p-2 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30"
                title="Delete from history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}