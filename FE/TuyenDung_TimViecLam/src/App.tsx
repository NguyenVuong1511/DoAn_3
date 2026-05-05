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
import JobDetailPage from './pages/JobDetailPage'
import AppliedJobsPage from './pages/AppliedJobsPage'
import InterviewsPage from './pages/InterviewsPage'
import RecruiterDashboardPage from './pages/RecruiterDashboardPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import CompanyListPage from './pages/CompanyListPage'
import CompanyDetailPage from './pages/CompanyDetailPage'
import SalaryCalculatorPage from './pages/SalaryCalculatorPage'

import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<JobListPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/recruiter-profile" element={<RecruiterProfilePage />} />
        <Route path="/companies" element={<CompanyListPage />} />
        <Route path="/companies/:id" element={<CompanyDetailPage />} />

        {/* Protected Recruiter Route */}
        <Route
          path="/recruiter/dashboard"
          element={
            <ProtectedRoute allowedRoles={['RECRUITER']}>
              <RecruiterDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Route */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/saved-jobs" element={<SavedJobsPage />} />
        <Route path="/applied-jobs" element={<AppliedJobsPage />} />
        <Route path="/interviews" element={<InterviewsPage />} />
        <Route path="/salary-calculator" element={<SalaryCalculatorPage />} />
        <Route path="/candidates/:id/cv/:cvId" element={<ProfilePage />} />
        <Route path="/candidates/:id" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
