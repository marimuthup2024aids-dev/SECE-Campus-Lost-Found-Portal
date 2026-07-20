import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { X, CheckCircle, AlertCircle } from 'lucide-react'

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

export default function ClaimForm({ item, onClose }) {
  const { user, submitClaim } = useApp()
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    rollno: user?.rollno || '',
    dept: user?.dept || '',
    year: user?.year || '',
    phone: '',
    lostLocation: '',
    lostDate: '',
    lostTime: '',
  })
  const [errors, setErrors] = useState({})
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.phone) e.phone = 'Required'
    if (!form.lostLocation) e.lostLocation = 'Required'
    if (!form.lostDate) e.lostDate = 'Required'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    submitClaim(item.id, form)
    setDone(true)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="glass animate-slide-up" style={{
        width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto',
        padding: 'clamp(24px, 5vw, 36px)', position: 'relative',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '14px', right: '14px',
          background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%',
          width: '34px', height: '34px', cursor: 'pointer', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><X size={16} /></button>

        {done ? (
          <div style={{ textAlign: 'center', padding: '32px 16px' }}>
            <CheckCircle size={64} color="#43e97b" style={{ marginBottom: '16px' }} />
            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#43e97b', marginBottom: '10px' }}>Claim Submitted!</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '20px' }}>
              Your claim for <strong style={{ color: '#fff' }}>{item.name}</strong> is under review.
            </p>
            <div style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '10px', padding: '14px', marginBottom: '20px', display: 'flex', gap: '10px', textAlign: 'left' }}>
              <AlertCircle size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.83rem', lineHeight: 1.6 }}>
                Admin will verify and approve the rightful owner. Check status in My Claims.
              </p>
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ marginBottom: '20px', paddingRight: '36px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '10px', overflow: 'hidden', background: 'rgba(108,99,255,0.2)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.photo ? <img src={item.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Claim: {item.name}</h2>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem' }}>{item.category} • Found at {item.location}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

                <div className="form-group">
                  <label className="label">Full Name *</label>
                  <input className="input" value={form.name} onChange={e => set('name', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="label">Roll Number *</label>
                  <input className="input" value={form.rollno} onChange={e => set('rollno', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="label">Department *</label>
                  <input className="input" value={form.dept} onChange={e => set('dept', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="label">Year *</label>
                  <input className="input" value={form.year} onChange={e => set('year', e.target.value)} />
                </div>

                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="label">Contact Number *</label>
                  <input className="input" type="tel" placeholder="10-digit mobile number" value={form.phone} onChange={e => set('phone', e.target.value)} maxLength={10} />
                  {errors.phone && <span style={{ color: '#ff6584', fontSize: '0.75rem' }}>{errors.phone}</span>}
                </div>

                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="label">Where did you lose it? *</label>
                  <select className="input" value={form.lostLocation} onChange={e => set('lostLocation', e.target.value)}>
                    <option value="">Select location</option>
                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                  {errors.lostLocation && <span style={{ color: '#ff6584', fontSize: '0.75rem' }}>{errors.lostLocation}</span>}
                </div>

                <div className="form-group">
                  <label className="label">Date Lost *</label>
                  <input className="input" type="date" value={form.lostDate} onChange={e => set('lostDate', e.target.value)} />
                  {errors.lostDate && <span style={{ color: '#ff6584', fontSize: '0.75rem' }}>{errors.lostDate}</span>}
                </div>

                <div className="form-group">
                  <label className="label">Time Lost</label>
                  <input className="input" type="time" value={form.lostTime} onChange={e => set('lostTime', e.target.value)} />
                </div>

              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
                <button type="button" className="btn btn-outline" style={{ flex: '1 1 120px' }} onClick={onClose}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: '2 1 180px', padding: '13px' }}>Submit Claim</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
