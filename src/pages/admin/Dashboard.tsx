import React, { useState, useEffect } from 'react';
import { 
  Users as UsersIcon, 
  BookOpen, 
  TrendingUp,
  Activity,
  Loader2
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format, subDays } from 'date-fns';
import { getClassificationLogs } from '../../lib/storage';
import type { ClassificationLog } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function Dashboard() {
  const [logs, setLogs] = useState<ClassificationLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const data = await getClassificationLogs();
        setLogs(data);
      } catch (error) {
        console.error('Error fetching logs:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLogs();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // Calculate statistics
  const totalClassifications = logs.length;
  const last24Hours = logs.filter(log => 
    Date.now() - log.timestamp < 24 * 60 * 60 * 1000
  ).length;

  // Prepare chart data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    const count = logs.filter(log => {
      const logDate = new Date(log.timestamp);
      return (
        logDate.getDate() === date.getDate() &&
        logDate.getMonth() === date.getMonth() &&
        logDate.getFullYear() === date.getFullYear()
      );
    }).length;
    return { date, count };
  }).reverse();

  const chartData = {
    labels: last7Days.map(day => format(day.date, 'MMM d')),
    datasets: [
      {
        label: 'Classifications',
        data: last7Days.map(day => day.count),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  const stats = [
    {
      icon: <UsersIcon className="w-6 h-6 text-blue-600" />,
      label: 'Total Users',
      value: '2' // Mock data since Clerk is removed
    },
    {
      icon: <BookOpen className="w-6 h-6 text-green-600" />,
      label: 'Total Classifications',
      value: totalClassifications.toString()
    },
    {
      icon: <Activity className="w-6 h-6 text-purple-600" />,
      label: 'Last 24 Hours',
      value: last24Hours.toString()
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-orange-600" />,
      label: 'Success Rate',
      value: '99.8%'
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Dashboard Overview
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Classification Activity
        </h2>
        <div className="h-[300px]">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}