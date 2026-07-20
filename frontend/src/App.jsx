import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import FoundThings from './pages/FoundThings'
import LostThings from './pages/LostThings'
import AdminPanel from './pages/AdminPanel'
import { AppProvider } from './context/AppContext'
import './index.css'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/found" element={<FoundThings />} />
          <Route path="/lost" element={<LostThings />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
