import React from 'react';
import { getClassificationLogs } from '../lib/storage';
import { Library, ArrowLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ParticlesBackground } from '../components/ParticlesBackground';

export function ClassificationLog() {
  const { theme } = useTheme();
  const logs = getClassificationLogs();

  return (
    <div className={`min-h-screen relative ${theme}`}>
      <ParticlesBackground />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Library className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-white">Classification Log</h1>
          </div>
          <a
            href="/"
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-lg font-medium text-white/80 mb-2">Total Classifications</h3>
            <p className="text-3xl font-bold text-white">{logs.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-lg font-medium text-white/80 mb-2">Last 24 Hours</h3>
            <p className="text-3xl font-bold text-white">
              {logs.filter(log => Date.now() - log.timestamp < 24 * 60 * 60 * 1000).length}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-lg font-medium text-white/80 mb-2">Most Common Category</h3>
            <p className="text-3xl font-bold text-white">
              {logs.length > 0 
                ? Object.entries(
                    logs.reduce((acc, log) => {
                      acc[log.category] = (acc[log.category] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).sort((a, b) => b[1] - a[1])[0][0]
                : 'N/A'}
            </p>
          </div>
        </div>

        {/* Log Table */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Timestamp</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Input Text</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">DDC Number</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Category</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id} className="border-b border-white/10 hover:bg-white/5">
                    <td className="px-6 py-4 text-white/80">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-white/80">
                      <div className="max-w-md truncate" title={log.inputText}>
                        {log.inputText}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full font-mono">
                        {log.number}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white/80">{log.category}</td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-white/60">
                      No classifications have been made yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}