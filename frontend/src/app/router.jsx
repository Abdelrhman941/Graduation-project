import { Routes, Route } from 'react-router-dom'
import Overview from '../pages/Overview/Overview'
import Setup from '../pages/Setup/Setup'
import Classroom from '../pages/Classroom/Classroom'

function AppRouter() {
    return (
        <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/classroom" element={<Classroom />} />
        </Routes>
    )
}

export default AppRouter
