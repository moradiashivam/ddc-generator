import React from 'react';
import { AlertTriangle } from 'lucide-react';

export function Disclaimer() {
  return (
    <div className="w-full p-4 bg-yellow-50/90 dark:bg-yellow-900/30 backdrop-blur-sm rounded-xl border border-yellow-200 dark:border-yellow-800/50 shadow-sm">
      <div className="flex items-start space-x-3">
        <div className="p-1.5 bg-yellow-100 dark:bg-yellow-800/50 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
        </div>
        <div className="flex-1 text-sm">
          <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
            Accuracy Disclaimer
          </h4>
          <p className="text-yellow-700 dark:text-yellow-400 leading-relaxed">
            While our AI-powered system strives for accuracy in DDC classification, results should be verified by a professional librarian. Classifications provided are suggestions and may require human review for complete accuracy.
          </p>
        </div>
      </div>
    </div>
  );
}