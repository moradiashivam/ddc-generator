import React, { useState, useCallback } from 'react';
import { Send, Mic, Copy, Loader2 } from 'lucide-react';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  disabled?: boolean;
  isSignedIn: boolean;
  onSignIn: () => void;
}

export function TextInput({ value, onChange, onSubmit, isLoading, disabled, isSignedIn, onSignIn }: TextInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  const startListening = useCallback(() => {
    if (!isSignedIn) return;
    
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser. Please use Chrome.');
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join(' ');
      onChange(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    setRecognition(recognition);
    recognition.start();
  }, [onChange, isSignedIn]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition]);

  const handleCopy = async () => {
    if (!isSignedIn) return;
    try {
      await navigator.clipboard.writeText(value);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="w-full space-y-2">
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={disabled ? "Please configure your API key first" : "Text to Classify"}
          disabled={disabled}
          className="w-full h-40 p-4 pr-24 text-gray-800 bg-white/95 backdrop-blur-sm border border-sky-200 rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-transparent resize-none disabled:bg-gray-100 disabled:text-gray-500 placeholder:text-gray-500 font-medium shadow-inner"
          style={{
            textShadow: '0 0 1px rgba(0,0,0,0.1)'
          }}
        />
        <div className="absolute right-2 bottom-2 flex space-x-2">
          <button
            type="button"
            onClick={handleCopy}
            className="p-2 text-sky-600 hover:text-sky-800 transition-colors rounded-lg hover:bg-sky-50"
            title="Copy text"
          >
            <Copy className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            disabled={disabled}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isListening
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'text-sky-600 hover:text-sky-800 hover:bg-sky-50'
            }`}
            title={isListening ? "Stop recording" : "Start voice input"}
          >
            {isListening ? (
              <div className="relative">
                <Mic className="w-5 h-5 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              </div>
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
      <button
        onClick={onSubmit}
        disabled={isLoading || !value.trim() || disabled}
        className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg"
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Generating...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <Send className="w-5 h-5" />
            <span className="text-white">Generate DDC Number</span>
          </div>
        )}
      </button>
    </div>
  );
}