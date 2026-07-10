import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Navbar from '../components/Navbar'
import Particles from '../components/Particles'
import ClaimForm from '../components/ClaimForm'
import { Search, MapPin, Calendar, Tag, Clock, CheckCircle, XCircle } from 'lucide-react'

const CATEGORIES = ['All', 'Mobile', 'Laptop', 'Wallet', 'Bag', 'Electronics', 'Money', 'Keys', 'ID Card', 'Books', 'Other']
const LOCATIONS = [
  'All',
  'AI Block - 1st Floor', 'AI Block - 2nd Floor', 'AI Block - 3rd Floor',
  'DVE Lab', 'AI Lab', 'Robo Space', 'Synap Studio', 'Code Studio', 'ML Lab',
  'Main Block - 1st Floor', 'Main Block - 2nd Floor', 'Main Block - 3rd Floor',
  'IT Centre', 'Centre of Excellence', 'Central Library',
  'HOD Room', 'Amenity Centre', 'Medical Centre',
  'Main Ground', 'Football Ground', 'Volleyball Court',
  'Outside Classroom Court', 'Mario',
  'Hostel Block A', 'Hostel Block B', 'Hostel Block C', 'Hostel Block D', 'Hostel Block E',
  'Outside Hostel Sitting Area', 'Others'
]

const ICONS = { Mobile: '📱', Laptop: '💻', Wallet: '👛', Bag: '🎒', Electronics: '🎧', Money: '💰', Keys: '🔑', 'ID Card': '🪪', Books: '📚', Other: '📦' }

const STATUS_BADGE = {
  pending:  { bg: 'rgba(245,158,11,0.2)',  color: '#f59e0b', icon: <Clock size={12} />,        label: 'Pending Verification' },
  approved: { bg: 'rgba(67,233,123,0.2)',  color: '#43e97b', icon: <CheckCircle size={12} />,  label: 'Claim Approved ✅' },
  rejected: { bg: 'rgba(255,101,132,0.2)', color: '#ff6584', icon: <XCircle size={12} />,      label: 'Claim Rejected' },
}

export default function LostThings() {
  const navigate = useNavigate()
  const { user, items, claims, hasUserClaimed } = useApp()
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('All')
  const [locFilter, setLocFilter] = useState('All')
  const [claimItem, setClaimItem] = useState(null) // item to claim
  const [tab, setTab] = useState('browse') // 'browse' | 'myclaims'

  useEffect(() => { if (!user) navigate('/login') }, [user])

  const filtered = items.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
    const matchCat = catFilter === 'All' || item.category === catFilter
    const matchLoc = locFilter === 'All' || item.location === locFilter
    return matchSearch && matchCat && matchLoc
  })

  const myClaims = claims.filter(c =>
    c.claimantInfo.rollno === user?.rollno && c.claimantInfo.name === user?.name
  )

  const getItemClaim = (itemId) =>
    claims.find(c => c.itemId === itemId && c.claimantInfo.rollno === user?.rollno && c.claimantInfo.name === user?.name)

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(135deg, #0f0c29 0%, #1e1b4b 50%, #0f172a 100%)' }} />
      <Particles />
      <Navbar />

      {claimItem && <ClaimForm item={claimItem} onClose={() => setClaimItem(null)} />}

      <div className="page" style={{ position: 'relative', zIndex: 10, padding: '100px 20px 60px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          <div className="animate-slide-up" style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>😟</div>
            <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 700, marginBottom: '8px' }}>
              <span className="grad-text">Search Lost Items</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
              Browse found items and submit a claim — admin will verify before returning
            </p>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', justifyContent: 'center' }}>
            {[['browse', '🔍 Browse Items'], ['myclaims', `📋 My Claims ${myClaims.length > 0 ? `(${myClaims.length})` : ''}`]].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)} className="btn" style={{
                padding: '10px 24px', fontSize: '0.9rem',
                background: tab === key ? 'linear-gradient(135deg, #6c63ff, #a855f7)' : 'rgba(255,255,255,0.07)',
                color: '#fff', border: tab === key ? 'none' : '1px solid rgba(255,255,255,0.1)',
              }}>{label}</button>
            ))}
          </div>

          {/* ── BROWSE TAB ── */}
          {tab === 'browse' && (
            <>
              {/* Search & Filters */}
              <div className="glass animate-slide-up" style={{ padding: '24px', marginBottom: '28px' }}>
                <div style={{ position: 'relative', marginBottom: '16px' }}>
                  <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                  <input className="input" placeholder="Search by item name or description..." value={search}
                    onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '46px', fontSize: '1rem' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  <div>
                    <label className="label"><Tag size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />Category</label>
                    <select className="input" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label"><MapPin size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />Location</label>
                    <select className="input" value={locFilter} onChange={e => setLocFilter(e.target.value)}>
                      {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '20px', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
                Showing <span style={{ color: '#6c63ff', fontWeight: 600 }}>{filtered.length}</span> item{filtered.length !== 1 ? 's' : ''}
              </div>

              {filtered.length === 0 ? (
                <div className="glass" style={{ padding: '60px', textAlign: 'center' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🔍</div>
                  <h3 style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>No items found</h3>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                  {filtered.map((item, i) => {
                    const myClaim = getItemClaim(item.id)
                    const alreadyClaimed = !!myClaim
                    const isReturned = item.returned

                    return (
                      <div key={item.id} className="glass" style={{
                        overflow: 'hidden', transition: 'all 0.3s',
                        animation: `slideUp 0.5s ease ${i * 0.05}s both`,
                        opacity: isReturned ? 0.55 : 1,
                      }}
                        onMouseEnter={e => { if (!isReturned) { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(108,99,255,0.2)' } }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                      >
                        {/* Photo */}
                        <div style={{
                          height: '160px',
                          background: item.photo ? 'none' : 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(255,101,132,0.1))',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          position: 'relative', overflow: 'hidden',
                        }}>
                          {item.photo
                            ? <img src={item.photo} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <span style={{ fontSize: '4rem' }}>{ICONS[item.category] || '📦'}</span>}
                          {isReturned && (
                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <span style={{ background: '#43e97b', color: '#0f0c29', padding: '6px 16px', borderRadius: '20px', fontWeight: 700, fontSize: '0.85rem' }}>✅ RETURNED</span>
                            </div>
                          )}
                          <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(108,99,255,0.85)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>
                            {item.category}
                          </div>
                        </div>

                        <div style={{ padding: '20px' }}>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>{item.name}</h3>
                          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '12px' }}>
                            {item.description}
                          </p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
                              <MapPin size={12} color="#6c63ff" /> {item.location}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
                              <Calendar size={12} color="#ff6584" /> {item.date}
                            </div>
                          </div>

                          {/* Claim status badge if already claimed by this user */}
                          {alreadyClaimed && myClaim && (
                            <div style={{
                              display: 'flex', alignItems: 'center', gap: '6px',
                              padding: '8px 12px', borderRadius: '10px', marginBottom: '10px',
                              background: STATUS_BADGE[myClaim.status].bg,
                              color: STATUS_BADGE[myClaim.status].color,
                              fontSize: '0.82rem', fontWeight: 600,
                            }}>
                              {STATUS_BADGE[myClaim.status].icon}
                              {STATUS_BADGE[myClaim.status].label}
                            </div>
                          )}

                          <button
                            className="btn btn-primary"
                            style={{
                              width: '100%', padding: '10px', fontSize: '0.9rem',
                              opacity: alreadyClaimed || isReturned ? 0.5 : 1,
                              cursor: alreadyClaimed || isReturned ? 'not-allowed' : 'pointer',
                              background: alreadyClaimed ? 'rgba(255,255,255,0.1)' : undefined,
                            }}
                            disabled={alreadyClaimed || isReturned}
                            onClick={() => !alreadyClaimed && !isReturned && setClaimItem(item)}
                          >
                            {isReturned ? '✅ Item Returned'
                              : alreadyClaimed ? '📋 Claim Submitted'
                              : '🙋 Claim This Item'}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}

          {/* ── MY CLAIMS TAB ── */}
          {tab === 'myclaims' && (
            <div className="animate-fade-in">
              {myClaims.length === 0 ? (
                <div className="glass" style={{ padding: '60px', textAlign: 'center' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📋</div>
                  <h3 style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>You haven't submitted any claims yet</h3>
                  <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={() => setTab('browse')}>
                    Browse Items
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {myClaims.map(claim => {
                    const s = STATUS_BADGE[claim.status]
                    return (
                      <div key={claim.id} className="glass" style={{ padding: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '12px', overflow: 'hidden', background: 'rgba(108,99,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {claim.itemPhoto
                            ? <img src={claim.itemPhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <span style={{ fontSize: '1.8rem' }}>📦</span>}
                        </div>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                          <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '4px' }}>{claim.itemName}</div>
                          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', marginBottom: '10px' }}>
                            {claim.itemCategory} • Submitted: {claim.submittedAt}
                          </div>
                          <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            padding: '6px 14px', borderRadius: '20px',
                            background: s.bg, color: s.color,
                            fontSize: '0.82rem', fontWeight: 700,
                          }}>
                            {s.icon} {s.label}
                          </div>
                          {claim.status === 'approved' && (
                            <div style={{ marginTop: '12px', background: 'rgba(67,233,123,0.1)', border: '1px solid rgba(67,233,123,0.25)', borderRadius: '10px', padding: '12px 14px' }}>
                              <p style={{ color: '#43e97b', fontWeight: 600, fontSize: '0.88rem', marginBottom: '4px' }}>🎉 Your claim is approved!</p>
                              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem' }}>
                                Please visit the admin office with your college ID to collect your item.
                              </p>
                            </div>
                          )}
                          {claim.status === 'rejected' && (
                            <div style={{ marginTop: '12px', background: 'rgba(255,101,132,0.1)', border: '1px solid rgba(255,101,132,0.25)', borderRadius: '10px', padding: '12px 14px' }}>
                              <p style={{ color: '#ff6584', fontWeight: 600, fontSize: '0.88rem', marginBottom: '4px' }}>❌ Claim not approved</p>
                              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem' }}>
                                Your claim was rejected. If you believe this is a mistake, contact the admin directly.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
