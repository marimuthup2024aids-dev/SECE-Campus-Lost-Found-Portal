import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { X, CheckCircle, AlertCircle } from 'lucide-react'

const LOCATIONS_LOST = [
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
  const [step, setStep] = useState(1) // 1=form, 2=success
  const [form, setForm] = useState({
    name: user?.name || '',
    rollno: user?.rollno || '',
    dept: user?.dept || '',
    year: user?.year || '',
    phone: '',
    lostLocation: '',
    lostDate: '',
    lostTime: '',
    itemDescription: '',
    itemContents: '',
    uniqueId: '',
    brand: '',
    color: '',
    reason: '',
  })
  const [errors, setErrors] = useState({})

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.phone) e.phone = 'Required'
    if (!form.lostLocation) e.lostLocation = 'Required'
    if (!form.lostDate) e.lostDate = 'Required'
    if (!form.itemDescription) e.itemDescription = 'Required'
    if (!form.reason) e.reason = 'Required'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    submitClaim(item.id, form)
    setStep(2)
  }

  const Field = ({ label, name, type = 'text', placeholder, required, children }) => (
    <div className="form-group">
      <label className="label">{label}{required && ' *'}</label>
      {children || (
        <input
          className="input"
          type={type}
          placeholder={placeholder}
          value={form[name]}
          onChange={e => set(name, e.target.value)}
        />
      )}
      {errors[name] && <span style={{ color: '#ff6584', fontSize: '0.75rem' }}>⚠ {errors[name]}</span>}
    </div>
  )

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px', overflowY: 'auto',
    }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="glass animate-slide-up" style={{
        width: '100%', maxWidth: '620px',
        maxHeight: '90vh', overflowY: 'auto',
        padding: 'clamp(24px, 5vw, 40px)',
        position: 'relative',
      }}>
        {/* Close */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px',
          background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%',
          width: '36px', height: '36px', cursor: 'pointer', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <X size={18} />
        </button>

        {step === 2 ? (
          /* Success state */
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <CheckCircle size={72} color="#43e97b" style={{ marginBottom: '20px' }} />
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#43e97b', marginBottom: '12px' }}>
              Claim Submitted!
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: '8px' }}>
              Your claim for <strong style={{ color: '#fff' }}>{item.name}</strong> has been submitted.
            </p>
            <div style={{
              background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)',
              borderRadius: '12px', padding: '16px', margin: '20px 0', textAlign: 'left',
            }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <AlertCircle size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p style={{ color: '#f59e0b', fontWeight: 600, marginBottom: '4px', fontSize: '0.9rem' }}>
                    Pending Admin Verification
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                    Admin will review your claim and verify your identity. Once approved, you will be notified to collect the item. Please check your claim status in "My Claims".
                  </p>
                </div>
              </div>
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          /* Claim form */
          <>
            {/* Header */}
            <div style={{ marginBottom: '24px', paddingRight: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px', overflow: 'hidden',
                  background: 'rgba(108,99,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {item.photo
                    ? <img src={item.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: '1.5rem' }}>📦</span>}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Claim: {item.name}</h2>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>{item.category} • {item.location}</p>
                </div>
              </div>
              <div style={{
                background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.25)',
                borderRadius: '10px', padding: '12px 14px',
              }}>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.82rem', lineHeight: 1.6 }}>
                  🔍 Answer the questions below honestly. Admin will verify your claim before returning the item. Only the real owner will know these details.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Section 1: Personal Info */}
              <div style={{ marginBottom: '8px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6c63ff', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(108,99,255,0.3)' }} />
                  👤 Personal Information
                  <div style={{ flex: 1, height: '1px', background: 'rgba(108,99,255,0.3)' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
                  <Field label="Full Name" name="name" placeholder="Your full name" required>
                    <input className="input" value={form.name} onChange={e => set('name', e.target.value)} />
                  </Field>
                  <Field label="Register Number" name="rollno" placeholder="e.g. 22CSE001" required>
                    <input className="input" value={form.rollno} onChange={e => set('rollno', e.target.value)} />
                  </Field>
                  <Field label="Department" name="dept" placeholder="e.g. CSE" required>
                    <input className="input" value={form.dept} onChange={e => set('dept', e.target.value)} />
                  </Field>
                  <Field label="Year" name="year" placeholder="e.g. II" required>
                    <input className="input" value={form.year} onChange={e => set('year', e.target.value)} />
                  </Field>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="label">Phone Number *</label>
                    <input className="input" type="tel" placeholder="10-digit mobile number" value={form.phone} onChange={e => set('phone', e.target.value)} maxLength={10} />
                    {errors.phone && <span style={{ color: '#ff6584', fontSize: '0.75rem' }}>⚠ {errors.phone}</span>}
                  </div>
                </div>
              </div>

              {/* Section 2: Loss Details */}
              <div style={{ marginBottom: '8px', marginTop: '20px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ff6584', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(255,101,132,0.3)' }} />
                  📍 Where & When Did You Lose It?
                  <div style={{ flex: 1, height: '1px', background: 'rgba(255,101,132,0.3)' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="label">Where did you lose it? *</label>
                    <select className="input" value={form.lostLocation} onChange={e => set('lostLocation', e.target.value)}>
                      <option value="">Select location</option>
                      {LOCATIONS_LOST.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                    {errors.lostLocation && <span style={{ color: '#ff6584', fontSize: '0.75rem' }}>⚠ {errors.lostLocation}</span>}
                  </div>
                  <div className="form-group">
                    <label className="label">Approximate Date Lost *</label>
                    <input className="input" type="date" value={form.lostDate} onChange={e => set('lostDate', e.target.value)} />
                    {errors.lostDate && <span style={{ color: '#ff6584', fontSize: '0.75rem' }}>⚠ {errors.lostDate}</span>}
                  </div>
                  <div className="form-group">
                    <label className="label">Approximate Time Lost</label>
                    <input className="input" type="time" value={form.lostTime} onChange={e => set('lostTime', e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Section 3: Item Identification */}
              <div style={{ marginBottom: '8px', marginTop: '20px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#43e97b', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(67,233,123,0.3)' }} />
                  🔎 Identify Your Item
                  <div style={{ flex: 1, height: '1px', background: 'rgba(67,233,123,0.3)' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="label">Describe the item in detail *</label>
                    <textarea className="input" rows={3} placeholder="Color, size, brand, model, condition, any damage..." value={form.itemDescription} onChange={e => set('itemDescription', e.target.value)} style={{ resize: 'vertical' }} />
                    {errors.itemDescription && <span style={{ color: '#ff6584', fontSize: '0.75rem' }}>⚠ {errors.itemDescription}</span>}
                  </div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="label">What is inside the item? (if applicable)</label>
                    <textarea className="input" rows={2} placeholder="e.g. Student ID, cash amount, cards, files, apps installed..." value={form.itemContents} onChange={e => set('itemContents', e.target.value)} style={{ resize: 'vertical' }} />
                  </div>
                  <div className="form-group">
                    <label className="label">Brand</label>
                    <input className="input" placeholder="e.g. Apple, Samsung, Dell" value={form.brand} onChange={e => set('brand', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="label">Color</label>
                    <input className="input" placeholder="e.g. Black, Navy Blue" value={form.color} onChange={e => set('color', e.target.value)} />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="label">Unique Identification</label>
                    <input className="input" placeholder="Sticker, scratch, keychain, lock screen wallpaper, student ID, password hint..." value={form.uniqueId} onChange={e => set('uniqueId', e.target.value)} />
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginTop: '4px', display: 'block' }}>
                      e.g. "Has a red sticker on back", "Cracked corner", "Wallpaper is a sunset photo" — never share actual passwords
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 4: Reason */}
              <div style={{ marginTop: '20px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(245,158,11,0.3)' }} />
                  💬 Your Statement
                  <div style={{ flex: 1, height: '1px', background: 'rgba(245,158,11,0.3)' }} />
                </div>
                <div className="form-group">
                  <label className="label">Why do you believe this item is yours? *</label>
                  <textarea className="input" rows={3} placeholder="Explain in your own words why you believe this belongs to you..." value={form.reason} onChange={e => set('reason', e.target.value)} style={{ resize: 'vertical' }} />
                  {errors.reason && <span style={{ color: '#ff6584', fontSize: '0.75rem' }}>⚠ {errors.reason}</span>}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2, padding: '14px' }}>
                  🙋 Submit Claim for Verification
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
