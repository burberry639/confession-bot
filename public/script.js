document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('confessionForm');
    const messageTextarea = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    const submitBtn = form.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');
    const confessionIdSpan = document.getElementById('confessionId');
    const errorMessageP = document.getElementById('errorMessage');

    // Character counter
    messageTextarea.addEventListener('input', function() {
        const currentLength = this.value.length;
        charCount.textContent = currentLength;
        
        if (currentLength >= 1000) {
            charCount.style.color = '#dc3545';
        } else if (currentLength >= 800) {
            charCount.style.color = '#ffc107';
        } else {
            charCount.style.color = '#999';
        }
    });

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const message = messageTextarea.value.trim();
        
        if (!message) {
            showError('Veuillez entrer un message.');
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline';
        resultDiv.style.display = 'none';
        errorDiv.style.display = 'none';

        try {
            const response = await fetch('/api/confession', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });

            const data = await response.json();

            if (response.ok) {
                // Show success
                confessionIdSpan.textContent = data.confessionId;
                resultDiv.style.display = 'block';
                resultDiv.className = 'result success';
                errorDiv.style.display = 'none';
                
                // Reset form
                form.reset();
                charCount.textContent = '0';
            } else {
                showError(data.error || 'Une erreur est survenue lors de l\'envoi.');
            }
        } catch (error) {
            console.error('Error:', error);
            showError('Erreur de connexion au serveur. Veuillez réessayer.');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
        }
    });

    function showError(message) {
        errorMessageP.textContent = message;
        errorDiv.style.display = 'block';
        resultDiv.style.display = 'none';
    }
});
