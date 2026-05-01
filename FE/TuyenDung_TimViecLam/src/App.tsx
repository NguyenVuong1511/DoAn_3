import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import JobListPage from './pages/JobListPage'
import ProfilePage from './pages/ProfilePage'
import RecruiterProfilePage from './pages/RecruiterProfilePage'
import SettingsPage from './pages/SettingsPage'
import LoginPage from './features/auth/LoginPage'
import RegisterPage from './features/auth/RegisterPage'
import SavedJobsPage from './pages/SavedJobsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<JobListPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/recruiter-profile" element={<RecruiterProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/saved-jobs" element={<SavedJobsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
