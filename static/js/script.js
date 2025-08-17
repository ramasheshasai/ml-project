// DOM elements
const form = document.getElementById('predictionForm');
const predictBtn = document.getElementById('predictBtn');
const loadingSpinner = document.querySelector('.loading');
const btnText = document.querySelector('.btn-text');
const resultsSection = document.getElementById('resultsSection');

// Stock data for enhanced UI
const stockData = {
    'MSFT': { name: 'Microsoft Corporation', color: '#00BCF2' },
    'AMZN': { name: 'Amazon.com Inc.', color: '#FF9900' },
    'DSNY': { name: 'The Walt Disney Company', color: '#113CCF' },
    'META': { name: 'Meta Platforms Inc.', color: '#1877F2' },
    'NIKE': { name: 'Nike Inc.', color: '#111111' },
    'RELI': { name: 'Reliance Industries', color: '#ED1C24' },
    'TSLA': { name: 'Tesla Inc.', color: '#CC0000' },
    'NVDA': { name: 'NVIDIA Corporation', color: '#76B900' }
};

// Form validation
function validateForm() {
    const stock = document.getElementById('stock').value;
    const date = document.getElementById('Date').value;
    
    if (!stock) {
        showNotification('Please select a stock', 'error');
        return false;
    }
    
    if (!date) {
        showNotification('Please enter a future date', 'error');
        return false;
    }
    
    // Validate date format (MM/DD/YYYY)
    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
    if (!dateRegex.test(date)) {
        showNotification('Please enter date in MM/DD/YYYY format', 'error');
        return false;
    }
    
    // Check if date is in the future
    const inputDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (inputDate <= today) {
        showNotification('Please enter a future date', 'error');
        return false;
    }
    
    return true;
}

// Show loading state
function showLoading() {
    predictBtn.disabled = true;
    btnText.style.display = 'none';
    loadingSpinner.classList.add('active');
}

// Hide loading state
function hideLoading() {
    predictBtn.disabled = false;
    btnText.style.display = 'block';
    loadingSpinner.classList.remove('active');
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'error' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️'}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#fee' : type === 'success' ? '#efe' : '#eef'};
        color: ${type === 'error' ? '#c53030' : type === 'success' ? '#38a169' : '#3182ce'};
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        border-left: 4px solid ${type === 'error' ? '#f56565' : type === 'success' ? '#48bb78' : '#4299e1'};
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Display results
function displayResult(data, isError = false) {
    resultsSection.innerHTML = '';
    
    const resultCard = document.createElement('div');
    resultCard.className = `result-card ${isError ? 'result-error' : 'result-success'} fade-in`;
    
    if (isError) {
        resultCard.innerHTML = `
            <div class="result-title">❌ Prediction Error</div>
            <div class="result-content">${data}</div>
        `;
    } else {
        const stock = document.getElementById('stock').value;
        const date = document.getElementById('Date').value;
        const stockInfo = stockData[stock];
        
        resultCard.innerHTML = `
            <div class="result-title">📈 Prediction Result</div>
            <div class="result-content">
                <div style="margin-bottom: 1rem;">
                    <strong>${stockInfo.name} (${stock})</strong>
                </div>
                <div style="color: #718096; margin-bottom: 1rem;">
                    Predicted price for ${date}
                </div>
                <div class="price-highlight" style="color: ${stockInfo.color};">
                    ${data}
                </div>
                <div style="font-size: 0.9rem; color: #a0aec0; margin-top: 1rem;">
                    <em>⚠️ This prediction is for educational purposes only and should not be used as investment advice.</em>
                </div>
            </div>
        `;
    }
    
    resultsSection.appendChild(resultCard);
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Handle form submission
form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    showLoading();
    
    try {
        const formData = new FormData(form);
        const response = await fetch('/predict', {
            method: 'POST',
            body: formData
        });
        
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Check for prediction result
        const predictionElement = doc.querySelector('[data-prediction]');
        const errorElement = doc.querySelector('[data-error]');
        
        if (predictionElement) {
            const prediction = predictionElement.textContent.trim();
            displayResult(prediction, false);
            showNotification('Prediction completed successfully!', 'success');
        } else if (errorElement) {
            const error = errorElement.textContent.trim();
            displayResult(error, true);
            showNotification('Prediction failed. Please try again.', 'error');
        } else {
            // Fallback: look for prediction or error in the response
            if (html.includes('Predicted price')) {
                const match = html.match(/Predicted price[^$]*\$[\d,]+\.?\d*/);
                if (match) {
                    displayResult(match[0], false);
                    showNotification('Prediction completed successfully!', 'success');
                }
            } else if (html.includes('style="color:red;"')) {
                const errorMatch = html.match(/<h2 style="color:red;">([^<]+)<\/h2>/);
                if (errorMatch) {
                    displayResult(errorMatch[1], true);
                    showNotification('Prediction failed. Please try again.', 'error');
                }
            }
        }
    } catch (error) {
        console.error('Error:', error);
        displayResult('Network error. Please check your connection and try again.', true);
        showNotification('Network error occurred', 'error');
    } finally {
        hideLoading();
    }
});

// Date input formatting
document.getElementById('Date').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2);
    }
    if (value.length >= 5) {
        value = value.substring(0, 5) + '/' + value.substring(5, 9);
    }
    
    e.target.value = value;
});

// Stock selection enhancement
document.getElementById('stock').addEventListener('change', function(e) {
    const selectedStock = e.target.value;
    if (selectedStock && stockData[selectedStock]) {
        const stockInfo = stockData[selectedStock];
        showNotification(`Selected: ${stockInfo.name}`, 'info');
    }
});

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-icon {
        font-size: 1.2rem;
    }
    
    .notification-message {
        font-weight: 500;
    }
`;
document.head.appendChild(notificationStyles);

// Initialize tooltips and enhanced interactions
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling for better UX
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add focus management for accessibility
    const inputs = document.querySelectorAll('input, select, button');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            form.dispatchEvent(new Event('submit'));
        }
    });
});