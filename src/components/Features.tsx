import React from 'react';
import { BookOpen, Zap, History, Lock, Sparkles, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function Features() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI-Powered Classification",
      description: "Accurate DDC numbers generated using advanced AI technology"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Results",
      description: "Get DDC classifications in seconds, not minutes"
    },
    {
      icon: <History className="w-6 h-6" />,
      title: "Search History",
      description: "Keep track of all your previous classifications"
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Secure & Private",
      description: "Your data stays in your browser, always private"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "High Accuracy",
      description: "Precise classifications based on DDC 23rd Edition"
    },
    {
      icon: <Moon className="w-6 h-6" />,
      title: "Dark Mode",
      description: "Comfortable viewing with light and dark themes"
    }
  ];

  return (
    <div className="w-full py-16 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h2 className={`text-3xl font-bold ${
            isDark 
              ? 'text-white'
              : 'text-gray-900'
          }`}>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Powerful Features
            </span>
          </h2>
          <p className={`text-lg ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
            Everything you need for efficient DDC classification
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`
                group relative p-6 rounded-xl transition-all duration-300 
                hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10
                ${isDark 
                  ? 'bg-white/10 hover:bg-white/20 border border-white/20' 
                  : 'bg-white/80 hover:bg-white/90 border border-gray-200'
                }
                backdrop-blur-sm
              `}
            >
              <div className={`
                absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
                ${isDark
                  ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10'
                  : 'bg-gradient-to-br from-blue-500/5 to-purple-500/5'
                }
              `} />
              
              <div className="relative space-y-4">
                <div className={`
                  p-3 rounded-lg w-fit transition-colors duration-300
                  ${isDark
                    ? 'bg-blue-500/20 group-hover:bg-blue-500/30'
                    : 'bg-blue-100 group-hover:bg-blue-200'
                  }
                `}>
                  <div className={`
                    transition-colors duration-300
                    ${isDark
                      ? 'text-blue-400 group-hover:text-blue-300'
                      : 'text-blue-600 group-hover:text-blue-700'
                    }
                  `}>
                    {feature.icon}
                  </div>
                </div>
                
                <h3 className={`
                  text-xl font-semibold transition-colors duration-300
                  ${isDark
                    ? 'text-white group-hover:text-white/90'
                    : 'text-gray-800 group-hover:text-gray-900'
                  }
                `}>
                  {feature.title}
                </h3>
                
                <p className={`
                  transition-colors duration-300
                  ${isDark
                    ? 'text-white/70 group-hover:text-white/80'
                    : 'text-gray-600 group-hover:text-gray-700'
                  }
                `}>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}