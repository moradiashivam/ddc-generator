import React, { useState, useEffect } from 'react';
import { Facebook, Twitter, Linkedin, Share2, Send } from 'lucide-react';

interface ShareData {
  url: string;
  title: string;
  text: string;
  ddc?: string;
  category?: string;
}

interface SocialShareProps {
  data: ShareData;
  className?: string;
}

export function SocialShare({ data, className = '' }: SocialShareProps) {
  const [shares, setShares] = useState({
    facebook: 0,
    twitter: 0,
    linkedin: 0,
    whatsapp: 0
  });
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // Simulate share counts - in production, you'd fetch real counts from an API
  useEffect(() => {
    setShares({
      facebook: Math.floor(Math.random() * 100),
      twitter: Math.floor(Math.random() * 50),
      linkedin: Math.floor(Math.random() * 30),
      whatsapp: Math.floor(Math.random() * 20)
    });
  }, []);

  const shareText = data.ddc 
    ? `Check out this DDC classification: ${data.ddc} - ${data.category}`
    : data.text;

  const showTemporaryTooltip = (message: string) => {
    setShowTooltip(message);
    setTimeout(() => setShowTooltip(null), 2000);
  };

  const handleShare = async (platform: string) => {
    const shareData = {
      title: data.title,
      text: shareText,
      url: window.location.href
    };

    try {
      switch (platform) {
        case 'facebook':
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}&quote=${encodeURIComponent(shareData.text)}`,
            'facebook-share',
            'width=580,height=296'
          );
          showTemporaryTooltip('Opened Facebook share dialog');
          break;

        case 'twitter':
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`,
            'twitter-share',
            'width=550,height=235'
          );
          showTemporaryTooltip('Opened Twitter share dialog');
          break;

        case 'linkedin':
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}`,
            'linkedin-share',
            'width=580,height=296'
          );
          showTemporaryTooltip('Opened LinkedIn share dialog');
          break;

        case 'whatsapp':
          window.open(
            `https://wa.me/?text=${encodeURIComponent(`${shareData.text} ${shareData.url}`)}`,
            '_blank'
          );
          showTemporaryTooltip('Opened WhatsApp share dialog');
          break;

        case 'native':
          if (navigator.share) {
            try {
              await navigator.share(shareData);
              showTemporaryTooltip('Shared successfully!');
            } catch (error) {
              if (error instanceof Error && error.name !== 'AbortError') {
                // Show fallback buttons if share fails
                showTemporaryTooltip('Please use the social media buttons to share');
              }
            }
          } else {
            // Show fallback message if Web Share API is not available
            showTemporaryTooltip('Please use the social media buttons to share');
          }
          break;
      }

      // Update share count (simulated)
      setShares(prev => ({
        ...prev,
        [platform]: prev[platform as keyof typeof prev] + 1
      }));
    } catch (error) {
      console.error('Error sharing:', error);
      showTemporaryTooltip('Please try again later');
    }
  };

  const buttons = [
    {
      platform: 'facebook',
      icon: <Facebook className="w-5 h-5" />,
      label: 'Share on Facebook',
      color: 'bg-[#1877F2] hover:bg-[#0d6aed]',
      count: shares.facebook
    },
    {
      platform: 'twitter',
      icon: <Twitter className="w-5 h-5" />,
      label: 'Share on Twitter',
      color: 'bg-[#1DA1F2] hover:bg-[#0c90e2]',
      count: shares.twitter
    },
    {
      platform: 'linkedin',
      icon: <Linkedin className="w-5 h-5" />,
      label: 'Share on LinkedIn',
      color: 'bg-[#0A66C2] hover:bg-[#0958a8]',
      count: shares.linkedin
    },
    {
      platform: 'whatsapp',
      icon: <Send className="w-5 h-5" />,
      label: 'Share on WhatsApp',
      color: 'bg-[#25D366] hover:bg-[#1fb855]',
      count: shares.whatsapp
    }
  ];

  return (
    <div className={`flex flex-wrap gap-3 ${className}`} role="group" aria-label="Share on social media">
      {buttons.map(({ platform, icon, label, color, count }) => (
        <button
          key={platform}
          onClick={() => handleShare(platform)}
          className={`
            relative group flex items-center space-x-2 px-4 py-2 rounded-lg
            ${color} text-white transition-all duration-200
            transform hover:scale-105 hover:shadow-lg
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          `}
          aria-label={label}
        >
          {icon}
          <span className="text-sm font-medium">{count}</span>
          
          {/* Tooltip */}
          <span className="
            absolute -top-10 left-1/2 transform -translate-x-1/2
            px-3 py-1 text-xs font-medium text-white bg-gray-900 rounded-lg
            opacity-0 group-hover:opacity-100 transition-opacity duration-200
            pointer-events-none whitespace-nowrap
          ">
            {label}
          </span>
        </button>
      ))}

      {/* Native Share Button (Mobile) */}
      {navigator.share && (
        <button
          onClick={() => handleShare('native')}
          className="
            relative flex items-center space-x-2 px-4 py-2 rounded-lg
            bg-gradient-to-r from-purple-600 to-pink-600 text-white
            hover:from-purple-700 hover:to-pink-700
            transform hover:scale-105 transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500
          "
          aria-label="Share"
        >
          <Share2 className="w-5 h-5" />
          <span className="text-sm font-medium">Share</span>
        </button>
      )}

      {/* Global Tooltip for Status Messages */}
      {showTooltip && (
        <div className="
          fixed bottom-4 left-1/2 transform -translate-x-1/2
          px-4 py-2 bg-gray-900 text-white rounded-lg
          text-sm font-medium shadow-lg
          animate-fade-in-up
        ">
          {showTooltip}
        </div>
      )}
    </div>
  );
}