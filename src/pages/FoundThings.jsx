import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Navbar from '../components/Navbar'
import Particles from '../components/Particles'
import { Upload, CheckCircle } from 'lucide-react'

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

export default function FoundThings() {
  const navigate = useNavigate()
  const { user, addItem } = useApp()
  const [form, setForm] = useState({ name: '', category: '', location: '', date: '', time: '', description: '', notes: '', photo: null })
  const [preview, setPreview] = useState(null)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => { if (!user) navigate('/login') }, [user])

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (file) {
      setForm({ ...form, photo: file.name })
      setPreview(URL.createObjectURL(file))
    }
  }

  const validate = () => {
    const e = {}
    if (!form.name) e.name = 'Required'
    if (!form.category) e.category = 'Required'
    if (!form.location) e.location = 'Required'
    if (!form.date) e.date = 'Required'
    if (!form.description) e.description = 'Required'
    if (!preview) e.photo = 'Photo is required'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    addItem({ ...form, photo: preview })
    setSuccess(true)
    setTimeout(() => { setSuccess(false); navigate('/dashboard') }, 2500)
  }

  if (success) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0f0c29, #302b63)' }}>
      <div className="glass animate-slide-up" style={{ padding: '60px 40px', textAlign: 'center', maxWidth: '400px' }}>
        <CheckCircle size={64} color="#43e97b" style={{ marginBottom: '20px' }} />
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '12px', color: '#43e97b' }}>Item Reported!</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)' }}>Thank you for helping. Redirecting to dashboard...</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(135deg, #0f0c29 0%, #1a1a3e 50%, #0d1b2a 100%)' }} />
      <Particles />
      <Navbar />

      <div className="page" style={{ position: 'relative', zIndex: 10, padding: '100px 20px 60px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>

          <div className="animate-slide-up" style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔍</div>
            <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 700, marginBottom: '8px' }}>
              <span className="grad-text">Report Found Item</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
              Fill in the details of the item you found
            </p>
          </div>

          <form className="glass animate-slide-up" style={{ padding: 'clamp(24px, 5vw, 40px)' }} onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>

              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="label">Item Name *</label>
                <input className="input" placeholder="e.g. iPhone 13, Blue Backpack" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                {errors.name && <span style={{ color: '#ff6584', fontSize: '0.75rem' }}>{errors.name}</span>}
              </div>

              <div className="form-group">
                <label className="label">Category *</label>
                <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  <option value="">Select Category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <span style={{ color: '#ff6584', fontSize: '0.75rem' }}>{errors.category}</span>}
              </div>

              <div className="form-group">
                <label className="label">Location Found *</label>
                <select className="input" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}>
                  <option value="">Select Location</option>
                  {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                {errors.location && <span style={{ color: '#ff6584', fontSize: '0.75rem' }}>{errors.location}</span>}
              </div>

              <div className="form-group">
                <label className="label">Date Found *</label>
                <input className="input" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                {errors.date && <span style={{ color: '#ff6584', fontSize: '0.75rem' }}>{errors.date}</span>}
              </div>

              <div className="form-group">
                <label className="label">Time Found</label>
                <input className="input" type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
              </div>

              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="label">Description *</label>
                <textarea className="input" rows={3} placeholder="Describe the item in detail..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ resize: 'vertical' }} />
                {errors.description && <span style={{ color: '#ff6584', fontSize: '0.75rem' }}>{errors.description}</span>}
              </div>

              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="label">Photo Upload *</label>
                <label style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  padding: '32px', border: `2px dashed ${errors.photo ? '#ff6584' : 'rgba(108,99,255,0.4)'}`, borderRadius: '12px',
                  cursor: 'pointer', transition: 'all 0.3s', background: 'rgba(108,99,255,0.05)',
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#6c63ff'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = errors.photo ? '#ff6584' : 'rgba(108,99,255,0.4)'}
                >
                  {preview ? (
                    <img src={preview} alt="preview" style={{ maxHeight: '160px', borderRadius: '8px', objectFit: 'cover' }} />
                  ) : (
                    <>
                      <Upload size={32} color={errors.photo ? '#ff6584' : '#6c63ff'} style={{ marginBottom: '8px' }} />
                      <span style={{ color: errors.photo ? '#ff6584' : 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Click to upload photo (required)</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
                </label>
                {errors.photo && <span style={{ color: '#ff6584', fontSize: '0.75rem' }}>{errors.photo}</span>}
              </div>

              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="label">Additional Notes (Optional)</label>
                <textarea className="input" rows={2} placeholder="Any extra information..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ resize: 'vertical' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => navigate('/dashboard')}>
                Cancel
              </button>
              <button type="submit" className="btn btn-success" style={{ flex: 2 }}>
                📤 Submit Found Item
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
