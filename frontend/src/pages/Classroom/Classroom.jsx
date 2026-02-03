import React, { useState, useEffect, useRef } from 'react'

const BACKEND_URL = 'http://localhost:5000'

function Classroom() {
    const [isBackendConnected, setIsBackendConnected] = useState(false)
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [isNotificationOpen, setIsNotificationOpen] = useState(false)
    const [notificationMessage, setNotificationMessage] = useState('')
    const [notificationTitle, setNotificationTitle] = useState('Connection Error')
    const [messages, setMessages] = useState([])
    const [inputValue, setInputValue] = useState('')
    const [isRecording, setIsRecording] = useState(false)
    const [userName, setUserName] = useState('')
    
    const messagesEndRef = useRef(null)
    const fileUploadRef = useRef(null)

    // Check backend connection
    useEffect(() => {
        checkBackendConnection()
        const interval = setInterval(checkBackendConnection, 10000)
        return () => clearInterval(interval)
    }, [])

    // Load saved settings
    useEffect(() => {
        const saved = localStorage.getItem('eduagent-settings')
        if (saved) {
        try {
            const settings = JSON.parse(saved)
            if (settings.username) {
            setUserName(settings.username)
            }
        } catch (e) {
            console.error('Failed to load settings:', e)
        }
        }
    }, [])

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const checkBackendConnection = async () => {
        try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3000)
        
        const response = await fetch(`${BACKEND_URL}/health`, {
            method: 'GET',
            signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        
        if (response.ok) {
            setIsBackendConnected(true)
        } else {
            throw new Error('Backend not responding')
        }
        } catch (error) {
        setIsBackendConnected(false)
        console.log('Backend connection failed:', error.message)
        }
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const openSettings = () => {
        setIsSettingsOpen(true)
        document.body.style.overflow = 'hidden'
    }

    const closeSettings = () => {
        setIsSettingsOpen(false)
        document.body.style.overflow = ''
    }

    const showNotification = (message, title = 'Connection Error') => {
        setNotificationMessage(message)
        setNotificationTitle(title)
        setIsNotificationOpen(true)
        document.body.style.overflow = 'hidden'
    }

    const closeNotification = () => {
        setIsNotificationOpen(false)
        document.body.style.overflow = ''
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
        e.preventDefault()
        sendMessage()
        }
    }

    const sendMessage = () => {
        const message = inputValue.trim()
        
        if (!message) return
        
        if (!isBackendConnected) {
        showNotification('Cannot send message: AI Tutor is offline. Please check your connection.')
        return
        }
        
        addMessage(message, 'user')
        setInputValue('')
        
        // Simulate AI response
        setTimeout(() => {
        const response = "I'm here to help! This is a demo response. In production, this would connect to your AI backend."
        addMessage(response, 'ai')
        }, 1000)
    }

    const addMessage = (text, sender) => {
        const newMessage = {
        id: Date.now(),
        text,
        sender,
        timestamp: new Date()
        }
        setMessages(prev => [...prev, newMessage])
    }

    const toggleVoice = () => {
        setIsRecording(prev => !prev)
        console.log(isRecording ? 'Voice recording stopped' : 'Voice recording started')
    }

    const attachFile = () => {
        fileUploadRef.current?.click()
    }

    const handleFileAttach = (e) => {
        const file = e.target.files?.[0]
        if (file) {
        addMessage(`📎 Attached: ${file.name}`, 'user')
        e.target.value = ''
        }
    }

    const handleDocumentUpload = (e) => {
        const file = e.target.files?.[0]
        if (file) {
        console.log('Document uploaded:', file.name)
        e.target.value = ''
        }
    }

    const getWelcomeTitle = () => {
        return userName ? `Hey there, ${userName}` : 'Welcome to Your AI Tutor'
    }

    return (
        <div className="chat-body">
        {/* Settings Drawer */}
        <div className={`settings-drawer ${isSettingsOpen ? 'open' : ''}`}>
            <div className="drawer-overlay" onClick={closeSettings}></div>
            <div className="drawer-content">
            <div className="drawer-header">
                <h2 className="drawer-title">Settings</h2>
                <button className="drawer-close" onClick={closeSettings}>
                <i className="fa-solid fa-times"></i>
                </button>
            </div>
            
            {/* Chat History Section */}
            <div className="drawer-section">
                <h3 className="drawer-section-title">
                <i className="fa-solid fa-clock-rotate-left"></i> Chat History
                </h3>
                <div className="chat-history-list">
                <div className="empty-state">
                    <i className="fa-solid fa-inbox" style={{ fontSize: '2rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}></i>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No chat history yet</p>
                </div>
                </div>
            </div>
            
            {/* Avatar Settings Section */}
            <div className="drawer-section">
                <h3 className="drawer-section-title">
                <i className="fa-solid fa-user-circle"></i> Avatar Settings
                </h3>
                <div className="setting-item">
                <label className="setting-label">AI Tutor Character</label>
                <select className="setting-select" autoComplete="off">
                    <option>Prof. Emma</option>
                    <option>Teacher Alex</option>
                    <option>Dr. Sam</option>
                </select>
                </div>
                <div className="setting-item">
                <label className="setting-label">Voice</label>
                <select className="setting-select" autoComplete="off">
                    <option>Aria (Female, Friendly)</option>
                    <option>Nova (Female, Professional)</option>
                    <option>Alloy (Male, Neutral)</option>
                </select>
                </div>
            </div>
            
            {/* Document Settings Section */}
            <div className="drawer-section">
                <h3 className="drawer-section-title">
                <i className="fa-solid fa-file-lines"></i> Document Settings
                </h3>
                <div className="setting-item">
                <label className="setting-label">Knowledge Base</label>
                <div className="doc-list">
                    <div className="empty-state">
                    <i className="fa-solid fa-folder-open" style={{ fontSize: '2rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}></i>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No documents uploaded</p>
                    </div>
                </div>
                </div>
                <input 
                type="file" 
                ref={fileUploadRef}
                accept=".pdf,.docx,.txt" 
                style={{ display: 'none' }}
                onChange={handleDocumentUpload}
                />
                <button className="setting-btn" onClick={() => fileUploadRef.current?.click()}>
                <i className="fa-solid fa-plus"></i> Add Document
                </button>
            </div>
            </div>
        </div>
        
        {/* Custom Notification */}
        <div 
            className={`notification-overlay ${isNotificationOpen ? 'show' : ''}`}
            onClick={closeNotification}
        >
            <div className="notification-box" onClick={(e) => e.stopPropagation()}>
            <div className="notification-icon">
                <i className="fa-solid fa-exclamation-triangle"></i>
            </div>
            <div className="notification-content">
                <h3 className="notification-title">{notificationTitle}</h3>
                <p className="notification-message">{notificationMessage}</p>
            </div>
            <button className="notification-close" onClick={closeNotification}>
                <i className="fa-solid fa-times"></i>
            </button>
            </div>
        </div>

        {/* Main Split Screen Layout */}
        <div className="split-container">
            {/* Left Panel: Avatar Interface */}
            <div className="avatar-panel">
            <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=1200&fit=crop" 
                alt="AI Tutor" 
                className="avatar-image"
            />
            
            <button className="avatar-settings-btn" onClick={openSettings} title="Settings">
                <i className="fa-solid fa-gear"></i>
            </button>
            
            <div className={`avatar-status-badge ${isBackendConnected ? 'online' : 'offline'}`}>
                <span className="status-dot"></span>
                <span id="status-text">
                AI Tutor • {isBackendConnected ? 'Online' : 'Offline'}
                </span>
            </div>
            </div>
            
            {/* Right Panel: Chat Interface */}
            <div className="chat-panel">
            <div className="chat-messages">
                {messages.length === 0 ? (
                <div className="welcome-state">
                    <h2 className="welcome-title">{getWelcomeTitle()}</h2>
                    <p className="welcome-subtitle">Start a conversation or ask any question to begin learning</p>
                </div>
                ) : (
                <>
                    {messages.map((message) => (
                    <div key={message.id} className={`chat-message-wrapper ${message.sender}-message-wrapper`}>
                        <div className="message-separator"></div>
                        <div className={`chat-message ${message.sender}-message`}>
                        {message.sender === 'user' ? (
                            <>
                            <div className="message-bubble">{message.text}</div>
                            <div className="message-avatar">
                                <i className="fa-solid fa-user"></i>
                            </div>
                            </>
                        ) : (
                            <>
                            <div className="message-avatar">
                                <i className="fa-solid fa-robot"></i>
                            </div>
                            <div className="message-bubble">{message.text}</div>
                            </>
                        )}
                        </div>
                    </div>
                    ))}
                    <div ref={messagesEndRef} />
                </>
                )}
            </div>
            
            <div className="chat-input-bar">
                <button className="input-icon-btn" onClick={attachFile} title="Attach file">
                <i className="fa-solid fa-paperclip"></i>
                </button>
                
                <button 
                className="input-icon-btn" 
                onClick={toggleVoice} 
                title="Voice input"
                style={{ color: isRecording ? 'var(--gold)' : '' }}
                >
                <i className="fa-solid fa-microphone"></i>
                </button>
                
                <input 
                type="text" 
                className="chat-input" 
                placeholder="Type a message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                autoComplete="off"
                />
                
                <button className="send-btn" onClick={sendMessage} title="Send message">
                <i className="fa-solid fa-paper-plane"></i>
                </button>

                <input 
                type="file" 
                ref={fileUploadRef}
                accept=".pdf,.docx,.txt,.jpg,.png" 
                style={{ display: 'none' }}
                onChange={handleFileAttach}
                />
            </div>
            </div>
        </div>
        </div>
    )
}

export default Classroom
