const apiKeyInput = document.getElementById('api-key-input');
const saveApiKeyBtn = document.getElementById('save-api-key-btn');
const clearApiKeyBtn = document.getElementById('clear-api-key-btn');
const apiKeySection = document.getElementById('api-key-section');
const recipeForm = document.getElementById('recipe-form');
const recipeOutput = document.getElementById('recipe-output');
const apiKeyMessage = document.getElementById('api-key-message');

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedApiKey = localStorage.getItem('recipeApiKey');
    
    if (savedApiKey) {
        // API key exists, show recipe form
        apiKeySection.style.display = 'none';
        recipeForm.style.display = 'block';
        clearApiKeyBtn.style.display = 'inline-block';
    } else {
        // No API key, show API key setup section
        apiKeySection.style.display = 'block';
        recipeForm.style.display = 'none';
        clearApiKeyBtn.style.display = 'none';
    }
});

// Save API Key
saveApiKeyBtn.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    
    if (!apiKey) {
        showMessage('Please enter an API key', 'error');
        return;
    }
    
    // Save to localStorage
    localStorage.setItem('recipeApiKey', apiKey);
    
    showMessage('API Key saved successfully!', 'success');
    
    // Clear input
    apiKeyInput.value = '';
    
    // Show recipe form after 1 second
    setTimeout(() => {
        apiKeySection.style.display = 'none';
        recipeForm.style.display = 'block';
        clearApiKeyBtn.style.display = 'inline-block';
        apiKeyMessage.style.display = 'none';
    }, 1000);
});

// Clear API Key
clearApiKeyBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the saved API key?')) {
        localStorage.removeItem('recipeApiKey');
        apiKeySection.style.display = 'block';
        recipeForm.style.display = 'none';
        clearApiKeyBtn.style.display = 'none';
        recipeOutput.innerHTML = '';
        showMessage('API Key cleared. Please enter a new one.', 'success');
    }
});

// Handle recipe form submission
recipeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const ingredients = document.getElementById('ingredients').value.trim();
    const taste = document.getElementById('taste').value;
    const cuisine = document.getElementById('cuisine').value;
    
    if (!ingredients) {
        showMessage('Please enter ingredients', 'error');
        return;
    }
    
    // Get API key from localStorage
    const apiKey = localStorage.getItem('recipeApiKey');
    
    if (!apiKey) {
        showMessage('API key not found. Please set it up again.', 'error');
        apiKeySection.style.display = 'block';
        recipeForm.style.display = 'none';
        return;
    }
    
    // Generate recipe using API (replace with your actual API call)
    await generateRecipe(ingredients, taste, cuisine, apiKey);
});

async function generateRecipe(ingredients, taste, cuisine, apiKey) {
    try {
        recipeOutput.innerHTML = '<p>Loading...</p>';
        
        // Example API call - modify based on your actual API
        const response = await fetch('https://api.example.com/recipes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                ingredients: ingredients,
                taste: taste,
                cuisine: cuisine
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to generate recipe. Invalid API key or server error.');
        }
        
        const data = await response.json();
        displayRecipe(data);
    } catch (error) {
        recipeOutput.innerHTML = `<div class="recipe-output"><p style="color: red;">Error: ${error.message}</p></div>`;
    }
}

function displayRecipe(data) {
    // Format and display recipe
    let recipeHtml = '<div class="recipe-output">';
    recipeHtml += `<h3>${data.name || 'Recipe'}</h3>`;
    recipeHtml += `<p><strong>Ingredients:</strong> ${data.ingredients || 'N/A'}</p>`;
    recipeHtml += `<p><strong>Instructions:</strong> ${data.instructions || 'N/A'}</p>`;
    recipeHtml += `<p><strong>Cuisine:</strong> ${data.cuisine || 'N/A'}</p>`;
    recipeHtml += `<p><strong>Taste:</strong> ${data.taste || 'N/A'}</p>`;
    recipeHtml += '</div>';
    
    recipeOutput.innerHTML = recipeHtml;
}

function showMessage(message, type) {
    apiKeyMessage.textContent = message;
    apiKeyMessage.className = type;
}