import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

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
}

function Setup() {
    const navigate = useNavigate()
    const fileInputRef = useRef(null)
    
    const [currentStep, setCurrentStep] = useState(1)
    const [activeTab, setActiveTab] = useState('avatar')
    const [selectedCharacter, setSelectedCharacter] = useState('emma')
    const [uploadedFiles, setUploadedFiles] = useState([])
    const [settings, setSettings] = useState({
    character: 'emma',
    voice: 'aria',
    username: '',
    filesCount: 0
    })

    // Load saved settings on mount
    useEffect(() => {
        loadSettings()
    }, [])

    // Update progress steps when step changes
    useEffect(() => {
        const stepIndex = CONSTANTS.STEPS.indexOf(activeTab)
        if (stepIndex !== -1) {
        setCurrentStep(stepIndex + 1)
        }
    }, [activeTab])

    const loadSettings = () => {
        try {
        const saved = localStorage.getItem(CONSTANTS.STORAGE_KEY)
        if (!saved) return
        
        const parsedSettings = JSON.parse(saved)
        
        if (parsedSettings.character) {
            setSelectedCharacter(parsedSettings.character)
        }
        
        setSettings(prev => ({ ...prev, ...parsedSettings }))
        } catch (e) {
        console.error('Failed to load settings:', e)
        }
    }

    const saveSettings = () => {
        const settingsToSave = {
        character: selectedCharacter,
        voice: settings.voice,
        username: settings.username,
        filesCount: uploadedFiles.length,
        timestamp: Date.now()
        }
        
        try {
        localStorage.setItem(CONSTANTS.STORAGE_KEY, JSON.stringify(settingsToSave))
        } catch (e) {
        console.error('Failed to save settings:', e)
        alert('Failed to save settings')
        }
    }

    const switchTab = (tabName) => {
        if (!CONSTANTS.STEPS.includes(tabName)) {
        console.error(`Invalid tab: ${tabName}`)
        return
        }
        setActiveTab(tabName)
    }

    const handleCharacterSelect = (character) => {
        if (!CONSTANTS.CHARACTER_NAMES[character]) {
        console.error(`Invalid character: ${character}`)
        return
        }
        setSelectedCharacter(character)
        setSettings(prev => ({ ...prev, character }))
    }

    const handleVoiceChange = (e) => {
        setSettings(prev => ({ ...prev, voice: e.target.value }))
    }

    const handleUsernameChange = (e) => {
        setSettings(prev => ({ ...prev, username: e.target.value.trim() }))
    }

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files)
        handleFiles(files)
        if (fileInputRef.current) {
        fileInputRef.current.value = ''
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
        e.currentTarget.style.borderColor = 'var(--gold)'
        e.currentTarget.style.background = 'rgba(212, 175, 55, 0.08)'
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        e.stopPropagation()
        e.currentTarget.style.borderColor = '#2a3f5f'
        e.currentTarget.style.background = 'rgba(42, 63, 95, 0.1)'
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        e.currentTarget.style.borderColor = '#2a3f5f'
        e.currentTarget.style.background = 'rgba(42, 63, 95, 0.1)'
        
        const files = Array.from(e.dataTransfer.files)
        handleFiles(files)
    }

    const handleFiles = (files) => {
        const validFiles = files.filter(file => validateFile(file))
        
        if (validFiles.length === 0) {
        return
        }

        setUploadedFiles(prev => [...prev, ...validFiles])
    }

    const validateFile = (file) => {
        const extension = '.' + file.name.split('.').pop().toLowerCase()
        if (!CONSTANTS.ACCEPTED_TYPES.includes(extension)) {
        alert(`File type not supported: ${file.name}`)
        return false
        }

        if (file.size > CONSTANTS.MAX_FILE_SIZE) {
        alert(`File too large: ${file.name} (Max 10MB)`)
        return false
        }

        return true
    }

    const removeFile = (fileName) => {
        setUploadedFiles(prev => prev.filter(f => f.name !== fileName))
    }

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes'
        
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
    }

    const nextStep = () => {
        if (currentStep < 3) {
        switchTab(CONSTANTS.STEPS[currentStep])
        } else {
        saveSettings()
        navigate('/classroom')
        }
    }

    const previousStep = () => {
        if (currentStep > 1) {
        switchTab(CONSTANTS.STEPS[currentStep - 2])
        } else {
        navigate('/')
        }
    }

    const characters = [
        { id: 'alex', name: 'Teacher Alex', icon: 'fa-chalkboard-user' },
        { id: 'emma', name: 'Prof. Emma', icon: 'fa-user-graduate' },
        { id: 'sam', name: 'Dr. Sam', icon: 'fa-user-tie' }
    ]

    const voices = [
        { value: 'aria', label: 'Aria (Female, Friendly)' },
        { value: 'ada', label: 'Ada (Female, Friendly)' },
        { value: 'nova', label: 'Nova (Female, Professional)' },
        { value: 'alloy', label: 'Alloy (Male, Neutral)' },
        { value: 'echo', label: 'Echo (Male, Friendly)' },
        { value: 'fable', label: 'Fable (Male, British)' },
        { value: 'onyx', label: 'Onyx (Male, Deep)' }
    ]

    const getBackButtonText = () => {
        return currentStep === 1 ? '← Back to Home' : '← Back'
    }

    const getNextButtonText = () => {
        return currentStep === 3 ? 'Start Learning →' : 'Next →'
    }

    const getVoiceLabel = () => {
        const voice = voices.find(v => v.value === settings.voice)
        return voice ? voice.label : 'Aria (Female, Friendly)'
    }

    const getFilesText = () => {
        const count = uploadedFiles.length
        return count === 0 ? 'No files uploaded' :
            count === 1 ? '1 file uploaded' :
            `${count} files uploaded`
    }

    return (
        <>
        <Header />

        <section className="session-setup">
            <div className="setup-container">
            {/* Setup Header */}
            <div className="setup-header-main">
                <h1 className="session-title">Session Setup</h1>
                <div className="progress-steps">
                {[1, 2, 3].map(step => (
                    <div 
                    key={step}
                    className={`progress-step ${step <= currentStep ? 'active' : ''}`}
                    data-step={step}
                    >
                    <div className="progress-fill"></div>
                    </div>
                ))}
                </div>
            </div>

            {/* Setup Tabs */}
            <div className="setup-tabs">
                <button 
                className={`setup-tab ${activeTab === 'avatar' ? 'active' : ''}`}
                onClick={() => switchTab('avatar')}
                aria-label="Avatar & Voice Tab"
                >
                <i className="fa-solid fa-user tab-icon"></i>
                <span className="tab-text">Avatar & Voice</span>
                </button>
                <button 
                className={`setup-tab ${activeTab === 'upload' ? 'active' : ''}`}
                onClick={() => switchTab('upload')}
                aria-label="Upload Documents Tab"
                >
                <i className="fa-solid fa-file-arrow-up tab-icon"></i>
                <span className="tab-text">Upload Docs</span>
                </button>
                <button 
                className={`setup-tab ${activeTab === 'allset' ? 'active' : ''}`}
                onClick={() => switchTab('allset')}
                aria-label="All Set Tab"
                >
                <i className="fa-solid fa-circle-check tab-icon"></i>
                <span className="tab-text">All Set</span>
                </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content-wrapper">
                {/* Step 1: Avatar & Voice */}
                <div className={`tab-content ${activeTab === 'avatar' ? 'active' : ''}`}>
                <div className="tab-content-inner">
                    <h2 className="content-title">Choose Your Character</h2>
                    
                    <div className="character-grid">
                    {characters.map(character => (
                        <div 
                        key={character.id}
                        className={`character-card ${selectedCharacter === character.id ? 'selected' : ''}`}
                        onClick={() => handleCharacterSelect(character.id)}
                        >
                        <div className="character-avatar">
                            <div className="avatar-circle">
                            <i className={`fa-solid ${character.icon}`}></i>
                            </div>
                        </div>
                        <div className="character-name">{character.name}</div>
                        </div>
                    ))}
                    </div>

                    <div className="form-section">
                    <label htmlFor="assistant-voice" className="form-label">Assistant Voice</label>
                    <select 
                        id="assistant-voice" 
                        className="form-select" 
                        value={settings.voice}
                        onChange={handleVoiceChange}
                        autoComplete="off"
                    >
                        {voices.map(voice => (
                        <option key={voice.value} value={voice.value}>
                            {voice.label}
                        </option>
                        ))}
                    </select>
                    </div>
                </div>
                </div>

                {/* Step 2: Upload Documents */}
                <div className={`tab-content ${activeTab === 'upload' ? 'active' : ''}`}>
                <div className="tab-content-inner">
                    <h2 className="content-title">Upload Learning Materials</h2>
                    
                    <div className="upload-section">
                    <div 
                        className="upload-area-large" 
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <i className="fa-solid fa-file-arrow-up upload-icon-large"></i>
                        <h3 className="upload-title">Drag & drop files here</h3>
                        <p className="upload-subtitle">or click to browse</p>
                        <p className="upload-formats">Supports PDF, TXT (Max 10MB per file)</p>
                        <input 
                        ref={fileInputRef}
                        type="file" 
                        multiple 
                        accept=".pdf,.txt" 
                        onChange={handleFileSelect}
                        autoComplete="off" 
                        style={{ display: 'none' }}
                        />
                    </div>
                    
                    <div className="uploaded-files-list">
                        {uploadedFiles.map((file, index) => {
                        const fileIcon = file.name.endsWith('.pdf') ? '📄' : '📝'
                        return (
                            <div key={index} className="file-item-new">
                            <span className="file-icon-new">{fileIcon}</span>
                            <div className="file-details">
                                <span className="file-name-new">{file.name}</span>
                                <span className="file-size-new">{formatFileSize(file.size)}</span>
                            </div>
                            <button 
                                className="file-remove-new" 
                                onClick={() => removeFile(file.name)}
                                aria-label="Remove file"
                            >
                                ×
                            </button>
                            </div>
                        )
                        })}
                    </div>
                    </div>
                </div>
                </div>

                {/* Step 3: All Set */}
                <div className={`tab-content ${activeTab === 'allset' ? 'active' : ''}`}>
                <div className="tab-content-inner">
                    {/* Success Icon */}
                    <div className="success-icon-wrapper">
                    <div className="success-icon">
                        <svg className="checkmark" viewBox="0 0 52 52">
                        <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                        <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                        </svg>
                    </div>
                    </div>
                    
                    <h2 className="content-title center-title">Review Your Settings</h2>
                    
                    <div className="settings-review">
                    <div className="review-card">
                        <div className="review-content">
                        <h3 className="review-title">
                            Character & Voice
                            <span className="review-accent-line"></span>
                        </h3>
                        <p className="review-detail">{CONSTANTS.CHARACTER_NAMES[selectedCharacter]}</p>
                        <p className="review-detail">{getVoiceLabel()}</p>
                        </div>
                    </div>

                    <div className="review-card">
                        <div className="review-content">
                        <h3 className="review-title">
                            Documents
                            <span className="review-accent-line"></span>
                        </h3>
                        <p className="review-detail">{getFilesText()}</p>
                        </div>
                    </div>
                    </div>

                    <div className="form-section">
                    <label htmlFor="username" className="form-label">Your Name (Optional)</label>
                    <input 
                        type="text" 
                        id="username" 
                        className="form-input" 
                        placeholder="Enter your name"
                        value={settings.username}
                        onChange={handleUsernameChange}
                        autoComplete="name"
                    />
                    </div>
                </div>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="setup-navigation">
                <button className="nav-btn btn-back" onClick={previousStep}>
                <span>{getBackButtonText()}</span>
                </button>
                <button 
                className={`nav-btn btn-next ${currentStep === 3 ? 'btn-primary-gold' : ''}`}
                onClick={nextStep}
                >
                <span>{getNextButtonText()}</span>
                </button>
            </div>
            </div>
        </section>

        <Footer />
        </>
    )
}

export default Setup
