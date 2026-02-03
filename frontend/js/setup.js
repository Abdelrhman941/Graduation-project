// ===================================
// State Management
// ===================================
const setupState = {
    currentStep: 1,
    selectedCharacter: 'emma',
    uploadedFiles: [],
    settings: {
        character: 'emma',
        voice: 'aria',
        username: '',
        filesCount: 0
    }
};

// ===================================
// Constants
// ===================================
const CONSTANTS = {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ACCEPTED_TYPES: ['.pdf', '.txt'],
    CHARACTER_NAMES: {
        'alex': 'Teacher Alex',
        'emma': 'Prof. Emma',
        'sam': 'Dr. Sam'
    },
    STEPS: ['avatar', 'upload', 'allset'],
    STORAGE_KEY: 'eduagent-settings'
};

// ===================================
// Initialization
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    initializeSetup();
});

function initializeSetup() {
    loadSettings();
    setupEventListeners();
    updateNavigationButtons();
    updateProgressSteps();
    setupFileUpload();
}

// ===================================
// Event Listeners
// ===================================
function setupEventListeners() {
    // Tab buttons
    document.querySelectorAll('.setup-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            switchTab(tabName);
        });
    });

    // Character cards
    document.querySelectorAll('.character-card').forEach(card => {
        card.addEventListener('click', () => {
            const character = card.dataset.character;
            selectCharacter(character);
        });
    });

    // Navigation buttons
    document.getElementById('back-btn').addEventListener('click', previousStep);
    document.getElementById('next-btn').addEventListener('click', nextStep);

    // Form inputs
    document.getElementById('assistant-voice').addEventListener('change', updateSettings);
    document.getElementById('username').addEventListener('input', updateSettings);
}

// ===================================
// Tab Switching
// ===================================
function switchTab(tabName) {
    // Validate tab name
    if (!CONSTANTS.STEPS.includes(tabName)) {
        console.error(`Invalid tab: ${tabName}`);
        return;
    }

    // Update active states
    document.querySelectorAll('.setup-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `${tabName}-tab`);
    });

    // Update step
    setupState.currentStep = CONSTANTS.STEPS.indexOf(tabName) + 1;

    // Special handling for final step
    if (tabName === 'allset') {
        updateReview();
        triggerCheckmarkAnimation();
    }

    updateProgressSteps();
    updateNavigationButtons();
}

// ===================================
// Character Selection
// ===================================
function selectCharacter(character) {
    // Validate character
    if (!CONSTANTS.CHARACTER_NAMES[character]) {
        console.error(`Invalid character: ${character}`);
        return;
    }

    // Update UI
    document.querySelectorAll('.character-card').forEach(card => {
        card.classList.toggle('selected', card.dataset.character === character);
    });

    // Update state
    setupState.selectedCharacter = character;
    setupState.settings.character = character;
}

// ===================================
// File Upload
// ===================================
function setupFileUpload() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');

    // Click to upload
    uploadArea.addEventListener('click', () => fileInput.click());

    // Drag and drop
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);

    // File input change
    fileInput.addEventListener('change', (e) => {
        handleFiles(Array.from(e.target.files));
        fileInput.value = ''; // Reset input
    });
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    const uploadArea = e.currentTarget;
    uploadArea.style.borderColor = 'var(--gold)';
    uploadArea.style.background = 'rgba(212, 175, 55, 0.08)';
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    const uploadArea = e.currentTarget;
    uploadArea.style.borderColor = '#2a3f5f';
    uploadArea.style.background = 'rgba(42, 63, 95, 0.1)';
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    const uploadArea = e.currentTarget;
    uploadArea.style.borderColor = '#2a3f5f';
    uploadArea.style.background = 'rgba(42, 63, 95, 0.1)';
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
}

function handleFiles(files) {
    const validFiles = files.filter(file => validateFile(file));
    
    if (validFiles.length === 0) {
        return;
    }

    const uploadedFilesContainer = document.getElementById('uploaded-files');
    
    validFiles.forEach(file => {
        // Add to state
        setupState.uploadedFiles.push(file);
        
        // Create file item
        const fileItem = createFileItem(file);
        uploadedFilesContainer.appendChild(fileItem);
    });

    // Update settings
    setupState.settings.filesCount = setupState.uploadedFiles.length;
}

function validateFile(file) {
    // Check file type
    const extension = '.' + file.name.split('.').pop().toLowerCase();
    if (!CONSTANTS.ACCEPTED_TYPES.includes(extension)) {
        showNotification(`File type not supported: ${file.name}`, 'error');
        return false;
    }

    // Check file size
    if (file.size > CONSTANTS.MAX_FILE_SIZE) {
        showNotification(`File too large: ${file.name} (Max 10MB)`, 'error');
        return false;
    }

    return true;
}

function createFileItem(file) {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item-new';
    fileItem.dataset.fileName = file.name;
    
    const fileIcon = file.name.endsWith('.pdf') ? '📄' : '📝';
    const fileSize = formatFileSize(file.size);
    
    fileItem.innerHTML = `
        <span class="file-icon-new">${fileIcon}</span>
        <div class="file-details">
            <span class="file-name-new">${escapeHtml(file.name)}</span>
            <span class="file-size-new">${fileSize}</span>
        </div>
        <button class="file-remove-new" aria-label="Remove file">×</button>
    `;
    
    // Add remove listener
    fileItem.querySelector('.file-remove-new').addEventListener('click', (e) => {
        e.stopPropagation();
        removeFile(file.name, fileItem);
    });
    
    return fileItem;
}

function removeFile(fileName, fileElement) {
    // Remove from state
    setupState.uploadedFiles = setupState.uploadedFiles.filter(f => f.name !== fileName);
    setupState.settings.filesCount = setupState.uploadedFiles.length;
    
    // Remove from DOM
    fileElement.remove();
}

// ===================================
// Navigation
// ===================================
function nextStep() {
    if (setupState.currentStep < 3) {
        setupState.currentStep++;
        switchTab(CONSTANTS.STEPS[setupState.currentStep - 1]);
    } else {
        // Final step - save and navigate to chat
        saveSettings();
        window.location.href = 'chat.html';
    }
}

function previousStep() {
    if (setupState.currentStep > 1) {
        setupState.currentStep--;
        switchTab(CONSTANTS.STEPS[setupState.currentStep - 1]);
    } else {
        // Go back to home
        window.location.href = 'index.html';
    }
}

function updateNavigationButtons() {
    const backBtn = document.getElementById('back-btn');
    const nextBtn = document.getElementById('next-btn');
    
    // Back button
    if (setupState.currentStep === 1) {
        backBtn.querySelector('span').textContent = '← Back to Home';
    } else {
        backBtn.querySelector('span').textContent = '← Back';
    }
    
    // Next button
    if (setupState.currentStep === 3) {
        nextBtn.querySelector('span').textContent = 'Start Learning →';
        nextBtn.classList.add('btn-primary-gold');
    } else {
        nextBtn.querySelector('span').textContent = 'Next →';
        nextBtn.classList.remove('btn-primary-gold');
    }
}

// ===================================
// Progress Steps
// ===================================
function updateProgressSteps() {
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        const stepNumber = index + 1;
        const fill = step.querySelector('.progress-fill');
        
        if (stepNumber < setupState.currentStep) {
            // Completed step
            step.classList.add('active', 'completed');
            if (fill) fill.style.width = '100%';
        } else if (stepNumber === setupState.currentStep) {
            // Current step
            step.classList.add('active');
            step.classList.remove('completed');
            if (fill) {
                // Animate fill
                setTimeout(() => {
                    fill.style.width = '100%';
                }, 100);
            }
        } else {
            // Future step
            step.classList.remove('active', 'completed');
            if (fill) fill.style.width = '0%';
        }
    });
}

// ===================================
// Review Summary
// ===================================
function updateReview() {
    // Character
    const characterName = CONSTANTS.CHARACTER_NAMES[setupState.selectedCharacter];
    document.getElementById('review-character').textContent = characterName;
    
    // Voice
    const voiceSelect = document.getElementById('assistant-voice');
    const voiceText = voiceSelect.options[voiceSelect.selectedIndex].text;
    document.getElementById('review-voice').textContent = voiceText;
    
    // Files
    const filesCount = setupState.uploadedFiles.length;
    const filesText = filesCount === 0 ? 'No files uploaded' :
                    filesCount === 1 ? '1 file uploaded' :
                    `${filesCount} files uploaded`;
    document.getElementById('review-files').textContent = filesText;
}

function triggerCheckmarkAnimation() {
    const checkmark = document.querySelector('.checkmark');
    if (checkmark) {
        // Reset animation
        checkmark.classList.remove('animate');
        // Trigger reflow
        void checkmark.offsetWidth;
        // Add animation class
        checkmark.classList.add('animate');
    }
}

// ===================================
// Settings Management
// ===================================
function updateSettings() {
    setupState.settings.voice = document.getElementById('assistant-voice').value;
    setupState.settings.username = document.getElementById('username').value.trim();
}

function saveSettings() {
    updateSettings();
    
    const settingsToSave = {
        character: setupState.settings.character,
        voice: setupState.settings.voice,
        username: setupState.settings.username,
        filesCount: setupState.settings.filesCount,
        timestamp: Date.now()
    };
    
    try {
        localStorage.setItem(CONSTANTS.STORAGE_KEY, JSON.stringify(settingsToSave));
    } catch (e) {
        console.error('Failed to save settings:', e);
        showNotification('Failed to save settings', 'error');
    }
}

function loadSettings() {
    try {
        const saved = localStorage.getItem(CONSTANTS.STORAGE_KEY);
        if (!saved) return;
        
        const settings = JSON.parse(saved);
        
        // Apply saved settings
        if (settings.character) {
            selectCharacter(settings.character);
        }
        
        if (settings.voice) {
            document.getElementById('assistant-voice').value = settings.voice;
        }
        
        if (settings.username) {
            document.getElementById('username').value = settings.username;
        }
        
        // Update state
        setupState.settings = { ...setupState.settings, ...settings };
        
    } catch (e) {
        console.error('Failed to load settings:', e);
    }
}

// ===================================
// Utility Functions
// ===================================
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type = 'info') {
    // Simple notification (you can enhance this with a proper notification system)
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // You can implement a toast notification here
    // For now, just using alert for errors
    if (type === 'error') {
        alert(message);
    }
}

// ===================================
// Export for external use (if needed)
// ===================================
window.VirtAISetup = {
    getState: () => setupState,
    switchTab,
    selectCharacter,
    nextStep,
    previousStep
};