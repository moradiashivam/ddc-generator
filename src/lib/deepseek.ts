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
  // Basic validation: check if it's a non-empty string with at least 32 characters
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

// Extract JSON from potential markdown code blocks
function extractJSON(content: string): string {
  // Remove markdown code block syntax if present
  const jsonMatch = content.match(/```(?:json)?\s*({[\s\S]*?})\s*```/);
  if (jsonMatch) {
    return jsonMatch[1].trim();
  }
  return content.trim();
}

// Validate DDC result structure
function validateDDCResult(data: any): boolean {
  if (!data || typeof data !== 'object') {
    console.error('Invalid DDC result: not an object', data);
    return false;
  }

  const { number, category, description } = data;

  if (typeof number !== 'string' || !number.trim()) {
    console.error('Invalid DDC result: missing or invalid number', { number });
    return false;
  }

  if (typeof category !== 'string' || !category.trim()) {
    console.error('Invalid DDC result: missing or invalid category', { category });
    return false;
  }

  if (typeof description !== 'string' || !description.trim()) {
    console.error('Invalid DDC result: missing or invalid description', { description });
    return false;
  }

  // Validates DDC number format (e.g., "020.50")
  const dccNumberPattern = /^\d{3}(\.\d{1,2})?$/;
  if (!dccNumberPattern.test(number.trim())) {
    console.error('Invalid DDC result: number format incorrect', { number });
    return false;
  }

  return true;
}

// Format DDC number to ensure consistency
function formatDDCNumber(number: string): string {
  try {
    const cleaned = number.trim().replace(/[^\d.]/g, '');
    const [main, decimal = ''] = cleaned.split('.');
    const paddedMain = main.padStart(3, '0');
    const paddedDecimal = decimal.padEnd(2, '0');
    return `${paddedMain}.${paddedDecimal}`;
  } catch (e) {
    console.error('Error formatting DDC number:', e);
    throw new Error('Invalid DDC number format');
  }
}

export async function classifyText(text: string): Promise<string> {
  const client = createClient();
  if (!client) throw new Error('Invalid or missing API key. Please check your configuration.');

  const provider = getProvider();
  const model = provider === 'openrouter' ? 'deepseek/deepseek-chat:free' : 'deepseek-chat';

  try {
    const prompt = `Analyze the following text and provide a Dewey Decimal Classification (DDC). Return ONLY a JSON object with this exact structure, no other text:
{
  "number": "XXX.XX",
  "category": "Category Name",
  "description": "Brief description"
}

Text to analyze: ${text}`;

    const response = await client.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are a DDC classification expert. Always respond with valid JSON containing number, category, and description fields. The number must be in XXX.XX format. Do not include markdown code blocks in your response.'
        },
        { 
          role: 'user', 
          content: prompt 
        }
      ],
      temperature: 0.3,
      max_tokens: 400,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response received from the API');
    }

    // Extract JSON from potential markdown code blocks
    const jsonContent = extractJSON(content);

    let parsed: any;
    try {
      parsed = JSON.parse(jsonContent);
    } catch (e) {
      throw new Error('Failed to parse API response as JSON');
    }

    if (!validateDDCResult(parsed)) {
      throw new Error('Invalid DDC classification format');
    }

    // Format the DDC number
    parsed.number = formatDDCNumber(parsed.number);

    return JSON.stringify(parsed);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('401')) {
        throw new Error('Invalid API key. Please check your credentials.');
      } else if (error.message.includes('429')) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
}