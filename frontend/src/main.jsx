import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App'
import './styles/normalize.css'
import './styles/all.min.css'
import './styles/style.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
