import { Link } from 'react-router-dom'
import Header from '../../components/Header'
import Banner from '../../components/Banner'
import Footer from '../../components/Footer'

function Overview() {
    const features = [
        {
        icon: 'fa-bullseye',
        title: 'AI-Powered Tutoring',
        description: 'Get personalized explanations and guidance tailored to your learning style and pace.',
        list: ['Adaptive learning paths', 'Real-time feedback', '24/7 availability']
        },
        {
        icon: 'fa-file-lines',
        title: 'Document Analysis',
        description: 'Upload PDFs, Word docs, and text files for instant AI-powered analysis and insights.',
        list: ['Multi-format support', 'Instant processing', 'Smart indexing']
        },
        {
        icon: 'fa-microphone',
        title: 'Voice Interactions',
        description: 'Engage in natural voice conversations with your AI tutor for immersive learning.',
        list: ['Natural speech recognition', 'Multiple voice options', 'Audio playback']
        },
        {
        icon: 'fa-user',
        title: 'Personalized Learning',
        description: 'Customize your avatar, voice preferences, and learning experience to match your style.',
        list: ['Custom avatars', 'Learning preferences', 'Progress tracking']
        },
        {
        icon: 'fa-folder-open',
        title: 'Smart Knowledge Base',
        description: 'Build and search through your personal knowledge base with intelligent indexing.',
        list: ['Intelligent search', 'Document organization', 'Quick retrieval']
        },
        {
        icon: 'fa-users',
        title: 'Collaborative Learning',
        description: 'Share insights, create study groups, and learn together with peers.',
        list: ['Group sessions', 'Shared resources', 'Team collaboration']
        }
    ]

    const teamMembers = [
        { github: 'Abdelrhman941', name: 'Abdelrhman' },
        { github: 'HassanZoghly', name: 'Hassan' },
        { github: 'mohamedali572', name: 'Mohamed Ali' },
        { github: 'AbdallahElesh22', name: 'Abdallah' },
        { github: 'moustafa-nasser', name: 'Moustafa' }
    ]

    return (
        <>
        <Header />
        <Banner />

        {/* Hero Section */}
        <section className="hero">
            <div className="container">
            <div className="hero-content">
                <div className="hero-text">
                <h1 className="hero-title">
                    Your Personal<br />
                    <span className="highlight">AI Tutor</span><br />
                    Awaits
                </h1>
                <p className="hero-description">
                    Transform your learning experience with VirtAI. Upload documents, engage in voice conversations, and receive personalized tutoring powered by advanced AI technology.
                </p>
                <div className="hero-buttons">
                    <Link to="/setup" className="btn btn-primary">Get Started Free →</Link>
                </div>
                </div>
                <div className="hero-image">
                <img 
                    src="/assets/image.png" 
                    alt="Students learning together" 
                    onError={(e) => e.target.style.display = 'none'}
                />
                <div className="image-badge">
                    <i className="fa-solid fa-graduation-cap badge-icon"></i>
                    <span className="badge-text">Start Learning</span>
                </div>
                </div>
            </div>
            </div>
        </section>

        {/* Features Section */}
        <section className="features" id="features">
            <div className="container">
            <div className="features-header">
                <i className="fa-solid fa-lightbulb features-icon"></i>
                <span className="features-subtitle">Powerful Features</span>
            </div>
            <h2 className="features-title">
                Everything You Need to<br />
                <span className="highlight">Learn Smarter</span>
            </h2>
            <p className="features-description">
                Discover how VirtAI combines cutting-edge AI technology with intuitive design to create the ultimate personalized learning experience.
            </p>

            <div className="features-grid">
                {features.map((feature, index) => (
                <div key={index} className="feature-card">
                    <i className={`fa-solid ${feature.icon} feature-icon`}></i>
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-description">{feature.description}</p>
                    <ul className="feature-list">
                    {feature.list.map((item, idx) => (
                        <li key={idx}>✓ {item}</li>
                    ))}
                    </ul>
                </div>
                ))}
            </div>
            </div>
        </section>

        {/* About Section */}
        <section className="about">
            <div className="container">
            <h2 className="about-title">About Us</h2>
            <p className="about-description">
                Our team of passionate developers created VirtAI to revolutionize education through AI technology, making quality learning accessible to everyone.
            </p>
            <div className="team-icons">
                {teamMembers.map((member, index) => (
                <a 
                    key={index}
                    href={`https://github.com/${member.github}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="team-icon"
                >
                    <img src={`https://github.com/${member.github}.png`} alt={`${member.name} GitHub`} />
                </a>
                ))}
            </div>
            </div>
        </section>

        <Footer />
        </>
    )
}

export default Overview
