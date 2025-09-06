import React, { useState } from 'react';
import { Mail, Loader2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export function NewsletterSubscribe() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isLoading) return;

    setIsLoading(true);
    try {
      // Store newsletter subscription locally
      const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
      if (subscribers.includes(email)) {
        throw new Error('This email is already subscribed');
      }
      subscribers.push(email);
      localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
      
      setIsSuccess(true);
      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
      // Reset success state after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to subscribe');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/10">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-blue-500/20 dark:bg-blue-500/30 rounded-lg">
          <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Subscribe to Our Newsletter
        </h3>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Stay updated with the latest DDC classification tips, features, and updates.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading || isSuccess}
          />
          {isSuccess && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || isSuccess || !email}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Subscribing...</span>
            </>
          ) : isSuccess ? (
            'Subscribed!'
          ) : (
            'Subscribe Now'
          )}
        </button>
      </form>
    </div>
  );
}