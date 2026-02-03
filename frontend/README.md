# **VirtAI - React Frontend**
> AI-Powered Learning Platform - Migrated to React + Vite

## **Quick Start**
```bash
# Install dependencies
npm i

# Run development server
npm run dev
```

## **📁 Project Structure**
```
frontend/
├── 📁 public/                                   # Static assets (icons, images, fonts)
│   ├── 📁 assets/
│   │   ├── 📄 icon.ico
│   │   └── 🖼️ image.png
│   └── 📁 webfonts/
│
├── 📁 src/
│   ├── 📁 app/                                  # Application configuration and routing
│   │   ├── 📄 App.jsx
│   │   └── 📄 router.jsx
│   ├── 📁 components/                           # Reusable components (Header, Footer, Banner)
│   │   ├── 📄 Banner.jsx
│   │   ├── 📄 Footer.jsx
│   │   └── 📄 Header.jsx
│   ├── 📁 pages/                                # Page components (Overview, Setup, Classroom)
│   │   ├── 📁 Classroom/
│   │   │   └── 📄 Classroom.jsx
│   │   ├── 📁 Overview/
│   │   │   └── 📄 Overview.jsx
│   │   └── 📁 Setup/
│   │       └── 📄 Setup.jsx
│   ├── 📁 styles/                               # CSS files (preserved from vanilla version)
│   │   ├── 🎨 all.min.css
│   │   ├── 🎨 normalize.css
│   │   └── 🎨 style.css
│   └── 📄 main.jsx
│
├── ⚙️ .gitignore
├── 📝 README.md
├── 🌐 index.html
├── ⚙️ package-lock.json
├── ⚙️ package.json
└── 📄 vite.config.js
```

## **🎯 Features**
- **Overview Page**: Hero section, features grid, team information
- **Setup Page**: 3-step wizard with character selection, file upload, and review
- **Classroom Page**: Split-screen chat interface with AI tutor avatar

## **🛠 Tech Stack**
- **React 18** - UI framework
- **React Router 6** - Client-side routing
- **Vite 5** - Build tool and dev server
- **FontAwesome** - Icon library

## **📄 Pages**
### → Overview (`/`) : Landing page showcasing VirtAI features and capabilities.

### → Setup (`/setup`) : Session configuration wizard:
  1. Choose AI tutor character and voice
  2. Upload learning materials (PDF, TXT)
  3. Review settings and start

### → Classroom (`/classroom`) : Interactive learning environment with:
   - AI tutor avatar panel
   - Real-time chat interface
   - Settings drawer
   - Voice input support
   - Document upload

## **🎨 Styling**
All original CSS has been preserved to maintain visual consistency:
- `normalize.css` - CSS reset
- `all.min.css` - FontAwesome icons
- `style.css` - Application styles

## **💾 Data Persistence**
Settings are persisted to `localStorage`:
- Selected character
- Voice preference
- Username
- File count

## **🔗 Backend Integration**
The Classroom page includes backend connection monitoring:
- Health check endpoint: `http://localhost:5000/health`
- Status indicator (online/offline)
- Graceful error handling

## **📱 Responsive Design**
Fully responsive with breakpoints for:
- Desktop (1200px+)
- Tablet (768px - 1024px)
- Mobile (< 768px)

## **📄 License**
© 2026 VirtAI. All rights reserved.
