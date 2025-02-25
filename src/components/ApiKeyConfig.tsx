import React, { useState } from 'react';
import { Key, Save, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { getApiKey, setApiKey, validateApiKey, getProvider, setProvider, type AIProvider } from '../lib/deepseek';

interface ApiKeyConfigProps {
  onSave: () => void;
}

export function ApiKeyConfig({ onSave }: ApiKeyConfigProps) {
  const [key, setKey] = useState(getApiKey() || '');
  const [provider, setProviderState] = useState<AIProvider>(getProvider());
  const [isEditing, setIsEditing] = useState(!getApiKey());
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const handleSave = async () => {
    if (!key.trim()) return;
    
    setError(null);
    setIsSaving(true);
    
    try {
      if (!validateApiKey(key.trim())) {
        throw new Error('Invalid API key format. Please check your key.');
      }
      
      setApiKey(key.trim());
      setProvider(provider);
      setIsEditing(false);
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save API key');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 rounded-xl backdrop-blur-sm border border-green-200/20 dark:border-green-300/10">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-500 rounded-lg">
            <Key className="w-5 h-5 text-white" />
          </div>
          <div className="space-y-1">
            <span className="font-medium text-green-700 dark:text-green-300">
              API Key Configured Successfully
            </span>
            <div className="text-sm text-green-600 dark:text-green-400">
              Using {provider === 'openrouter' ? 'OpenRouter' : 'DeepSeek'} API
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          Remove Key
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6 bg-gradient-to-r from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10 rounded-xl backdrop-blur-sm border border-blue-200/20 dark:border-blue-300/10">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-500 rounded-lg">
          <Key className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
          Configure API Key
        </h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setProviderState('deepseek')}
            className={`flex-1 p-4 rounded-lg border transition-all ${
              provider === 'deepseek'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
            }`}
          >
            <div className="font-medium">DeepSeek API</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">deepseek-chat model</div>
          </button>
          <button
            onClick={() => setProviderState('openrouter')}
            className={`flex-1 p-4 rounded-lg border transition-all ${
              provider === 'openrouter'
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
            }`}
          >
            <div className="font-medium">OpenRouter API</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">deepseek-chat:free model</div>
          </button>
        </div>

        <div className="relative">
          <input
            type={showKey ? 'text' : 'password'}
            value={key}
            onChange={(e) => {
              setKey(e.target.value);
              setError(null);
            }}
            placeholder={`Enter your ${provider === 'openrouter' ? 'OpenRouter' : 'DeepSeek'} API key`}
            className="w-full px-4 py-3 pr-12 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-gray-200 dark:placeholder-gray-400"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Your API key is stored securely in your browser
        </p>
        <button
          onClick={handleSave}
          disabled={!key.trim() || isSaving}
          className="flex items-center px-6 py-2.5 text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/20"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <Save className="w-5 h-5 mr-2" />
          )}
          Save Key
        </button>
      </div>
      {error && (
        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}