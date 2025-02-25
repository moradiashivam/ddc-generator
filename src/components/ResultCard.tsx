import React, { useState } from 'react';
import { BookMarked, Save, Copy, Check } from 'lucide-react';
import { SocialShare } from './SocialShare';
import type { DDCResult } from '../types';

interface ResultCardProps {
  result: DDCResult;
  onSave: () => void;
}

export function ResultCard({ result, onSave }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareData = {
    url: window.location.href,
    title: 'DDC Number Generator',
    text: `Check out this DDC classification: ${result.number} - ${result.category}`,
    ddc: result.number,
    category: result.category
  };

  return (
    <div className="w-full p-6 bg-sky-50/90 dark:bg-sky-950/30 backdrop-blur-sm rounded-xl border border-sky-100 dark:border-sky-900/50">
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <h3 className="text-3xl font-mono font-bold text-blue-600 dark:text-blue-400">
                  DDC {result.number}
                </h3>
                <button
                  onClick={handleCopy}
                  className={`p-1.5 rounded-lg transition-all duration-200 ${
                    copied
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                  }`}
                  title={copied ? 'Copied!' : 'Copy DDC number'}
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <span className="px-2 py-1 text-sm bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 rounded-full">
                High Confidence
              </span>
            </div>
            <h4 className="text-xl text-gray-800 dark:text-gray-200">{result.category}</h4>
          </div>
          <button
            onClick={onSave}
            className="p-2 text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 transition-colors"
            title="Save to history"
          >
            <Save className="w-5 h-5" />
          </button>
        </div>

        {/* Social Share Buttons */}
        <div className="pt-4 border-t border-sky-200/50 dark:border-sky-800/50">
          <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
            Share this classification
          </h5>
          <SocialShare data={shareData} />
        </div>
      </div>
    </div>
  );
}