import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Particles from '../components/Particles'
import { User, Shield, ArrowLeft } from 'lucide-react'

const DEPTS = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'AIDS', 'AIML']
const YEARS = ['I', 'II', 'III', 'IV']
const SECTIONS = ['A', 'B', 'C', 'D', 'E']

export default function Login() {
  const navigate = useNavigate()
  const { loginUser, setIsAdmin, setUser } = useApp()
  const [tab, setTab] = useState('student')
  const [student, setStudent] = useState({ name: '', rollno: '', year: '', dept: '', section: '' })
  const [admin, setAdmin] = useState({ name: '', password: '' })
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)

  const handleStudent = async (e) => {
    e.preventDefault()
    if (!student.name || !student.rollno || !student.year || !student.dept || !student.section) {
      setError('Please fill all fields')
      return
    }
    await loginUser(student)
    navigate('/dashboard')
  }

  const handleAdmin = (e) => {
    e.preventDefault()
    if (admin.name === 'admin' && admin.password === 'admin123') {
      setUser({ name: 'Admin' })
      setIsAdmin(true)
      navigate('/admin')
    } else {
      setError('Invalid credentials')
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'fixed', inset: 0,
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      }} />
      <Particles />

      {/* Decorative blobs */}
      <div style={{ position: 'fixed', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,99,255,0.15), transparent)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,101,132,0.1), transparent)', pointerEvents: 'none' }} />

      <div style={{
        position: 'relative', zIndex: 10,
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}>
        <div className="glass animate-slide-up" style={{ width: '100%', maxWidth: '460px', padding: 'clamp(24px, 5vw, 40px)' }}>
          {/* Back */}
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px', fontSize: '0.85rem' }}>
            <ArrowLeft size={16} /> Back to Home
          </button>

          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '8px' }}>
            <span className="grad-text">Welcome Back</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginBottom: '28px' }}>
            Sign in to access the portal
          </p>

          {/* Tabs */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '4px', marginBottom: '28px' }}>
            {[['student', <User size={16} />, 'Student'], ['admin', <Shield size={16} />, 'Admin']].map(([key, icon, label]) => (
              <button key={key} onClick={() => { setTab(key); setError('') }} style={{
                flex: 1, padding: '10px', border: 'none', borderRadius: '10px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.9rem',
                transition: 'all 0.3s',
                background: tab === key ? 'linear-gradient(135deg, #6c63ff, #a855f7)' : 'transparent',
                color: tab === key ? '#fff' : 'rgba(255,255,255,0.5)',
              }}>
                {icon} {label}
              </button>
            ))}
          </div>

          {error && (
            <div style={{ background: 'rgba(255,101,132,0.15)', border: '1px solid rgba(255,101,132,0.3)', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px', color: '#ff6584', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}

          {tab === 'student' ? (
            <form onSubmit={handleStudent} style={{ animation: shake ? 'none' : undefined }}>
              <div className="login-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="label">Full Name</label>
                  <input className="input" placeholder="Enter your name" value={student.name} onChange={e => setStudent({ ...student, name: e.target.value })} />
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="label">Roll Number</label>
                  <input className="input" placeholder="e.g. 22CSE001" value={student.rollno} onChange={e => setStudent({ ...student, rollno: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="label">Year</label>
                  <select className="input" value={student.year} onChange={e => setStudent({ ...student, year: e.target.value })}>
                    <option value="">Year</option>
                    {YEARS.map(y => <option key={y} value={y}>{y} Year</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="label">Section</label>
                  <select className="input" value={student.section} onChange={e => setStudent({ ...student, section: e.target.value })}>
                    <option value="">Section</option>
                    {SECTIONS.map(s => <option key={s} value={s}>Section {s}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="label">Department</label>
                  <select className="input" value={student.dept} onChange={e => setStudent({ ...student, dept: e.target.value })}>
                    <option value="">Select Department</option>
                    {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px', padding: '14px' }}>
                Enter Portal
              </button>
            </form>
          ) : (
            <form onSubmit={handleAdmin}>
              <div className="form-group">
                <label className="label">Admin Username</label>
                <input className="input" placeholder="admin" value={admin.name} onChange={e => setAdmin({ ...admin, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="label">Password</label>
                <input className="input" type="password" placeholder="••••••••" value={admin.password} onChange={e => setAdmin({ ...admin, password: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px', padding: '14px' }}>
                Admin Login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
