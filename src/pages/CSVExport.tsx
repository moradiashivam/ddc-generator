import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { validateSecretKey } from '../lib/secretLink';
import { FileText, Download, ArrowLeft, AlertTriangle, Lock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ParticlesBackground } from '../components/ParticlesBackground';

export function CSVExport() {
  const { theme } = useTheme();
  const { key } = useParams<{ key: string }>();
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [csvData, setCsvData] = useState<string | null>(null);

  useEffect(() => {
    if (key) {
      const valid = validateSecretKey(key);
      setIsValid(valid);
      
      if (valid) {
        const data = localStorage.getItem('ddc_csv_export');
        setCsvData(data);
      }
    } else {
      setIsValid(false);
    }
  }, [key]);

  const handleDownload = () => {
    if (!csvData) return;
    
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'ddc_classifications.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isValid === null) {
    return (
      <div className={`min-h-screen relative ${theme}`}>
        <ParticlesBackground />
        <div className="max-w-3xl mx-auto px-4 py-16 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className={`min-h-screen relative ${theme}`}>
        <ParticlesBackground />
        <div className="max-w-3xl mx-auto px-4 py-16">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full">
                <Lock className="w-12 h-12 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Invalid Access</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              The link you're trying to access is invalid or has expired.
            </p>
            <RouterLink
              to="/"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Return to Home</span>
            </RouterLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative ${theme}`}>
      <ParticlesBackground />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <RouterLink
            to="/"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </RouterLink>
        </div>
        
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/20 dark:bg-green-500/30 rounded-lg">
              <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              DDC Classifications Export
            </h1>
          </div>
          
          {csvData ? (
            <div className="space-y-6">
              <p className="text-gray-600 dark:text-gray-300">
                This is a secure page containing exported DDC classification data. You can download the CSV file or preview the data below.
              </p>
              
              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors"
              >
                <Download className="w-5 h-5" />
                <span>Download CSV File</span>
              </button>
              
              <div className="space-y-2">
                <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  Preview
                </h2>
                <div className="overflow-x-auto">
                  <pre className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                    {csvData}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-yellow-50 dark:bg-yellow-900/30 rounded-xl">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-300">
                    No Data Available
                  </h3>
                  <p className="text-yellow-700 dark:text-yellow-400 mt-1">
                    No classification data has been exported yet. Please go back to the main application and export your classifications first.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}