document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('ddc-form');
    const generateBtn = document.getElementById('generate-button');
    const processingSteps = document.getElementById('processing-steps');
    const results = document.getElementById('results');
    const errorAlert = document.getElementById('error-alert');
    const progressBar = document.getElementById('progress-bar');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const apiKey = document.getElementById('api-key').value.trim();
        const text = document.getElementById('input-text').value.trim();

        if (!apiKey || !text) {
            showError('Please provide both text and API key');
            return;
        }

        // Start processing
        startProcessing();

        try {
            const response = await fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text, api_key: apiKey })
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error);
            }

            // Update and show results
            updateResults(data.data);
            showResults();

        } catch (error) {
            showError(error.message);
        } finally {
            stopProcessing();
        }
    });

    function startProcessing() {
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<div class="spinner"></div>Processing...';
        errorAlert.classList.add('hidden');
        processingSteps.classList.remove('hidden');
        results.classList.add('hidden');
        progressBar.style.width = '0%';
        
        // Animate progress bar
        setTimeout(() => progressBar.style.width = '30%', 500);
        setTimeout(() => progressBar.style.width = '60%', 1500);
        setTimeout(() => progressBar.style.width = '90%', 2500);
    }

    function stopProcessing() {
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate DDC Number';
        processingSteps.classList.add('hidden');
        progressBar.style.width = '100%';
    }

    function showResults() {
        results.classList.remove('hidden');
    }

    function updateResults(data) {
        document.getElementById('ddc-number').textContent = 
            `DDC Number: ${data.classification.ddc_number}`;
        document.getElementById('ddc-description').textContent = 
            data.classification.description;
        document.getElementById('input-tokens').textContent = 
            data.usage.prompt_tokens;
        document.getElementById('output-tokens').textContent = 
            data.usage.completion_tokens;
        document.getElementById('total-tokens').textContent = 
            data.usage.total_tokens;
    }

    function showError(message) {
        errorAlert.classList.remove('hidden');
        document.getElementById('error-message').textContent = message;
    }
});