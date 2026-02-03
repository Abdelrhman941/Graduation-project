import { Link, useLocation } from 'react-router-dom'

function Header() {
    const location = useLocation()
    const isActive = (path) => location.pathname === path
    return (
        <header className="header">
        <div className="container">
            <div className="logo">
            <i className="fa-solid fa-graduation-cap logo-icon"></i>
            <span className="logo-text">VirtAI</span>
            </div>
            <nav className="nav">
            <Link 
                to="/" 
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
                Overview
            </Link>
            <Link 
                to="/setup" 
                className={`nav-link ${isActive('/setup') ? 'active' : ''}`}
            >
                Setup
            </Link>
            <Link 
                to="/classroom" 
                className={`nav-link ${isActive('/classroom') ? 'active' : ''}`}
            >
                Chat
            </Link>
            </nav>
        </div>
        </header>
    )
}

export default Header
