import React, { useState, useEffect } from 'react';
import { Library, Github, LogOut, User } from 'lucide-react';
import { TextInput } from './components/TextInput';
import { ResultCard } from './components/ResultCard';
import { History } from './components/History';
import { ApiKeyConfig } from './components/ApiKeyConfig';
import { ParticlesBackground } from './components/ParticlesBackground';
import { ThemeToggle } from './components/ThemeToggle';
import { Footer } from './components/Footer';
import { Features } from './components/Features';
import { SocialShare } from './components/SocialShare';
import { Disclaimer } from './components/Disclaimer';
import { ApiDocs } from './components/ApiDocs';
import { BulkClassification } from './components/BulkClassification';
import { Feedback } from './components/Feedback';
import { ExportCSV } from './components/ExportCSV';
import { NewsletterSubscribe } from './components/NewsletterSubscribe';
import { TestimonialSlider } from './components/TestimonialSlider';
import { AuthModal } from './components/AuthModal';
import { useTheme } from './context/ThemeContext';
import { classifyText, getApiKey } from './lib/deepseek';
import { saveClassificationLog } from './lib/storage';
import { supabase } from './lib/supabase';
import type { DDCResult, HistoryItem, ErrorState } from './types';
import toast from 'react-hot-toast';

const HISTORY_STORAGE_KEY = 'ddc_history';
const NOTIFICATION_SHOWN_KEY = 'github_notification_shown';

function App() {
  const { theme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DDCResult | null>(null);
  const [error, setError] = useState<ErrorState | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [hasApiKey, setHasApiKey] = useState(Boolean(getApiKey()));
  const [showGithubPopup, setShowGithubPopup] = useState(() => {
    return localStorage.getItem(NOTIFICATION_SHOWN_KEY) !== 'true';
  });

  const shareData = {
    url: window.location.href,
    title: 'DDC Number Generator - AI-Powered Dewey Decimal Classification',
    text: 'Check out this amazing DDC Number Generator that uses AI to classify library materials!'
  };

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          setIsSignedIn(true);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          setIsSignedIn(true);
        } else {
          setUser(null);
          setIsSignedIn(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const handleSubmit = async () => {
    if (!text.trim() || !hasApiKey) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await classifyText(text);
      const ddc = JSON.parse(response) as DDCResult;
      setResult(ddc);

      // Save to classification log only if user is signed in
      if (isSignedIn) {
        try {
          await saveClassificationLog({
            inputText: text,
            number: ddc.number,
            category: ddc.category
          });
        } catch (saveError) {
          console.error('Failed to save classification log:', saveError);
          // Don't show error to user as the classification still worked
        }
      }

      if (showGithubPopup) {
        localStorage.setItem(NOTIFICATION_SHOWN_KEY, 'true');
      }
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'An unexpected error occurred',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!result) return;

    const historyItem: HistoryItem = {
      ...result,
      id: crypto.randomUUID(),
      text,
      timestamp: Date.now()
    };

    setHistory(prev => [historyItem, ...prev]);
  };

  const handleDeleteHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history? This cannot be undone.')) {
      setHistory([]);
    }
  };

  const handleSignIn = () => {
    setShowAuthModal(true);
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  return (
    <div className={`min-h-screen relative ${theme}`}>
      <ParticlesBackground />
      <ThemeToggle />
      <Feedback />
      
      {/* Auth Button */}
      <div className="fixed top-4 left-4 z-50">
        {isSignedIn && user ? (
          <div className="flex items-center space-x-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {user.user_metadata?.name || user.email}
              </span>
            </div>
            <button
              onClick={handleSignOut}
              className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleSignIn}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white transition-all duration-200 hover:scale-105"
          >
            <User className="w-5 h-5" />
            <span>Sign In</span>
          </button>
        )}
      </div>
      
      {showGithubPopup && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-down">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-xl shadow-xl backdrop-blur-sm flex items-center space-x-4">
            <Github className="w-6 h-6" />
            <div>
              <p className="font-medium">Like this project? Check it out on GitHub!</p>
              <a
                href="https://github.com/moradiashivam/ddc-generator"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-100 hover:text-white transition-colors underline"
              >
                github.com/moradiashivam/ddc-generator
              </a>
            </div>
            <button
              onClick={() => {
                setShowGithubPopup(false);
                localStorage.setItem(NOTIFICATION_SHOWN_KEY, 'true');
              }}
              className="text-blue-200 hover:text-white transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 relative">
        {/* Header */}
        <div className="text-center space-y-4 relative">
          <div className="inline-block px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-sm">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-2" style={{
              textShadow: theme === 'light' 
                ? '0 2px 4px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.2)' 
                : '0 2px 4px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.1)'
            }}>
              DDC Number Generator
            </h1>
            <p className="text-lg font-medium text-gray-800 dark:text-white mb-4" style={{
              textShadow: theme === 'light'
                ? '0 1px 2px rgba(0,0,0,0.3)'
                : '0 1px 2px rgba(0,0,0,0.2)'
            }}>
              Intelligent Dewey Decimal Classification using AI
            </p>
            
            {/* Social Share Buttons */}
            <div className="mt-6 flex justify-center">
              <SocialShare 
                data={shareData} 
                className="scale-90 transform origin-top"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <ApiKeyConfig onSave={() => setHasApiKey(true)} />
          </div>

          {/* Add Disclaimer here */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <Disclaimer />
          </div>

          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 space-y-6">
            <TextInput
              value={text}
              onChange={setText}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              disabled={!hasApiKey}
              isSignedIn={isSignedIn}
              onSignIn={handleSignIn}
            />

            {error && (
              <div className="p-4 bg-red-50/90 dark:bg-red-900/30 backdrop-blur-sm border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-200">
                {error.message}
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <h2 className="flex items-center space-x-2 text-lg font-semibold text-gray-700 dark:text-gray-200">
                  <Library className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>Classification Results</span>
                </h2>
                <ResultCard result={result} onSave={handleSave} />
                
                {/* Processing Statistics */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3">Processing Statistics</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm p-4 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-300">Input Tokens</div>
                      <div className="text-xl font-semibold text-gray-800 dark:text-gray-100">{text.split(/\s+/).length}</div>
                    </div>
                    <div className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm p-4 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-300">Output Tokens</div>
                      <div className="text-xl font-semibold text-gray-800 dark:text-gray-100">29</div>
                    </div>
                    <div className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm p-4 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-300">Total Tokens</div>
                      <div className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                        {text.split(/\s+/).length + 29}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CSV Export Component */}
          {isSignedIn && <ExportCSV />}

          {/* Bulk Classification */}
          {isSignedIn && <BulkClassification />}

          {history.length > 0 && (
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
              <History 
                items={history} 
                onDelete={handleDeleteHistory}
                onClearAll={handleClearHistory}
              />
            </div>
          )}

          {/* API Documentation Section */}
          <ApiDocs />
        </div>
      </div>

      {/* GitHub Project Link */}
      <div className="max-w-3xl mx-auto px-4 mb-8">
        <a
          href="https://github.com/moradiashivam/ddc-generator"
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transform hover:-translate-y-1 transition-all duration-300 rounded-xl overflow-hidden shadow-lg group"
        >
          <div className="px-6 py-4 flex items-center justify-between backdrop-blur-sm">
            <div className="flex items-center space-x-4">
              <Github className="w-8 h-8 text-white" />
              <div>
                <h3 className="text-lg font-semibold text-white">View Project on GitHub</h3>
                <p className="text-blue-100 group-hover:text-white transition-colors">
                  github.com/moradiashivam/ddc-generator
                </p>
              </div>
            </div>
            <div className="text-white opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
              →
            </div>
          </div>
        </a>
      </div>

      <div className="max-w-3xl mx-auto px-4 mb-8">
        <NewsletterSubscribe />
      </div>
      <Features />
      <TestimonialSlider />
      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}

export default App;