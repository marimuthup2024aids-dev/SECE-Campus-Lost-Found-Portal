import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Navbar from '../components/Navbar'
import Particles from '../components/Particles'
import { Upload, CheckCircle, Camera } from 'lucide-react'

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

const sectionStyle = (color) => ({
  fontSize: '0.7rem', fontWeight: 700, color,
  letterSpacing: '1.5px', textTransform: 'uppercase',
  marginBottom: '14px', marginTop: '4px',
  display: 'flex', alignItems: 'center', gap: '8px',
})
const divider = (color) => ({ flex: 1, height: '1px', background: color })

export default function FoundThings() {
  const navigate = useNavigate()
  const { user, addItem } = useApp()
  const [form, setForm] = useState({ name: '', category: '', location: '', date: '', time: '', description: '', notes: '' })
  const [preview, setPreview] = useState(null)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState({})
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  useEffect(() => { if (!user) navigate('/login') }, [user])

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (file) setPreview(URL.createObjectURL(file))
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
        <p style={{ color: 'rgba(255,255,255,0.6)' }}>Thank you for helping. Redirecting...</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: 'url(https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832_1280.jpg)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'brightness(0.55)',
      }} />
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(13,27,42,0.4)' }} />
      <Particles />
      <Navbar />

      <div className="page" style={{ position: 'relative', zIndex: 10, padding: 'clamp(80px,10vw,100px) clamp(12px,4vw,20px) 60px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>

          <div className="animate-slide-up" style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 700, marginBottom: '8px', textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}>
              <span className="grad-text">Report Found Item</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', textShadow: '0 1px 6px rgba(0,0,0,0.7)' }}>
              Help reunite someone with their belongings
            </p>
          </div>

          <form
            className="animate-slide-up"
            style={{
              background: 'linear-gradient(145deg, rgba(15,12,41,0.92), rgba(30,27,75,0.92))',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(108,99,255,0.3)',
              borderRadius: '24px',
              padding: 'clamp(20px, 5vw, 40px)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)',
            }}
            onSubmit={handleSubmit}
          >
            {/* Item Info Section */}
            <div style={sectionStyle('#6c63ff')}>
              <div style={divider('rgba(108,99,255,0.4)')} />
              Item Information
              <div style={divider('rgba(108,99,255,0.4)')} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="label">Item Name *</label>
                <input
                  className="input" placeholder="e.g. iPhone 13, Blue Backpack"
                  value={form.name} onChange={e => set('name', e.target.value)}
                  style={{ background: 'rgba(108,99,255,0.1)', borderColor: errors.name ? '#ff6584' : 'rgba(108,99,255,0.35)' }}
                />
                {errors.name && <span style={{ color: '#ff6584', fontSize: '0.75rem' }}>{errors.name}</span>}
              </div>

              <div className="form-group">
                <label className="label">Category *</label>
                <select
                  className="input" value={form.category} onChange={e => set('category', e.target.value)}
                  style={{ background: 'rgba(108,99,255,0.1)', borderColor: errors.category ? '#ff6584' : 'rgba(108,99,255,0.35)' }}
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <span style={{ color: '#ff6584', fontSize: '0.75rem' }}>{errors.category}</span>}
              </div>

              <div className="form-group">
                <label className="label">Location Found *</label>
                <select
                  className="input" value={form.location} onChange={e => set('location', e.target.value)}
                  style={{ background: 'rgba(108,99,255,0.1)', borderColor: errors.location ? '#ff6584' : 'rgba(108,99,255,0.35)' }}
                >
                  <option value="">Select Location</option>
                  {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                {errors.location && <span style={{ color: '#ff6584', fontSize: '0.75rem' }}>{errors.location}</span>}
              </div>

              <div className="form-group">
                <label className="label">Date Found *</label>
                <input
                  className="input" type="date" value={form.date} onChange={e => set('date', e.target.value)}
                  style={{ background: 'rgba(108,99,255,0.1)', borderColor: errors.date ? '#ff6584' : 'rgba(108,99,255,0.35)' }}
                />
                {errors.date && <span style={{ color: '#ff6584', fontSize: '0.75rem' }}>{errors.date}</span>}
              </div>

              <div className="form-group">
                <label className="label">Time Found</label>
                <input
                  className="input" type="time" value={form.time} onChange={e => set('time', e.target.value)}
                  style={{ background: 'rgba(108,99,255,0.1)', borderColor: 'rgba(108,99,255,0.35)' }}
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="label">Description *</label>
                <textarea
                  className="input" rows={3}
                  placeholder="Describe the item — color, brand, condition, any markings..."
                  value={form.description} onChange={e => set('description', e.target.value)}
                  style={{ resize: 'vertical', background: 'rgba(108,99,255,0.1)', borderColor: errors.description ? '#ff6584' : 'rgba(108,99,255,0.35)' }}
                />
                {errors.description && <span style={{ color: '#ff6584', fontSize: '0.75rem' }}>{errors.description}</span>}
              </div>
            </div>

            {/* Photo Section */}
            <div style={{ ...sectionStyle('#43e97b'), marginTop: '8px' }}>
              <div style={divider('rgba(67,233,123,0.4)')} />
              Photo Upload
              <div style={divider('rgba(67,233,123,0.4)')} />
            </div>

            <div className="form-group">
              <label style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: preview ? '16px' : '36px 16px',
                border: `2px dashed ${errors.photo ? '#ff6584' : 'rgba(67,233,123,0.4)'}`,
                borderRadius: '16px', cursor: 'pointer', transition: 'all 0.3s',
                background: 'rgba(67,233,123,0.05)',
                position: 'relative', overflow: 'hidden',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#43e97b'}
                onMouseLeave={e => e.currentTarget.style.borderColor = errors.photo ? '#ff6584' : 'rgba(67,233,123,0.4)'}
              >
                {preview ? (
                  <div style={{ position: 'relative', width: '100%' }}>
                    <img src={preview} alt="preview" style={{ maxHeight: '200px', width: '100%', borderRadius: '10px', objectFit: 'cover', display: 'block' }} />
                    <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(67,233,123,0.9)', borderRadius: '20px', padding: '4px 10px', fontSize: '0.72rem', fontWeight: 700, color: '#0f0c29' }}>
                      Change Photo
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(67,233,123,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                      <Camera size={26} color="#43e97b" />
                    </div>
                    <span style={{ color: errors.photo ? '#ff6584' : 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 500 }}>
                      Click to upload photo
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', marginTop: '4px' }}>Required — JPG, PNG, WEBP</span>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
              </label>
              {errors.photo && <span style={{ color: '#ff6584', fontSize: '0.75rem' }}>{errors.photo}</span>}
            </div>

            {/* Notes Section */}
            <div style={{ ...sectionStyle('#f59e0b'), marginTop: '8px' }}>
              <div style={divider('rgba(245,158,11,0.4)')} />
              Additional Notes
              <div style={divider('rgba(245,158,11,0.4)')} />
            </div>

            <div className="form-group">
              <textarea
                className="input" rows={2}
                placeholder="Any extra details that might help identify the owner..."
                value={form.notes} onChange={e => set('notes', e.target.value)}
                style={{ resize: 'vertical', background: 'rgba(245,158,11,0.07)', borderColor: 'rgba(245,158,11,0.3)' }}
              />
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
              <button type="button" className="btn btn-outline" style={{ flex: '1 1 100px' }} onClick={() => navigate('/dashboard')}>
                Cancel
              </button>
              <button type="submit" className="btn btn-success" style={{ flex: '2 1 180px' }}>
                Submit Found Item
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
