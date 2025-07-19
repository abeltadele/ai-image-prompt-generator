  // DOM Elements
        const themeToggle = document.getElementById('themeToggle');
        const generateBtn = document.getElementById('generateBtn');
        const randomBtn = document.getElementById('randomBtn');
        const copyBtn = document.getElementById('copyBtn');
        const saveBtn = document.getElementById('saveBtn');
        const apiBtn = document.getElementById('apiBtn');
        const preview = document.getElementById('preview');
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        const historyList = document.getElementById('historyList');
        const favoritesList = document.getElementById('favoritesList');
        const tabBtns = document.querySelectorAll('.tab-btn');
        const historyContent = document.getElementById('historyContent');
        const favoritesContent = document.getElementById('favoritesContent');
        
        // Form elements
        const keywordsInput = document.getElementById('keywords');
        const styleSelect = document.getElementById('style');
        const imageTypeSelect = document.getElementById('imageType');
        const moodInput = document.getElementById('mood');
        const lightingInput = document.getElementById('lighting');
        const backgroundInput = document.getElementById('background');
        
        // Data
        const history = JSON.parse(localStorage.getItem('promptHistory')) || [];
        const favorites = JSON.parse(localStorage.getItem('promptFavorites')) || [];
        
        // Theme toggle
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDarkMode);
            themeToggle.innerHTML = isDarkMode ? 
                '<i class="fas fa-sun"></i>' : 
                '<i class="fas fa-moon"></i>';
        });
        
        // Initialize theme
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        if (savedDarkMode) {
            document.body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
        
        // Tab switching
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                tabBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Show corresponding content
                const tab = btn.getAttribute('data-tab');
                historyContent.classList.toggle('active', tab === 'history');
                favoritesContent.classList.toggle('active', tab === 'favorites');
            });
        });
        
        // Generate prompt from form
        generateBtn.addEventListener('click', generatePrompt);
        
        // Generate random prompt
        randomBtn.addEventListener('click', generateRandomPrompt);
        
        // Copy to clipboard
        copyBtn.addEventListener('click', copyToClipboard);
        
        // Save to favorites
        saveBtn.addEventListener('click', saveToFavorites);
        
        // API placeholder
        apiBtn.addEventListener('click', () => {
            showToast('Image generation API integration coming soon!');
        });
        
        // Prompt generation functions
        function generatePrompt() {
            const keywords = keywordsInput.value.trim();
            const style = styleSelect.value;
            const imageType = imageTypeSelect.value;
            const mood = moodInput.value.trim();
            const lighting = lightingInput.value.trim();
            const background = backgroundInput.value.trim();
            
            if (!keywords || !style || !imageType) {
                showToast('Please fill in required fields');
                return;
            }
            
            let prompt = `Create a ${style} ${imageType} image featuring ${keywords}`;
            
            if (mood) prompt += `, evoking a ${mood} mood`;
            if (lighting) prompt += `, with ${lighting} lighting`;
            if (background) prompt += `, set against ${background}`;
            
            // Add quality and details
            prompt += `. Highly detailed, professional digital art, trending on ArtStation.`;
            
            displayPrompt(prompt);
            addToHistory(prompt);
        }
        
        function generateRandomPrompt() {
            const styles = ['realistic', 'cartoon', 'cinematic', 'oil-painting', 'anime', 'pixel-art', 'watercolor', '3d-render'];
            const imageTypes = ['portrait', 'landscape', 'fantasy scene', 'sci-fi cityscape', 'abstract composition', 'character design'];
            const subjects = ['mystical forest', 'ancient ruins', 'cyberpunk street', 'underwater city', 'desert oasis', 'futuristic spaceship'];
            const moods = ['mysterious', 'joyful', 'melancholic', 'epic', 'serene', 'chaotic'];
            const lightings = ['golden hour', 'neon', 'softbox', 'dramatic', 'bioluminescent', 'moonlit'];
            const backgrounds = ['misty mountains', 'cyberpunk city', 'alien planet', 'enchanted garden', 'steampunk laboratory'];
            
            const randomStyle = styles[Math.floor(Math.random() * styles.length)];
            const randomImageType = imageTypes[Math.floor(Math.random() * imageTypes.length)];
            const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
            const randomMood = moods[Math.floor(Math.random() * moods.length)];
            const randomLighting = lightings[Math.floor(Math.random() * lightings.length)];
            const randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];
            
            keywordsInput.value = randomSubject;
            styleSelect.value = randomStyle;
            imageTypeSelect.value = randomImageType;
            moodInput.value = randomMood;
            lightingInput.value = randomLighting;
            backgroundInput.value = randomBackground;
            
            generatePrompt();
        }
        
        function displayPrompt(prompt) {
            preview.innerHTML = `<div class="preview-content">${prompt}</div>`;
        }
        
        function addToHistory(prompt) {
            const timestamp = new Date().toLocaleString();
            const promptObj = { prompt, timestamp, id: Date.now() };
            
            history.unshift(promptObj);
            localStorage.setItem('promptHistory', JSON.stringify(history));
            
            renderHistory();
        }
        
        function renderHistory() {
            historyList.innerHTML = '';
            
            if (history.length === 0) {
                historyList.innerHTML = `<div class="empty-state">No history yet. Generate some prompts!</div>`;
                return;
            }
            
            history.slice(0, 6).forEach(item => {
                const isFavorited = favorites.some(fav => fav.id === item.id);
                
                const itemEl = document.createElement('div');
                itemEl.className = 'history-item';
                itemEl.innerHTML = `
                    <p>${item.prompt}</p>
                    <div class="item-meta">
                        <span>${item.timestamp}</span>
                        <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" data-id="${item.id}">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                `;
                
                historyList.appendChild(itemEl);
                
                // Add favorite toggle
                itemEl.querySelector('.favorite-btn').addEventListener('click', function(e) {
                    e.stopPropagation();
                    toggleFavorite(item);
                });
                
                // Click to use this prompt
                itemEl.addEventListener('click', () => {
                    displayPrompt(item.prompt);
                });
            });
        }
        
        function renderFavorites() {
            favoritesList.innerHTML = '';
            
            if (favorites.length === 0) {
                favoritesList.innerHTML = `<div class="empty-state">No favorites yet. Save your favorite prompts!</div>`;
                return;
            }
            
            favorites.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = 'history-item';
                itemEl.innerHTML = `
                    <p>${item.prompt}</p>
                    <div class="item-meta">
                        <span>${item.timestamp}</span>
                        <button class="favorite-btn favorited" data-id="${item.id}">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                `;
                
                favoritesList.appendChild(itemEl);
                
                // Add favorite toggle
                itemEl.querySelector('.favorite-btn').addEventListener('click', function(e) {
                    e.stopPropagation();
                    toggleFavorite(item);
                });
                
                // Click to use this prompt
                itemEl.addEventListener('click', () => {
                    displayPrompt(item.prompt);
                });
            });
        }
        
        function toggleFavorite(item) {
            const existingIndex = favorites.findIndex(fav => fav.id === item.id);
            
            if (existingIndex !== -1) {
                // Remove from favorites
                favorites.splice(existingIndex, 1);
                showToast('Removed from favorites');
            } else {
                // Add to favorites
                favorites.unshift(item);
                showToast('Added to favorites');
            }
            
            localStorage.setItem('promptFavorites', JSON.stringify(favorites));
            renderHistory();
            renderFavorites();
        }
        
        function copyToClipboard() {
            const promptText = preview.querySelector('.preview-content')?.textContent;
            if (!promptText) {
                showToast('No prompt to copy');
                return;
            }
            
            navigator.clipboard.writeText(promptText)
                .then(() => {
                    showToast('Copied to clipboard!');
                })
                .catch(err => {
                    showToast('Failed to copy');
                    console.error('Failed to copy: ', err);
                });
        }
        
        function saveToFavorites() {
            const promptText = preview.querySelector('.preview-content')?.textContent;
            if (!promptText) {
                showToast('No prompt to save');
                return;
            }
            
            const existing = history.find(item => item.prompt === promptText);
            if (existing) {
                toggleFavorite(existing);
            } else {
                const timestamp = new Date().toLocaleString();
                const promptObj = { prompt: promptText, timestamp, id: Date.now() };
                toggleFavorite(promptObj);
            }
        }
        
        function showToast(message) {
            toastMessage.textContent = message;
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
        
        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            renderHistory();
            renderFavorites();
            
            // Generate an initial random prompt
            setTimeout(() => {
                generateRandomPrompt();
            }, 500);
        });