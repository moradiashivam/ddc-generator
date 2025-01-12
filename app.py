from flask import Flask, render_template, request, jsonify
import requests
import json
from datetime import datetime
import os
from dotenv import load_dotenv
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Setup rate limiting
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

class DDCClassifier:
    def __init__(self):
        self.api_url = "https://api.deepseek.com/v1/chat/completions"  # Updated to v1 endpoint
        self.system_prompt = """You are a library classification expert specializing in the Dewey Decimal Classification (DDC) system. Your task is to analyze the provided text, which includes details about a book (title, author, and subject), and generate the appropriate DDC number based on the subject matter. Respond ONLY with a JSON object in the following exact format (no additional text, explanations, or deviations):
{
    "ddc_number": "000.0",
    "description": "Brief description"
}"""
    
    def extract_json_from_text(self, text):
        """Extract JSON object from text, handling various formats"""
        try:
            # First try direct JSON parsing
            return json.loads(text)
        except json.JSONDecodeError:
            try:
                # Look for JSON-like structure
                start_idx = text.find('{')
                end_idx = text.rfind('}') + 1
                if start_idx >= 0 and end_idx > start_idx:
                    json_str = text[start_idx:end_idx]
                    return json.loads(json_str)
                raise ValueError("No JSON object found in response")
            except Exception as e:
                print(f"Debug - Failed to parse: {text}")
                raise ValueError(f"Could not extract valid JSON: {str(e)}")

    def generate_classification(self, text, api_key):
        """Generate DDC classification using Deepseek API"""
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }
        
        messages = [
            {
                "role": "system",
                "content": self.system_prompt
            },
            {
                "role": "user",
                "content": f"Classify this text: {text}"
            }
        ]
        
        payload = {
            "model": "deepseek-chat",
            "messages": messages,
            "temperature": 0.1,
            "max_tokens": 150,
            "stream": False
        }
        
        try:
            # Make API request
            response = requests.post(
                self.api_url, 
                headers=headers, 
                json=payload, 
                timeout=10
            )
            
            # Print response for debugging
            print(f"Debug - API Response Status: {response.status_code}")
            print(f"Debug - API Response Headers: {response.headers}")
            print(f"Debug - API Response Text: {response.text[:500]}")  # First 500 chars
            
            response.raise_for_status()
            result = response.json()
            
            # Validate response structure
            if not result.get('choices') or not result['choices'][0].get('message'):
                raise ValueError(f"Invalid API response structure: {result}")
            
            # Get content and parse as JSON
            content = result['choices'][0]['message']['content'].strip()
            print(f"Debug - Content from API: {content}")
            
            classification = self.extract_json_from_text(content)
            
            # Validate classification fields
            if not classification.get('ddc_number') or not classification.get('description'):
                raise ValueError(f"Missing required fields in classification: {classification}")
            
            # Log success (safely)
            try:
                self._log_classification(text[:50], classification['ddc_number'])
            except Exception as log_error:
                print(f"Logging error (non-critical): {log_error}")
            
            return {
                'success': True,
                'data': {
                    'classification': classification,
                    'usage': result.get('usage', {
                        'prompt_tokens': 0,
                        'completion_tokens': 0,
                        'total_tokens': 0
                    })
                }
            }
            
        except requests.exceptions.RequestException as e:
            status_code = getattr(e.response, 'status_code', None)
            
            if status_code == 401:
                error = 'Invalid API key or unauthorized access'
            elif status_code == 429:
                error = 'Rate limit exceeded. Please try again later'
            else:
                error = f'API request failed: {str(e)}'
            
            print(f"Debug - API Error: {error}")
            return {'success': False, 'error': error}
            
        except Exception as e:
            error = f"Classification error: {str(e)}"
            print(f"Debug - Processing Error: {error}")
            return {'success': False, 'error': error}
    
    def _log_classification(self, text_preview, ddc_number):
        """Log successful classifications with UTF-8 encoding"""
        try:
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            safe_preview = text_preview.encode('ascii', 'ignore').decode('ascii')
            log_entry = f"[{timestamp}] Classified: '{safe_preview}...' → DDC: {ddc_number}\n"
            
            with open("classifications.log", "a", encoding="utf-8") as log_file:
                log_file.write(log_entry)
        except Exception as e:
            print(f"Logging error: {e}")
    
    def _log_error(self, error_message):
        """Log errors with UTF-8 encoding"""
        try:
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            safe_message = error_message.encode('ascii', 'ignore').decode('ascii')
            log_entry = f"[{timestamp}] ERROR: {safe_message}\n"
            
            with open("errors.log", "a", encoding="utf-8") as log_file:
                log_file.write(log_entry)
        except Exception as e:
            print(f"Logging error: {e}")

# Initialize classifier
classifier = DDCClassifier()

@app.route('/')
def home():
    """Render the home page"""
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
@limiter.limit("10 per minute")
def generate():
    """Handle DDC generation requests"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
        
        text = data.get('text', '').strip()
        api_key = data.get('api_key', '').strip()
        
        # Validate inputs
        if not text:
            return jsonify({'success': False, 'error': 'Please provide text to classify'}), 400
        if not api_key:
            return jsonify({'success': False, 'error': 'Please provide an API key'}), 400
        
        # Generate classification
        result = classifier.generate_classification(text, api_key)
        
        if not result['success']:
            return jsonify(result), 400
        
        return jsonify(result)
        
    except Exception as e:
        error_msg = f"Request processing error: {str(e)}"
        print(f"Debug - Request Error: {error_msg}")
        return jsonify({'success': False, 'error': error_msg}), 500

@app.errorhandler(429)
def ratelimit_handler(e):
    """Handle rate limit errors"""
    return jsonify({
        'success': False, 
        'error': 'Rate limit exceeded. Please try again later.'
    }), 429

if __name__ == '__main__':
    # Ensure log files exist with UTF-8 encoding
    for filename in ["classifications.log", "errors.log"]:
        try:
            with open(filename, "a", encoding="utf-8") as f:
                pass
        except Exception as e:
            print(f"Error creating {filename}: {e}")
    
    app.run(debug=True)