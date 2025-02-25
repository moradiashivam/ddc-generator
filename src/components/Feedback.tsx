import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, ExternalLink, X } from 'lucide-react';

const FEEDBACK_HIDDEN_KEY = 'ddc_feedback_hidden';

export function Feedback() {
  const [showFeedback, setShowFeedback] = useState(() => {
    return localStorage.getItem(FEEDBACK_HIDDEN_KEY) !== 'true';
  });
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const handlePositiveFeedback = () => {
    window.open('https://github.com/moradiashivam/ddc-generator', '_blank');
    setFeedbackGiven(true);
    setShowFeedback(false);
  };

  const handleNegativeFeedback = () => {
    window.open('https://forms.gle/SF5msK7WHKU9MSBN8', '_blank');
    setFeedbackGiven(true);
    setShowFeedback(false);
  };

  const handleDontShowAgain = () => {
    localStorage.setItem(FEEDBACK_HIDDEN_KEY, 'true');
    setShowFeedback(false);
  };

  const handleClose = () => {
    setShowFeedback(false);
  };

  if (!showFeedback) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700 relative">
        <button
          onClick={handleClose}
          className="absolute -top-2 -right-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            How's your experience with DDC Generator?
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePositiveFeedback}
              className="flex items-center space-x-2 px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>It's Great!</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </button>
            <button
              onClick={handleNegativeFeedback}
              className="flex items-center space-x-2 px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              <ThumbsDown className="w-4 h-4" />
              <span>Needs Work</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </button>
          </div>
          
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleDontShowAgain}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              Don't show again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}