import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Navbar from '../components/Navbar'
import Particles from '../components/Particles'
import { Trash2, Upload, BarChart3, Package, CheckCircle, Clock, FileText, ChevronDown, ChevronUp } from 'lucide-react'

const CATEGORIES = ['Mobile', 'Laptop', 'Wallet', 'Bag', 'Electronics', 'Money', 'Keys', 'ID Card', 'Books', 'Other']
const LOCATIONS = [
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

export default function AdminPanel() {
  const navigate = useNavigate()
  const { user, isAdmin, items, addItem, deleteItem, claims, approveClaim, rejectClaim, deleteClaim } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', category: '', location: '', date: '', description: '', notes: '', photo: null })
  const [preview, setPreview] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    if (!user || !isAdmin) navigate('/login')
  }, [user, isAdmin])

  const [expandedClaim, setExpandedClaim] = useState(null)

  const pendingClaims = claims.filter(c => c.status === 'pending')

  const stats = [
    { label: 'Total Items', value: items.length, icon: <Package size={24} />, color: '#6c63ff', bg: 'rgba(108,99,255,0.15)' },
    { label: 'Returned', value: items.filter(i => i.returned).length, icon: <CheckCircle size={24} />, color: '#43e97b', bg: 'rgba(67,233,123,0.15)' },
    { label: 'Pending Claims', value: pendingClaims.length, icon: <Clock size={24} />, color: '#ff6584', bg: 'rgba(255,101,132,0.15)' },
    { label: 'Categories', value: [...new Set(items.map(i => i.category))].length, icon: <BarChart3 size={24} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  ]

  const catCounts = CATEGORIES.map(c => ({ name: c, count: items.filter(i => i.category === c).length })).filter(c => c.count > 0)
  const maxCount = Math.max(...catCounts.map(c => c.count), 1)

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (file) { setForm({ ...form, photo: file.name }); setPreview(URL.createObjectURL(file)) }
  }

  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.name || !form.category || !form.location || !form.date || !form.description) return
    addItem({ ...form, photo: preview })
    setForm({ name: '', category: '', location: '', date: '', description: '', notes: '', photo: null })
    setPreview(null)
    setShowForm(false)
  }

  const TABS = [
    { key: 'dashboard', label: '📊 Dashboard' },
    { key: 'items', label: '📦 Manage Items' },
    { key: 'claims', label: `🙋 Claims${pendingClaims.length ? ` (${pendingClaims.length})` : ''}` },
    { key: 'add', label: '➕ Add Item' },
  ]

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(135deg, #0f0c29 0%, #1a0533 50%, #0d1b2a 100%)' }} />
      <Particles />
      <Navbar />

      <div className="page" style={{ position: 'relative', zIndex: 10, padding: '100px 20px 60px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          {/* Header */}
          <div className="animate-slide-up" style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '3rem' }}>👑</div>
              <div>
                <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 700 }}>
                  <span className="grad-text">Admin Panel</span>
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Manage all lost & found items</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
            {TABS.map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)} className="btn" style={{
                padding: '10px 20px', fontSize: '0.9rem',
                background: activeTab === t.key ? 'linear-gradient(135deg, #6c63ff, #a855f7)' : 'rgba(255,255,255,0.07)',
                color: '#fff', border: activeTab === t.key ? 'none' : '1px solid rgba(255,255,255,0.1)',
              }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="animate-fade-in">
              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                {stats.map(s => (
                  <div key={s.label} className="glass" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ padding: '12px', borderRadius: '12px', background: s.bg, color: s.color }}>{s.icon}</div>
                    <div>
                      <div style={{ fontSize: '2rem', fontWeight: 700, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Category chart */}
              <div className="glass" style={{ padding: '28px' }}>
                <h3 style={{ fontWeight: 600, marginBottom: '24px', fontSize: '1.1rem' }}>📊 Items by Category</h3>
                {catCounts.length === 0 ? (
                  <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '20px' }}>No items yet</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {catCounts.map(c => (
                      <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ width: '80px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', flexShrink: 0 }}>{c.name}</span>
                        <div style={{ flex: 1, height: '28px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
                          <div style={{
                            height: '100%', borderRadius: '6px',
                            width: `${(c.count / maxCount) * 100}%`,
                            background: 'linear-gradient(90deg, #6c63ff, #a855f7)',
                            transition: 'width 1s ease',
                            display: 'flex', alignItems: 'center', paddingLeft: '10px',
                            fontSize: '0.8rem', fontWeight: 600,
                          }}>
                            {c.count}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Manage Items Tab */}
          {activeTab === 'items' && (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {items.length === 0 ? (
                  <div className="glass" style={{ padding: '60px', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📭</div>
                    <p style={{ color: 'rgba(255,255,255,0.5)' }}>No items in the system</p>
                  </div>
                ) : items.map(item => {
                  const itemClaims = claims.filter(c => c.itemId === item.id)
                  return (
                    <div key={item.id} className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(108,99,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', flexShrink: 0, overflow: 'hidden' }}>
                        {item.photo ? <img src={item.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '📦'}
                      </div>
                      <div style={{ flex: 1, minWidth: '150px' }}>
                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>{item.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{item.category} • {item.location} • {item.date}</div>
                        {itemClaims.length > 0 && <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '4px' }}>🙋 {itemClaims.length} claim(s)</div>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{
                          padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600,
                          background: item.returned ? 'rgba(67,233,123,0.2)' : 'rgba(255,101,132,0.2)',
                          color: item.returned ? '#43e97b' : '#ff6584',
                        }}>
                          {item.returned ? '✅ Returned' : '⏳ Available'}
                        </span>
                        <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => deleteItem(item.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Claims Tab */}
          {activeTab === 'claims' && (
            <div className="animate-fade-in">
              {claims.length === 0 ? (
                <div className="glass" style={{ padding: '60px', textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📋</div>
                  <p style={{ color: 'rgba(255,255,255,0.5)' }}>No claims submitted yet</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {claims.map(claim => {
                    const info = claim.claimantInfo
                    const isExpanded = expandedClaim === claim.id
                    const statusColor = claim.status === 'approved' ? '#43e97b' : claim.status === 'rejected' ? '#ff6584' : '#f59e0b'
                    const statusBg = claim.status === 'approved' ? 'rgba(67,233,123,0.15)' : claim.status === 'rejected' ? 'rgba(255,101,132,0.15)' : 'rgba(245,158,11,0.15)'
                    return (
                      <div key={claim.id} className="glass" style={{ overflow: 'hidden' }}>
                        {/* Claim header */}
                        <div style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', cursor: 'pointer' }}
                          onClick={() => setExpandedClaim(isExpanded ? null : claim.id)}>
                          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(108,99,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                            {claim.itemPhoto ? <img src={claim.itemPhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '📦'}
                          </div>
                          <div style={{ flex: 1, minWidth: '140px' }}>
                            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{claim.itemName}</div>
                            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>
                              {info.name} • {info.rollno} • {claim.submittedAt}
                            </div>
                          </div>
                          <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, background: statusBg, color: statusColor }}>
                            {claim.status === 'approved' ? '✅ Approved' : claim.status === 'rejected' ? '❌ Rejected' : '⏳ Pending'}
                          </span>
                          {isExpanded ? <ChevronUp size={16} color="rgba(255,255,255,0.4)" /> : <ChevronDown size={16} color="rgba(255,255,255,0.4)" />}
                        </div>

                        {/* Expanded details */}
                        {isExpanded && (
                          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                              {[
                                ['👤 Full Name', info.name],
                                ['🎓 Register No.', info.rollno],
                                ['🏫 Department', info.dept],
                                ['📅 Year', info.year],
                                ['📞 Phone', info.phone],
                                ['📍 Lost Location', info.lostLocation],
                                ['📆 Date Lost', info.lostDate],
                                ['⏰ Time Lost', info.lostTime || '—'],
                                ['🏷 Brand', info.brand || '—'],
                                ['🎨 Color', info.color || '—'],
                              ].map(([label, val]) => (
                                <div key={label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '10px 14px' }}>
                                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>{label}</div>
                                  <div style={{ fontSize: '0.88rem', fontWeight: 500 }}>{val}</div>
                                </div>
                              ))}
                            </div>
                            {[
                              ['🔎 Item Description', info.itemDescription],
                              ['📦 Contents', info.itemContents],
                              ['🔑 Unique Identification', info.uniqueId],
                              ['💬 Why it\'s theirs', info.reason],
                            ].filter(([, v]) => v).map(([label, val]) => (
                              <div key={label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '12px 14px', marginBottom: '8px' }}>
                                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>{label}</div>
                                <div style={{ fontSize: '0.88rem', lineHeight: 1.6 }}>{val}</div>
                              </div>
                            ))}

                            {claim.status === 'pending' && (
                              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                                <button className="btn btn-success" style={{ flex: 1 }} onClick={() => approveClaim(claim.id)}>
                                  ✅ Approve & Return to Owner
                                </button>
                                <button className="btn" style={{ flex: 1, background: 'rgba(255,101,132,0.2)', color: '#ff6584', border: '1px solid rgba(255,101,132,0.3)' }} onClick={() => rejectClaim(claim.id)}>
                                  ❌ Reject Claim
                                </button>
                              </div>
                            )}
                            {claim.status !== 'pending' && (
                              <button className="btn btn-secondary" style={{ marginTop: '12px', fontSize: '0.8rem' }} onClick={() => deleteClaim(claim.id)}>
                                <Trash2 size={14} /> Remove Record
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Add Item Tab */}
          {activeTab === 'add' && (
            <div className="animate-fade-in">
              <form className="glass" style={{ padding: 'clamp(24px, 5vw, 40px)' }} onSubmit={handleAdd}>
                <h3 style={{ fontWeight: 700, marginBottom: '24px', fontSize: '1.2rem' }}>➕ Add New Found Item</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="label">Item Name *</label>
                    <input className="input" placeholder="Item name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="label">Category *</label>
                    <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required>
                      <option value="">Select</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="label">Location *</label>
                    <select className="input" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required>
                      <option value="">Select</option>
                      {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="label">Date *</label>
                    <input className="input" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="label">Description *</label>
                    <textarea className="input" rows={3} placeholder="Describe the item..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ resize: 'vertical' }} required />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="label">Photo</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: '2px dashed rgba(108,99,255,0.4)', borderRadius: '12px', cursor: 'pointer', background: 'rgba(108,99,255,0.05)' }}>
                      {preview ? <img src={preview} alt="" style={{ height: '60px', borderRadius: '8px' }} /> : <Upload size={24} color="#6c63ff" />}
                      <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>{form.photo || 'Click to upload'}</span>
                      <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
                    </label>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px', padding: '14px' }}>
                  ➕ Add Item to System
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
