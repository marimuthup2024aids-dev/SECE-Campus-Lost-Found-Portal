import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Particles from '../components/Particles'

export default function Landing() {
  const navigate = useNavigate()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => { setTimeout(() => setLoaded(true), 100) }, [])

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Background image - vivid */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: `url(https://media.collegedekho.com/media/img/institute/crawled_images/college_banner.jpg?width=640)`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'brightness(0.55) saturate(1.8) contrast(1.1)',
      }} />

      {/* Gradient overlay - lighter so image shows through */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1,
        background: 'linear-gradient(180deg, rgba(15,12,41,0.55) 0%, rgba(48,43,99,0.45) 50%, rgba(15,12,41,0.75) 100%)',
      }} />

      <Particles />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 10,
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        textAlign: 'center',
      }}>
        {/* College name highlight badge */}
        <div
          className={loaded ? 'animate-slide-up' : ''}
          style={{
            marginBottom: '28px',
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            padding: '12px 28px',
            borderRadius: '50px',
            background: 'linear-gradient(135deg, rgba(108,99,255,0.35), rgba(255,101,132,0.25))',
            border: '1.5px solid rgba(255,255,255,0.3)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 8px 32px rgba(108,99,255,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
          }}
        >
          <span style={{ fontSize: '1.4rem' }}>🎓</span>
          <span style={{
            fontSize: 'clamp(0.85rem, 2.5vw, 1.05rem)',
            fontWeight: 700,
            letterSpacing: '0.5px',
            background: 'linear-gradient(90deg, #fff 0%, #c4b5fd 50%, #f9a8d4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Sri Eshwar College of Engineering
          </span>
        </div>

        {/* Main heading */}
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(2.5rem, 7vw, 5rem)',
          fontWeight: 800,
          lineHeight: 1.1,
          marginBottom: '16px',
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s ease 0.2s',
        }}>
          <span className="grad-text">Lost &amp; Found</span>
          <br />
          <span style={{ color: '#fff', fontSize: '0.6em' }}>Campus Portal</span>
        </h1>

        <p style={{
          fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)',
          color: 'rgba(255,255,255,0.65)',
          maxWidth: '500px',
          lineHeight: 1.7,
          marginBottom: '48px',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.8s ease 0.4s',
        }}>
          Reuniting students with their lost belongings across the SECE campus and hostel.
        </p>

        {/* Welcome button */}
        <div style={{
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s ease 0.6s',
        }}>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/login')}
            style={{
              fontSize: '1.1rem',
              padding: '16px 48px',
              animation: 'pulse-glow 2s infinite',
              background: 'linear-gradient(135deg, #6c63ff, #a855f7, #ff6584)',
              backgroundSize: '200% 200%',
            }}
          >
            ✨ Welcome — Get Started
          </button>
        </div>


      </div>
    </div>
  )
}
