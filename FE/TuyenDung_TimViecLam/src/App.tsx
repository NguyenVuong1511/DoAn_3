import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './layouts/Header'
import LoginPage from './features/auth/LoginPage'
import RegisterPage from './features/auth/RegisterPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<><Header /></>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
