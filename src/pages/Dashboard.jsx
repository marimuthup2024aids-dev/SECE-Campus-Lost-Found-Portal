import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Particles from '../components/Particles'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, isAdmin, userClaims } = useApp()

  useEffect(() => {
    if (!user) navigate('/login')
    if (isAdmin) navigate('/admin')
  }, [user, isAdmin])

  const myClaims = user ? userClaims(user.name, user.rollno) : []

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' }} />
      <Particles />
      <Navbar />

      <div className="page" style={{ position: 'relative', zIndex: 10, padding: '100px 20px 40px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>

          {/* Greeting only - no stats */}
          <div className="animate-slide-up" style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>👋</div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', fontWeight: 700, marginBottom: '8px' }}>
              Hello, <span className="grad-text">{user?.name}</span>!
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1rem' }}>
              {user?.dept} • {user?.year} Year • Section {user?.section} • {user?.rollno}
            </p>
          </div>


          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: '28px', fontSize: '0.95rem' }}>
            What would you like to do today?
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {/* Found Things */}
            <div
              className="glass"
              onClick={() => navigate('/found')}
              style={{
                padding: '40px 32px', textAlign: 'center', cursor: 'pointer',
                transition: 'all 0.3s', position: 'relative', overflow: 'hidden',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 60px rgba(67,233,123,0.2)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #43e97b, #38f9d7)' }} />
              <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🔍</div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px', color: '#43e97b' }}>Found Something?</h2>
              <p style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: '24px', fontSize: '0.9rem' }}>
                Help a fellow student! Upload details of an item you found on campus.
              </p>
              <button className="btn btn-success" style={{ width: '100%' }}>
                📤 Report Found Item
              </button>
            </div>

            {/* Lost Things */}
            <div
              className="glass"
              onClick={() => navigate('/lost')}
              style={{
                padding: '40px 32px', textAlign: 'center', cursor: 'pointer',
                transition: 'all 0.3s', position: 'relative', overflow: 'hidden',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 60px rgba(108,99,255,0.2)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #6c63ff, #ff6584)' }} />
              <div style={{ fontSize: '4rem', marginBottom: '16px' }}>😟</div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px', color: '#a78bfa' }}>Lost Something?</h2>
              <p style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: '24px', fontSize: '0.9rem' }}>
                Search through found items and claim what belongs to you.
              </p>
              <button className="btn btn-primary" style={{ width: '100%' }}>
                🔎 Search Lost Items
              </button>
            </div>
          </div>

          {/* My Claims */}
          {myClaims.length > 0 && (
            <div style={{ marginTop: '48px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px', textAlign: 'center' }}>
                🙋 My Claims
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {myClaims.map(claim => {
                  const statusColor = claim.status === 'approved' ? '#43e97b' : claim.status === 'rejected' ? '#ff6584' : '#f59e0b'
                  const statusBg = claim.status === 'approved' ? 'rgba(67,233,123,0.12)' : claim.status === 'rejected' ? 'rgba(255,101,132,0.12)' : 'rgba(245,158,11,0.12)'
                  const statusLabel = claim.status === 'approved' ? '✅ Approved — Ready to Collect!' : claim.status === 'rejected' ? '❌ Rejected' : '⏳ Pending Admin Verification'
                  return (
                    <div key={claim.id} className="glass" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(108,99,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                        {claim.itemPhoto ? <img src={claim.itemPhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '📦'}
                      </div>
                      <div style={{ flex: 1, minWidth: '120px' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{claim.itemName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{claim.itemCategory} • {claim.submittedAt}</div>
                      </div>
                      <span style={{ padding: '5px 14px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600, background: statusBg, color: statusColor }}>
                        {statusLabel}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
