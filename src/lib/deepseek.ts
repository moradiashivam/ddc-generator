import OpenAI from 'openai';

const STORAGE_KEY = 'deepseek_api_key';
const PROVIDER_KEY = 'ai_provider';

export type AIProvider = 'deepseek' | 'openrouter';

export function getApiKey(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

export function setApiKey(key: string): void {
  localStorage.setItem(STORAGE_KEY, key);
}

export function getProvider(): AIProvider {
  return (localStorage.getItem(PROVIDER_KEY) as AIProvider) || 'deepseek';
}

export function setProvider(provider: AIProvider): void {
  localStorage.setItem(PROVIDER_KEY, provider);
}

export function validateApiKey(key: string): boolean {
  return typeof key === 'string' && key.trim().length >= 32;
}

function createClient(): OpenAI | null {
  const apiKey = getApiKey();
  const provider = getProvider();
  
  if (!apiKey || !validateApiKey(apiKey)) return null;
  
  if (provider === 'openrouter') {
    return new OpenAI({
      apiKey,
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': window.location.origin,
        'X-Title': 'DDC Generator'
      },
      dangerouslyAllowBrowser: true
    });
  }
  
  return new OpenAI({
    apiKey,
    baseURL: 'https://api.deepseek.com/v1',
    dangerouslyAllowBrowser: true
  });
}

function extractDDCResult(content: string): any {
  try {
    // Debug log
    console.log('Attempting to parse content:', content);
    
    // Try to clean up the content first
    const cleanContent = content.replace(/[\r\n]+/g, ' ').trim();
    
    // Helper function to validate and return parsed object
    const validateAndReturn = (obj: any) => {
      if (isValidDDCFormat(obj)) {
        console.log('Valid DDC format found:', obj);
        return obj;
      }
      return null;
    };

    // First try to parse the content directly
    try {
      const parsed = JSON.parse(cleanContent);
      const result = validateAndReturn(parsed);
      if (result) return result;
    } catch (e) {
      console.log('Direct parse failed:', e);
    }

    // Try to parse block scope format
    try {
      const blockScopeMatch = cleanContent.match(/Block Scope:\s*({[^}]+})/);
      if (blockScopeMatch) {
        const blockScope = JSON.parse(blockScopeMatch[1]);
        if (blockScope.n && Array.isArray(blockScope.n)) {
          for (const item of blockScope.n) {
            const parsed = typeof item === 'string' ? JSON.parse(item) : item;
            const result = validateAndReturn(parsed);
            if (result) return result;
          }
        }
      }
    } catch (e) {
      console.log('Block scope parse failed:', e);
    }

    // Try to parse local scope format
    try {
      const localScopeMatch = cleanContent.match(/Local Scope block\s*:\s*({[^}]+})/);
      if (localScopeMatch) {
        const localScope = JSON.parse(localScopeMatch[1]);
        if (localScope.t) {
          const parsed = typeof localScope.t === 'string' ? JSON.parse(localScope.t) : localScope.t;
          const result = validateAndReturn(parsed);
          if (result) return result;
        }
      }
    } catch (e) {
      console.log('Local scope parse failed:', e);
    }

    // Try to find any JSON objects in the text
    const jsonPattern = /\{(?:[^{}]|(?:\{[^{}]*\}))*\}/g;
    const matches = cleanContent.match(jsonPattern);
    if (matches) {
      for (const match of matches) {
        try {
          const parsed = JSON.parse(match);
          const result = validateAndReturn(parsed);
          if (result) return result;
        } catch (e) {
          console.log('JSON pattern match parse failed:', e);
        }
      }
    }

    console.error('No valid DDC format found in content:', cleanContent);
    throw new Error('Could not extract valid DDC classification. Please try again.');
  } catch (e) {
    console.error('DDC extraction error:', e);
    throw new Error('Could not generate a valid DDC classification. Please try rephrasing your text.');
  }
}

function isValidDDCFormat(obj: any): boolean {
  try {
    // Log the object for debugging
    console.log('Validating object:', JSON.stringify(obj));
    
    // Basic type check
    if (!obj || typeof obj !== 'object') {
      console.log('Invalid object type:', typeof obj);
      return false;
    }
    
    // Check required fields exist (more lenient)
    const hasNumber = obj.number && typeof obj.number === 'string';
    const hasCategory = obj.category && typeof obj.category === 'string';
    const hasDescription = obj.description && typeof obj.description === 'string';
    
    if (!hasNumber || !hasCategory || !hasDescription) {
      console.log(`Missing required fields: ${!hasNumber ? 'number ' : ''}${!hasCategory ? 'category ' : ''}${!hasDescription ? 'description' : ''}`);
      return false;
    }
    
    // More lenient number format check (just ensure it has digits and possibly a decimal)
    const hasDigits = /\d+/.test(obj.number);
    if (!hasDigits) {
      console.log('Invalid DDC number format (no digits found):', obj.number);
      return false;
    }
    
    return true;
  } catch (e) {
    console.error('DDC format validation error:', e);
    return false;
  }
}

function logClassification(text: string, result: any): void {
  try {
    const timestamp = new Date().toISOString();
    const log = {
      timestamp,
      text: text.slice(0, 100) + (text.length > 100 ? '...' : ''),
      number: result.number,
      category: result.category,
      description: result.description
    };
    
    const logs = JSON.parse(localStorage.getItem('ddc_logs') || '[]');
    logs.unshift(log);
    if (logs.length > 1000) logs.length = 1000;
    localStorage.setItem('ddc_logs', JSON.stringify(logs));
  } catch (error) {
    console.error('Classification logging error:', error);
  }
}

function logError(error: string): void {
  try {
    const timestamp = new Date().toISOString();
    const log = {
      timestamp,
      error,
      context: 'DDC Classification'
    };
    
    const errors = JSON.parse(localStorage.getItem('ddc_errors') || '[]');
    errors.unshift(log);
    if (errors.length > 1000) errors.length = 1000;
    localStorage.setItem('ddc_errors', JSON.stringify(errors));
  } catch (error) {
    console.error('Error logging error:', error);
  }
}

export async function classifyText(text: string): Promise<string> {
  const client = createClient();
  if (!client) {
    throw new Error('Invalid or missing API key. Please check your configuration.');
  }
  
  const provider = getProvider();
  const model = provider === 'openrouter' ? 'deepseek/deepseek-chat:free' : 'deepseek-chat';
  
  try {
    console.log('Classifying text:', text.slice(0, 100));
    
    // Improve the system prompt to be more explicit about the format
    const systemPrompt = `You are a DDC classification expert. Analyze the text and provide a Dewey Decimal Classification.
Always respond with a valid JSON object containing exactly these fields:
1. "number" (in the exact format provided by the DDC system, preserving all digits and decimal places)
2. "category" (main subject area)
3. "description" (brief explanation)

Example of valid responses:
{"number": "123.45", "category": "Philosophy", "description": "Specific philosophical concept"}
{"number": "900", "category": "History & Geography", "description": "General history"}
{"number": "005", "category": "Computer Programming", "description": "Computer programming resources"}
{"number": "330.0724", "category": "Economics", "description": "Experimental economics methods"}

DO NOT modify the DDC number format in any way - preserve all digits and decimal places exactly as specified in the DDC system.
DO NOT include any additional text, explanations, or markdown formatting.`;
    
    // Add timeout and retry logic
    const fetchWithTimeout = async (retryCount = 0) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        const response = await client.chat.completions.create({
          model,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: `Analyze this text and provide a Dewey Decimal Classification:\n\n${text}`
            }
          ],
          temperature: 0.4,
          max_tokens: 200,
          response_format: { type: 'json_object' }
        });
        
        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        if (retryCount < 2) { // Try up to 3 times (initial + 2 retries)
          console.log(`API request failed, retrying (${retryCount + 1}/2)...`);
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
          return fetchWithTimeout(retryCount + 1);
        }
        throw error;
      }
    };
    
    const response = await fetchWithTimeout();
    
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response received from the API');
    }
    
    console.log('Raw API response:', content);
    
    const result = extractDDCResult(content);
    
    // Log successful classification
    logClassification(text, result);
    
    return JSON.stringify(result);
  } catch (error) {
    let errorMessage = 'An unexpected error occurred';
    
    if (error instanceof Error) {
      console.error('Full error object:', error);
      
      // Fix: Check if error.message exists and is a string before using includes()
      if (typeof error.message === 'string') {
        if (error.message.includes('401')) {
          errorMessage = 'Invalid API key. Please check your credentials.';
        } else if (error.message.includes('429')) {
          errorMessage = 'Rate limit exceeded. Please try again later.';
        } else if (error.message.includes('abort')) {
          errorMessage = 'Request timed out. Please try again.';
        } else {
          errorMessage = error.message;
        }
      }
    }
    
    console.error('Classification error:', errorMessage);
    logError(errorMessage);
    throw new Error(errorMessage);
  }
}

// Add these helper functions for improved debugging
export function testDDCValidation(obj: any): boolean {
  console.log('Testing DDC validation for:', obj);
  return isValidDDCFormat(obj);
}

export function testDDCExtraction(content: string): any {
  console.log('Testing DDC extraction for:', content);
  try {
    return extractDDCResult(content);
  } catch (e) {
    console.error('Extraction test error:', e);
    return null;
  }
}