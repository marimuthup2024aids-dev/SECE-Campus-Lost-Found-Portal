import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Navbar from '../components/Navbar'
import Particles from '../components/Particles'
import { Trash2, Upload, Package, CheckCircle, Clock, ChevronDown, ChevronUp, Bell, User } from 'lucide-react'

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

function InfoGrid({ rows }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '8px' }}>
      {rows.filter(([, v]) => v).map(([label, val]) => (
        <div key={label} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px 12px' }}>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: '3px' }}>{label}</div>
          <div style={{ fontSize: '0.88rem', fontWeight: 500 }}>{val}</div>
        </div>
      ))}
    </div>
  )
}

export default function AdminPanel() {
  const navigate = useNavigate()
  const { user, isAdmin, items, addItem, deleteItem, claims, approveClaim, rejectClaim } = useApp()
  const [activeTab, setActiveTab] = useState('items')
  const [expandedItem, setExpandedItem] = useState(null)
  const [form, setForm] = useState({ name: '', category: '', location: '', date: '', description: '', photo: null })
  const [preview, setPreview] = useState(null)
  const [founderForm, setFounderForm] = useState({ name: '', rollno: '', dept: '', year: '', phone: '', foundLocation: '', foundDate: '', foundTime: '' })

  useEffect(() => { if (!user || !isAdmin) navigate('/login') }, [user, isAdmin])

  const totalPending = claims.filter(c => c.status === 'pending').length

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (file) { setForm(p => ({ ...p, photo: file.name })); setPreview(URL.createObjectURL(file)) }
  }

  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.name || !form.category || !form.location || !form.date || !form.description) return
    addItem({ ...form, photo: preview }, { ...founderForm })
    setForm({ name: '', category: '', location: '', date: '', description: '', photo: null })
    setFounderForm({ name: '', rollno: '', dept: '', year: '', phone: '', foundLocation: '', foundDate: '', foundTime: '' })
    setPreview(null)
    setActiveTab('items')
  }

  const TABS = [
    { key: 'items', label: 'Items', badge: items.length },
    { key: 'add', label: 'Add Item' },
  ]

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(135deg, #0f0c29 0%, #1a0533 50%, #0d1b2a 100%)' }} />
      <Particles />
      <Navbar />

      <div className="page" style={{ position: 'relative', zIndex: 10, padding: 'clamp(80px,10vw,100px) clamp(12px,4vw,20px) 60px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '28px' }}>
            <div>
              <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 700 }}>
                <span className="grad-text">Admin Panel</span>
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem' }}>Manage found items and verify claims</p>
            </div>
            {/* Stats row */}
            <div className="admin-stats" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {[
                { label: 'Total Items', value: items.length, color: '#6c63ff', icon: <Package size={16} /> },
                { label: 'Returned', value: items.filter(i => i.returned).length, color: '#43e97b', icon: <CheckCircle size={16} /> },
                { label: 'Pending Claims', value: totalPending, color: '#f59e0b', icon: <Bell size={16} /> },
              ].map(s => (
                <div key={s.label} className="glass" style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: s.color }}>{s.icon}</span>
                  <span style={{ fontWeight: 700, color: s.color, fontSize: '1.1rem' }}>{s.value}</span>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)' }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="admin-tabs" style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {TABS.map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)} className="btn" style={{
                padding: '9px 20px', fontSize: '0.88rem', position: 'relative',
                background: activeTab === t.key ? 'linear-gradient(135deg, #6c63ff, #a855f7)' : 'rgba(255,255,255,0.07)',
                color: '#fff', border: activeTab === t.key ? 'none' : '1px solid rgba(255,255,255,0.1)',
              }}>
                {t.label}
                {t.badge > 0 && (
                  <span style={{ marginLeft: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '1px 7px', fontSize: '0.75rem' }}>{t.badge}</span>
                )}
              </button>
            ))}
          </div>

          {/* ── ITEMS TAB ── */}
          {activeTab === 'items' && (
            <div className="animate-fade-in">
              {items.length === 0 ? (
                <div className="glass" style={{ padding: '60px', textAlign: 'center' }}>
                  <p style={{ color: 'rgba(255,255,255,0.4)' }}>No items yet. Add one using the Add Item tab.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {items.map(item => {
                    const itemClaims = claims.filter(c => c.itemId === item.id)
                    const pendingCount = itemClaims.filter(c => c.status === 'pending').length
                    const isExpanded = expandedItem === item.id

                    return (
                      <div key={item.id} className="glass" style={{ overflow: 'hidden' }}>
                        {/* Item row */}
                        <div
                          style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', cursor: 'pointer' }}
                          onClick={() => setExpandedItem(isExpanded ? null : item.id)}
                        >
                          {/* Thumb */}
                          <div style={{ width: '56px', height: '56px', borderRadius: '10px', overflow: 'hidden', background: 'rgba(108,99,255,0.2)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {item.photo ? <img src={item.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Package size={22} color="rgba(255,255,255,0.3)" />}
                          </div>

                          {/* Info */}
                          <div style={{ flex: 1, minWidth: '140px' }}>
                            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '3px' }}>{item.name}</div>
                            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>
                              {item.category} • {item.location} • {item.date}
                            </div>
                          </div>

                          {/* Claim badge */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            {item.returned ? (
                              <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, background: 'rgba(67,233,123,0.2)', color: '#43e97b' }}>Returned</span>
                            ) : pendingCount > 0 ? (
                              <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, background: 'rgba(245,158,11,0.2)', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Bell size={12} /> {pendingCount} Claim{pendingCount > 1 ? 's' : ''}
                              </span>
                            ) : itemClaims.length === 0 ? (
                              <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>Not Claimed</span>
                            ) : (
                              <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, background: 'rgba(108,99,255,0.2)', color: '#a78bfa' }}>{itemClaims.length} Claim{itemClaims.length > 1 ? 's' : ''}</span>
                            )}
                            <button className="btn btn-secondary" style={{ padding: '5px 10px' }} onClick={e => { e.stopPropagation(); deleteItem(item.id) }}>
                              <Trash2 size={13} />
                            </button>
                          </div>

                          {isExpanded ? <ChevronUp size={16} color="rgba(255,255,255,0.35)" /> : <ChevronDown size={16} color="rgba(255,255,255,0.35)" />}
                        </div>

                        {/* Expanded: Founder + Claimants */}
                        {isExpanded && (
                          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '20px' }}>

                            {/* Founder Details */}
                            <div style={{ marginBottom: '20px' }}>
                              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#43e97b', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <User size={12} /> Founder Details
                              </div>
                              {item.founderInfo && (item.founderInfo.name || item.founderInfo.phone) ? (
                                <InfoGrid rows={[
                                  ['Name', item.founderInfo.name],
                                  ['Roll No.', item.founderInfo.rollno],
                                  ['Dept', item.founderInfo.dept],
                                  ['Year', item.founderInfo.year],
                                  ['Phone', item.founderInfo.phone],
                                  ['Found At', item.founderInfo.foundLocation],
                                  ['Found Date', item.founderInfo.foundDate],
                                  ['Found Time', item.founderInfo.foundTime],
                                ]} />
                              ) : (
                                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem' }}>No founder info recorded.</p>
                              )}
                              {item.description && (
                                <div style={{ marginTop: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '10px 12px' }}>
                                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: '3px' }}>Item Description</div>
                                  <div style={{ fontSize: '0.85rem' }}>{item.description}</div>
                                </div>
                              )}
                            </div>

                            {/* Claimants */}
                            {itemClaims.length === 0 ? (
                              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', padding: '12px 0' }}>No claims submitted for this item yet.</div>
                            ) : (
                              <div>
                                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f59e0b', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <Bell size={12} /> {itemClaims.length} Claimant{itemClaims.length > 1 ? 's' : ''}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                  {itemClaims.map((claim, idx) => {
                                    const info = claim.claimantInfo
                                    const statusColor = claim.status === 'approved' ? '#43e97b' : claim.status === 'rejected' ? '#ff6584' : '#f59e0b'
                                    const statusBg = claim.status === 'approved' ? 'rgba(67,233,123,0.12)' : claim.status === 'rejected' ? 'rgba(255,101,132,0.12)' : 'rgba(245,158,11,0.12)'
                                    return (
                                      <div key={claim.id} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '14px', border: `1px solid ${statusBg}` }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                                          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Claimant #{idx + 1} — {info.name}</span>
                                          <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, background: statusBg, color: statusColor }}>
                                            {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                                          </span>
                                        </div>
                                        <InfoGrid rows={[
                                          ['Roll No.', info.rollno],
                                          ['Dept', info.dept],
                                          ['Year', info.year],
                                          ['Phone', info.phone],
                                          ['Lost At', info.lostLocation],
                                          ['Date Lost', info.lostDate],
                                          ['Time Lost', info.lostTime],
                                          ['Submitted', claim.submittedAt],
                                        ]} />
                                        {claim.status === 'pending' && !item.returned && (
                                          <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                                            <button className="btn btn-success" style={{ flex: '1 1 160px', padding: '9px', fontSize: '0.85rem' }} onClick={() => approveClaim(claim.id)}>
                                              Approve — This is the Owner
                                            </button>
                                            <button className="btn" style={{ flex: '1 1 80px', padding: '9px', fontSize: '0.85rem', background: 'rgba(255,101,132,0.15)', color: '#ff6584', border: '1px solid rgba(255,101,132,0.3)' }} onClick={() => rejectClaim(claim.id)}>
                                              Reject
                                            </button>
                                          </div>
                                        )}
                                        {claim.status === 'approved' && (
                                          <div style={{ marginTop: '10px', background: 'rgba(67,233,123,0.1)', borderRadius: '8px', padding: '10px 12px', fontSize: '0.82rem', color: '#43e97b' }}>
                                            Approved — Owner verified. Item ready for collection.
                                          </div>
                                        )}
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
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

          {/* ── ADD ITEM TAB ── */}
          {activeTab === 'add' && (
            <div className="animate-fade-in">
              <form className="glass" style={{ padding: 'clamp(24px, 5vw, 40px)' }} onSubmit={handleAdd}>

                {/* Item Details */}
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6c63ff', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(108,99,255,0.3)' }} />
                  Item Details
                  <div style={{ flex: 1, height: '1px', background: 'rgba(108,99,255,0.3)' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="label">Item Name *</label>
                    <input className="input" placeholder="Item name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="label">Category *</label>
                    <select className="input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} required>
                      <option value="">Select</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="label">Location Found *</label>
                    <select className="input" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} required>
                      <option value="">Select</option>
                      {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="label">Date Found *</label>
                    <input className="input" type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} required />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="label">Description *</label>
                    <textarea className="input" rows={2} placeholder="Describe the item..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} style={{ resize: 'vertical' }} required />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="label">Photo</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', border: '2px dashed rgba(108,99,255,0.4)', borderRadius: '10px', cursor: 'pointer', background: 'rgba(108,99,255,0.05)' }}>
                      {preview ? <img src={preview} alt="" style={{ height: '56px', borderRadius: '6px' }} /> : <Upload size={22} color="#6c63ff" />}
                      <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.88rem' }}>{form.photo || 'Click to upload'}</span>
                      <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
                    </label>
                  </div>
                </div>

                {/* Founder Details */}
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#43e97b', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(67,233,123,0.3)' }} />
                  Founder Details
                  <div style={{ flex: 1, height: '1px', background: 'rgba(67,233,123,0.3)' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' }}>
                  {[
                    { label: 'Founder Name', key: 'name', placeholder: 'Full name' },
                    { label: 'Roll Number', key: 'rollno', placeholder: 'e.g. 22CSE001' },
                    { label: 'Department', key: 'dept', placeholder: 'e.g. CSE' },
                    { label: 'Year', key: 'year', placeholder: 'e.g. II' },
                    { label: 'Phone', key: 'phone', placeholder: '10-digit number' },
                  ].map(f => (
                    <div key={f.key} className="form-group">
                      <label className="label">{f.label}</label>
                      <input className="input" placeholder={f.placeholder} value={founderForm[f.key]} onChange={e => setFounderForm(p => ({ ...p, [f.key]: e.target.value }))} />
                    </div>
                  ))}
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="label">Where was it found?</label>
                    <select className="input" value={founderForm.foundLocation} onChange={e => setFounderForm(p => ({ ...p, foundLocation: e.target.value }))}>
                      <option value="">Select location</option>
                      {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="label">Date Found</label>
                    <input className="input" type="date" value={founderForm.foundDate} onChange={e => setFounderForm(p => ({ ...p, foundDate: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="label">Time Found</label>
                    <input className="input" type="time" value={founderForm.foundTime} onChange={e => setFounderForm(p => ({ ...p, foundTime: e.target.value }))} />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px' }}>
                  Add Item to System
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
