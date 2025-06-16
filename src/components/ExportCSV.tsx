import React, { useState } from 'react';
import { Download, Link, Copy, Check, FileText } from 'lucide-react';
import { getClassificationLogs } from '../lib/storage';
import { generateSecretLink, getSecretKey } from '../lib/secretLink';

export function ExportCSV() {
  const [copied, setCopied] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const secretKey = getSecretKey();
  const secretLink = `https://ai-dewey.netlify.app/csv-export/${secretKey}`;

  const handleExport = () => {
    const logs = getClassificationLogs();
    if (logs.length === 0) {
      alert('No classifications to export');
      return;
    }

    // Convert logs to CSV format
    const csvContent = convertToCSV(logs);
    
    // Save to localStorage for access via secret link
    localStorage.setItem('ddc_csv_export', csvContent);
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'ddc_classifications.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setShowLink(true);
  };

  const convertToCSV = (logs) => {
    // CSV header
    let csv = 'Input Text,DDC Number,Category,Timestamp\n';
    
    // Add each log as a row
    logs.forEach(log => {
      // Clean the input text (remove commas to prevent CSV parsing issues)
      const cleanText = log.inputText.replace(/,/g, ' ');
      
      // Format the date
      const date = new Date(log.timestamp).toLocaleString();
      
      // Add the row
      csv += `"${cleanText}","${log.number}","${log.category}","${date}"\n`;
    });
    
    return csv;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(secretLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div className="w-full space-y-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-green-500/20 dark:bg-green-500/30 rounded-lg">
          <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Export Classifications</h2>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300">
        Export all your classification data to a CSV file. You can also generate a secret link to share this data with others.
      </p>
      
      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleExport}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          <Download className="w-5 h-5" />
          <span>Export to CSV</span>
        </button>
        
        {showLink && (
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Secret Link (Anyone with this link can access your classifications)
            </div>
            <div className="flex items-center">
              <div className="flex-1 min-w-0 p-2 bg-gray-100 dark:bg-gray-700 rounded-l-lg">
                <p className="truncate text-gray-800 dark:text-gray-200 font-mono text-sm">
                  {secretLink}
                </p>
              </div>
              <button
                onClick={handleCopyLink}
                className={`p-2 rounded-r-lg transition-colors ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                }`}
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {showLink && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-700 dark:text-blue-300 text-sm">
          <div className="flex items-start space-x-2">
            <Link className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Secret Link Generated</p>
              <p>This link provides access to your classification data in CSV format. Share it only with trusted individuals.</p>
              <p className="mt-2">The link will work as long as you use this browser and don't clear your local storage.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}