import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Navbar from '../components/Navbar'
import Particles from '../components/Particles'
import ClaimForm from '../components/ClaimForm'
import { Search } from 'lucide-react'

export default function LostThings() {
  const navigate = useNavigate()
  const { user, items, claims } = useApp()
  const [search, setSearch] = useState('')
  const [claimItem, setClaimItem] = useState(null)
  const [tab, setTab] = useState('browse')

  useEffect(() => { if (!user) navigate('/login') }, [user])

  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  const myClaims = claims.filter(c =>
    c.claimantInfo.rollno === user?.rollno && c.claimantInfo.name === user?.name
  )

  const getItemClaim = (itemId) =>
    claims.find(c => c.itemId === itemId && c.claimantInfo.rollno === user?.rollno)

  const STATUS_COLOR = { pending: '#f59e0b', approved: '#43e97b', rejected: '#ff6584' }
  const STATUS_LABEL = { pending: 'Pending', approved: 'Approved', rejected: 'Rejected' }

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: 'url(https://img.magnific.com/free-photo/surreal-neon-tropical-flowers_23-2151665817.jpg?semt=ais_hybrid&w=740&q=80)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'brightness(0.5)',
      }} />
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,12,41,0.4)' }} />
      <Particles />
      <Navbar />

      {claimItem && <ClaimForm item={claimItem} onClose={() => setClaimItem(null)} />}

      <div className="page" style={{ position: 'relative', zIndex: 10, padding: 'clamp(80px,10vw,100px) clamp(12px,4vw,20px) 60px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          <div className="animate-slide-up" style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 700, marginBottom: '8px', textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}>
              <span className="grad-text">Search Lost Items</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', textShadow: '0 1px 6px rgba(0,0,0,0.7)' }}>
              Browse found items and submit a claim — admin will verify before returning
            </p>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', justifyContent: 'center' }}>
            {[['browse', 'Browse Items'], ['myclaims', `My Claims${myClaims.length > 0 ? ` (${myClaims.length})` : ''}`]].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)} className="btn" style={{
                padding: '10px 24px', fontSize: '0.9rem',
                background: tab === key ? 'linear-gradient(135deg, #6c63ff, #a855f7)' : 'rgba(255,255,255,0.07)',
                color: '#fff', border: tab === key ? 'none' : '1px solid rgba(255,255,255,0.15)',
              }}>{label}</button>
            ))}
          </div>

          {/* Browse Tab */}
          {tab === 'browse' && (
            <>
              <div style={{ position: 'relative', marginBottom: '28px', maxWidth: '480px', margin: '0 auto 28px' }}>
                <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                <input className="input" placeholder="Search item name..." value={search}
                  onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '46px', fontSize: '1rem' }} />
              </div>

              {filtered.length === 0 ? (
                <div className="glass" style={{ padding: '60px', textAlign: 'center' }}>
                  <h3 style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>No items found</h3>
                </div>
              ) : (
                <div className="lost-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                  {filtered.map((item, i) => {
                    const myClaim = getItemClaim(item.id)
                    const alreadyClaimed = !!myClaim
                    const isReturned = item.returned
                    return (
                      <div key={item.id} className="glass" style={{
                        overflow: 'hidden', transition: 'all 0.3s',
                        animation: `slideUp 0.4s ease ${i * 0.04}s both`,
                        opacity: isReturned ? 0.75 : 1,
                        cursor: isReturned || alreadyClaimed ? 'default' : 'pointer',
                      }}
                        onMouseEnter={e => { if (!isReturned) { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(108,99,255,0.25)' } }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                      >
                        {/* Image */}
                        <div style={{ height: '180px', position: 'relative', overflow: 'hidden', background: 'rgba(108,99,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {item.photo
                            ? <img src={item.photo} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <span style={{ fontSize: '3.5rem', opacity: 0.4 }}>?</span>}
                          {isReturned && (
                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '12px' }}>
                              <span style={{ background: '#43e97b', color: '#0f0c29', padding: '5px 14px', borderRadius: '20px', fontWeight: 700, fontSize: '0.8rem' }}>RETURNED</span>
                              {item.approvedClaimantName && (
                                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.72rem', fontWeight: 600, textAlign: 'center', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                                  {item.approvedClaimantName}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Name + Button */}
                        <div style={{ padding: '14px 16px' }}>
                          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>{item.name}</h3>

                          {/* Returned-to info — visible to ALL users */}
                          {isReturned && item.approvedClaimantName && (
                            <div style={{
                              background: 'rgba(67,233,123,0.1)', border: '1px solid rgba(67,233,123,0.25)',
                              borderRadius: '10px', padding: '8px 12px', marginBottom: '10px', textAlign: 'center',
                            }}>
                              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginBottom: '3px' }}>Returned to</div>
                              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#43e97b' }}>{item.approvedClaimantName}</div>
                              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>{item.approvedClaimantRollno}</div>
                            </div>
                          )}

                          {alreadyClaimed && myClaim && !isReturned && (
                            <div style={{ textAlign: 'center', marginBottom: '8px', fontSize: '0.78rem', fontWeight: 600, color: STATUS_COLOR[myClaim.status] }}>
                              {STATUS_LABEL[myClaim.status]}
                            </div>
                          )}

                          <button
                            className="btn btn-primary"
                            style={{
                              width: '100%', padding: '9px', fontSize: '0.85rem',
                              opacity: alreadyClaimed || isReturned ? 0.5 : 1,
                              cursor: alreadyClaimed || isReturned ? 'not-allowed' : 'pointer',
                              background: alreadyClaimed ? 'rgba(255,255,255,0.08)' : undefined,
                            }}
                            disabled={alreadyClaimed || isReturned}
                            onClick={() => !alreadyClaimed && !isReturned && setClaimItem(item)}
                          >
                            {isReturned ? 'Returned' : alreadyClaimed ? 'Claimed' : 'Claim This Item'}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}

          {/* My Claims Tab */}
          {tab === 'myclaims' && (
            <div className="animate-fade-in">
              {myClaims.length === 0 ? (
                <div className="glass" style={{ padding: '60px', textAlign: 'center' }}>
                  <h3 style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>No claims yet</h3>
                  <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={() => setTab('browse')}>Browse Items</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {myClaims.map(claim => {
                    const color = STATUS_COLOR[claim.status]
                    const bg = claim.status === 'approved' ? 'rgba(67,233,123,0.1)' : claim.status === 'rejected' ? 'rgba(255,101,132,0.1)' : 'rgba(245,158,11,0.1)'
                    const approvedItem = items.find(i => i.id === claim.itemId)
                    return (
                      <div key={claim.id} className="glass" style={{ padding: '20px', display: 'flex', gap: '14px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '10px', overflow: 'hidden', background: 'rgba(108,99,255,0.2)', flexShrink: 0 }}>
                          {claim.itemPhoto ? <img src={claim.itemPhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                        </div>
                        <div style={{ flex: 1, minWidth: '160px' }}>
                          <div style={{ fontWeight: 700, marginBottom: '4px' }}>{claim.itemName}</div>
                          <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', marginBottom: '10px' }}>Submitted: {claim.submittedAt}</div>
                          <span style={{ padding: '5px 14px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, background: bg, color }}>{STATUS_LABEL[claim.status]}</span>
                          {claim.status === 'approved' && (
                            <div style={{ marginTop: '12px', background: 'rgba(67,233,123,0.1)', border: '1px solid rgba(67,233,123,0.25)', borderRadius: '10px', padding: '12px 14px' }}>
                              <div style={{ color: '#43e97b', fontWeight: 700, fontSize: '0.88rem', marginBottom: '4px' }}>Your claim is approved!</div>
                              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>Visit the admin office with your college ID to collect your item.</div>
                            </div>
                          )}
                          {claim.status === 'rejected' && approvedItem?.approvedClaimantName && (
                            <div style={{ marginTop: '12px', background: 'rgba(255,101,132,0.08)', border: '1px solid rgba(255,101,132,0.2)', borderRadius: '10px', padding: '12px 14px' }}>
                              <div style={{ color: '#ff6584', fontWeight: 700, fontSize: '0.85rem', marginBottom: '6px' }}>Claim not approved</div>
                              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>This item was returned to:</div>
                              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>{approvedItem.approvedClaimantName}</div>
                              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)' }}>{approvedItem.approvedClaimantRollno}</div>
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
