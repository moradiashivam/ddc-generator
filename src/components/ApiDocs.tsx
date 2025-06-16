import React, { useState } from 'react';
import { Code, Copy, Check, Terminal, ChevronDown } from 'lucide-react';

export function ApiDocs() {
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = async (text: string, snippetId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSnippet(snippetId);
      setTimeout(() => setCopiedSnippet(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const deepseekExample = `curl -X POST \\
  https://api.deepseek.com/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "deepseek-chat",
    "messages": [
      {
        "role": "system",
        "content": "You are a DDC classification expert. Analyze the provided text and generate a precise Dewey Decimal Classification number, category, and description. Focus on accuracy and adherence to DDC 23rd Edition standards."
      },
      {
        "role": "user",
        "content": "Analyze the following text and provide a Dewey Decimal Classification (DDC). Return ONLY a JSON object with this exact structure, no other text: { \\"number\\": \\"XXX.XX\\", \\"category\\": \\"Category Name\\", \\"description\\": \\"Brief description\\" }\\n\\nText to analyze: YOUR_TEXT_HERE"
      }
    ],
    "temperature": 0.3,
    "max_tokens": 200,
    "response_format": { "type": "json_object" }
  }'`;

  const groqExample = `curl -X POST \\
  https://api.groq.com/openai/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "deepseek-r1-distill-llama-70b",
    "messages": [
      {
        "role": "system",
        "content": "You are a DDC classification expert. Analyze the provided text and generate a precise Dewey Decimal Classification number, category, and description. Focus on accuracy and adherence to DDC 23rd Edition standards."
      },
      {
        "role": "user",
        "content": "Analyze the following text and provide a Dewey Decimal Classification (DDC). Return ONLY a JSON object with this exact structure, no other text: { \\"number\\": \\"XXX.XX\\", \\"category\\": \\"Category Name\\", \\"description\\": \\"Brief description\\" }\\n\\nText to analyze: YOUR_TEXT_HERE"
      }
    ],
    "temperature": 0.3,
    "max_tokens": 200,
    "response_format": { "type": "json_object" }
  }'`;

  const pythonExample = `import requests
import json

def classify_text(api_key: str, text: str, provider: str = 'deepseek') -> dict:
    base_url = "https://api.groq.com/openai/v1" if provider == 'groq' else "https://api.deepseek.com/v1"
    model = "deepseek-r1-distill-llama-70b" if provider == 'groq' else "deepseek-chat"
    
    url = f"{base_url}/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    system_prompt = """You are a DDC classification expert. Analyze the provided text and 
    generate a precise Dewey Decimal Classification number, category, and description. 
    Focus on accuracy and adherence to DDC 23rd Edition standards."""
    
    user_prompt = f"""Analyze the following text and provide a Dewey Decimal Classification (DDC). 
    Return ONLY a JSON object with this exact structure, no other text:
    {{
      "number": "XXX.XX",
      "category": "Category Name",
      "description": "Brief description"
    }}
    
    Text to analyze: {text}"""
    
    data = {
        "model": model,
        "messages": [
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": user_prompt
            }
        ],
        "temperature": 0.3,
        "max_tokens": 200,
        "response_format": { "type": "json_object" }
    }
    
    response = requests.post(url, headers=headers, json=data)
    response.raise_for_status()
    
    result = response.json()
    return json.loads(result["choices"][0]["message"]["content"])

# Example usage
api_key = "YOUR_API_KEY"
text = "Introduction to Computer Programming"
result = classify_text(api_key, text, provider='groq')  # or provider='deepseek'
print(json.dumps(result, indent=2))`;

  const nodeExample = `import OpenAI from 'openai';

async function classifyText(apiKey: string, text: string, provider: 'deepseek' | 'groq' = 'deepseek') {
  const client = new OpenAI({
    apiKey,
    baseURL: provider === 'groq' 
      ? 'https://api.groq.com/openai/v1'
      : 'https://api.deepseek.com/v1',
    dangerouslyAllowBrowser: true
  });

  const model = provider === 'groq' 
    ? 'deepseek-r1-distill-llama-70b'
    : 'deepseek-chat';

  const systemPrompt = \`You are a DDC classification expert. Analyze the provided text and 
  generate a precise Dewey Decimal Classification number, category, and description. 
  Focus on accuracy and adherence to DDC 23rd Edition standards.\`;

  const userPrompt = \`Analyze the following text and provide a Dewey Decimal Classification (DDC). 
  Return ONLY a JSON object with this exact structure, no other text:
  {
    "number": "XXX.XX",
    "category": "Category Name",
    "description": "Brief description"
  }
  
  Text to analyze: \${text}\`;

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        { 
          role: 'user', 
          content: userPrompt 
        }
      ],
      temperature: 0.3,
      max_tokens: 200,
      response_format: { type: 'json_object' }
    });

    return JSON.parse(response.choices[0]?.message?.content || '{}');
  } catch (error) {
    console.error('Classification error:', error);
    throw error;
  }
}

// Example usage
const apiKey = 'YOUR_API_KEY';
const text = 'Introduction to Computer Programming';
classifyText(apiKey, text, 'groq')  // or 'deepseek'
  .then(result => console.log(JSON.stringify(result, null, 2)))
  .catch(error => console.error('Error:', error));`;

  return (
    <div className="w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-8 py-6 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-500/20 dark:bg-purple-500/30 rounded-lg">
            <Code className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            API Documentation
          </h2>
        </div>
        <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        </div>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="px-8 pb-8 space-y-8">
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300">
              The DDC Generator API allows you to programmatically classify texts using either the DeepSeek or Groq API. 
              Below are examples in different programming languages showing how to integrate with both APIs.
            </p>

            <div className="space-y-8">
              {/* cURL Examples */}
              <div className="space-y-6">
                <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
                  <Terminal className="w-5 h-5" />
                  <span>cURL Examples</span>
                </h3>

                {/* DeepSeek Example */}
                <div className="space-y-3">
                  <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">DeepSeek API</h4>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleCopy(deepseekExample, 'deepseek')}
                      className={`p-2 rounded-lg transition-colors ${
                        copiedSnippet === 'deepseek'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                      title={copiedSnippet === 'deepseek' ? 'Copied!' : 'Copy code'}
                    >
                      {copiedSnippet === 'deepseek' ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <pre className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl overflow-x-auto">
                    <code className="text-sm text-gray-800 dark:text-gray-200">{deepseekExample}</code>
                  </pre>
                </div>

                {/* Groq Example */}
                <div className="space-y-3">
                  <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">Groq API</h4>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleCopy(groqExample, 'groq')}
                      className={`p-2 rounded-lg transition-colors ${
                        copiedSnippet === 'groq'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                      title={copiedSnippet === 'groq' ? 'Copied!' : 'Copy code'}
                    >
                      {copiedSnippet === 'groq' ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <pre className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl overflow-x-auto">
                    <code className="text-sm text-gray-800 dark:text-gray-200">{groqExample}</code>
                  </pre>
                </div>
              </div>

              {/* Python Example */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
                    <img src="https://www.python.org/static/community_logos/python-logo-generic.svg" alt="Python" className="h-5" />
                    <span>Python</span>
                  </h3>
                  <button
                    onClick={() => handleCopy(pythonExample, 'python')}
                    className={`p-2 rounded-lg transition-colors ${
                      copiedSnippet === 'python'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                    title={copiedSnippet === 'python' ? 'Copied!' : 'Copy code'}
                  >
                    {copiedSnippet === 'python' ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <pre className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl overflow-x-auto">
                  <code className="text-sm text-gray-800 dark:text-gray-200">{pythonExample}</code>
                </pre>
              </div>

              {/* Node.js Example */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
                    <img src="https://nodejs.org/static/images/logo.svg" alt="Node.js" className="h-5" />
                    <span>Node.js</span>
                  </h3>
                  <button
                    onClick={() => handleCopy(nodeExample, 'node')}
                    className={`p-2 rounded-lg transition-colors ${
                      copiedSnippet === 'node'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                    title={copiedSnippet === 'node' ? 'Copied!' : 'Copy code'}
                  >
                    {copiedSnippet === 'node' ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <pre className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl overflow-x-auto">
                  <code className="text-sm text-gray-800 dark:text-gray-200">{nodeExample}</code>
                </pre>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
              <h4 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2">
                Response Format
              </h4>
              <p className="text-blue-600 dark:text-blue-400 mb-3">
                Both APIs return a JSON object with the following structure:
              </p>
              <pre className="p-4 bg-white dark:bg-gray-900 rounded-lg">
                <code className="text-sm text-gray-800 dark:text-gray-200">{`{
  "number": "005.1",
  "category": "Computer Programming",
  "description": "Resources about computer programming and software development"
}`}</code>
              </pre>
            </div>

            <div className="mt-8 space-y-4">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Rate Limits & Usage
              </h4>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>Rate limits depend on your chosen API provider's plan</li>
                <li>Each request typically processes within 2-5 seconds</li>
                <li>Maximum text length: 4096 tokens (approximately 3000 words)</li>
                <li>Responses are cached for 24 hours to improve performance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}