import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { LogOut, Home, Menu, X } from 'lucide-react'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAdmin, setUser, setIsAdmin } = useApp()
  const [open, setOpen] = useState(false)

  const logout = () => { setUser(null); setIsAdmin(false); navigate('/'); setOpen(false) }
  const go = (path) => { navigate(path); setOpen(false) }

  if (location.pathname === '/' || location.pathname === '/login') return null

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => go('/')} style={{ cursor: 'pointer', fontSize: 'clamp(0.95rem, 3vw, 1.2rem)' }}>
        🎓 SECE Lost &amp; Found
      </div>

      {/* Desktop nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="nav-desktop">
        {user && (
          <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
            {isAdmin ? '👑 Admin' : `👤 ${user.name}`}
          </span>
        )}
        <button className="btn btn-outline" style={{ padding: '7px 16px', fontSize: '0.82rem' }} onClick={() => go('/dashboard')}>
          <Home size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} /> Home
        </button>
        <button className="btn btn-secondary" style={{ padding: '7px 16px', fontSize: '0.82rem' }} onClick={logout}>
          <LogOut size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} /> Logout
        </button>
      </div>

      {/* Mobile hamburger */}
      <button onClick={() => setOpen(o => !o)} className="nav-hamburger" style={{
        display: 'none', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '8px', padding: '7px', cursor: 'pointer', color: '#fff',
        alignItems: 'center', justifyContent: 'center',
      }}>
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'rgba(15,12,41,0.97)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px',
          zIndex: 200,
        }}>
          {user && (
            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              {isAdmin ? '👑 Admin' : `👤 ${user.name}`}
            </div>
          )}
          <button className="btn btn-outline" style={{ width: '100%', padding: '11px' }} onClick={() => go('/dashboard')}>
            <Home size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} /> Home
          </button>
          <button className="btn btn-secondary" style={{ width: '100%', padding: '11px' }} onClick={logout}>
            <LogOut size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} /> Logout
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 600px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}
