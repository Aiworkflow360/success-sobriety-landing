import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Link, NavLink, useLocation } from 'react-router-dom'
import logoMark from '../assets/logo-mark.png'
import logoFull from '../assets/logo-full.jpg'

/* ━━━ SUPABASE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export const supabase = createClient(
  'https://celhbnwgtvlpkkckwndg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlbGhibndndHZscGtrY2t3bmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NTUzMDMsImV4cCI6MjA4OTMzMTMwM30.RhORGgnjyxsiRN6XRDRSsTg29xCuysLFdv4YSyFOtPk'
)

/* ━━━ HOOKS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export function useInView(opts = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); if (opts.once !== false) obs.disconnect() } },
      { threshold: opts.threshold ?? 0.15, rootMargin: opts.rootMargin ?? '0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, inView]
}

export function useScrollY() {
  const [y, setY] = useState(0)
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) { requestAnimationFrame(() => { setY(window.scrollY); ticking = false }); ticking = true }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return y
}

export function useCountUp(end, duration = 2000, active = false) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    const t0 = performance.now()
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 4)
      setVal(Math.floor(end * eased))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [active, end, duration])
  return val
}

export function useMouseParallax(factor = 0.02) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const handler = (e) => {
      setPos({
        x: (e.clientX - window.innerWidth / 2) * factor,
        y: (e.clientY - window.innerHeight / 2) * factor,
      })
    }
    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [factor])
  return pos
}

/* ━━━ PRIMITIVES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export function Reveal({ children, className = '', delay = 0, as: Tag = 'div' }) {
  const [ref, inView] = useInView()
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? 'in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  )
}

export function GlassCard({ children, className = '', hover = true, glow, ...props }) {
  return (
    <div className={`glass ${hover ? 'glass-hover' : ''} ${glow ? `glass-glow-${glow}` : ''} ${className}`} {...props}>
      {children}
    </div>
  )
}

export function GradientMesh({ className = '' }) {
  const mouse = useMouseParallax(0.015)
  return (
    <div className={`gradient-mesh ${className}`} style={{ transform: `translate(${mouse.x}px, ${mouse.y}px)` }}>
      <div className="mesh-orb mesh-orb-1" />
      <div className="mesh-orb mesh-orb-2" />
      <div className="mesh-orb mesh-orb-3" />
    </div>
  )
}

/* ━━━ SCROLL TO TOP ON NAV ━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

/* ━━━ SCROLL PROGRESS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export function ScrollProgress() {
  const y = useScrollY()
  const max = typeof document !== 'undefined' ? document.documentElement.scrollHeight - window.innerHeight : 1
  const progress = max > 0 ? y / max : 0
  return <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
}

/* ━━━ FLOATING PARTICLES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export function FloatingParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 3,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * -20,
      opacity: 0.08 + Math.random() * 0.12,
    })),
    []
  )

  return (
    <div className="particles" aria-hidden="true">
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

/* ━━━ NAV ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export function Nav() {
  const y = useScrollY()
  const scrolled = y > 60
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className={`nav ${scrolled ? 'nav-solid' : ''}`}>
      <div className="nav-inner">
        <Link to="/" className="nav-brand">
          <img src={logoMark} alt="Success & Sobriety" className="nav-logo-img" />
          <span className="nav-brand-text">Success & Sobriety</span>
        </Link>
        <div className={`nav-links ${menuOpen ? 'nav-links-open' : ''}`}>
          <NavLink to="/" end onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/features" onClick={() => setMenuOpen(false)}>Features</NavLink>
          <NavLink to="/podcast" onClick={() => setMenuOpen(false)}>Podcast</NavLink>
          <NavLink to="/pricing" onClick={() => setMenuOpen(false)}>Pricing</NavLink>
          <Link to="/pricing" className="nav-cta-btn nav-cta-mobile" onClick={() => setMenuOpen(false)}>
            <span>Get Early Access</span>
          </Link>
        </div>
        <Link to="/pricing" className="nav-cta-btn nav-cta-desktop">
          <span>Get Early Access</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
        <button
          className={`nav-hamburger ${menuOpen ? 'nav-hamburger-open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  )
}

/* ━━━ BACK TO TOP ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export function BackToTop() {
  const y = useScrollY()
  const visible = y > 600

  return (
    <button
      className={`back-to-top ${visible ? 'back-to-top-visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 14V4M4 8l5-5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  )
}

/* ━━━ TRUST BADGES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export function TrustBadges() {
  const badges = [
    { text: 'End-to-End Encrypted', svg: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="3" y="6" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M5 6V4a2 2 0 114 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg> },
    { text: 'Apple Health Ready', svg: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 12s-5-3.5-5-7a3 3 0 015-2.2A3 3 0 0112 5c0 3.5-5 7-5 7z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg> },
    { text: 'GDPR Compliant', svg: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L2 3.5v3.5c0 3 2.2 5.5 5 6.5 2.8-1 5-3.5 5-6.5V3.5L7 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg> },
    { text: 'Evidence-Based', svg: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="5" r="3" stroke="currentColor" strokeWidth="1.2"/><path d="M9 7.5l2 4.5M5 7.5l-2 4.5M7 8v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg> },
    { text: 'Built in the UK', svg: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1.5 7h11M7 1.5c-2 2-2 9 0 11M7 1.5c2 2 2 9 0 11" stroke="currentColor" strokeWidth="1"/></svg> },
    { text: 'Offline Capable', svg: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 10l3-3 2 2 3-3 2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  ]

  return (
    <div className="trust-badges">
      {badges.map((b, i) => (
        <div key={i} className="trust-badge">
          <span className="trust-badge-icon">{b.svg}</span>
          <span className="trust-badge-text">{b.text}</span>
        </div>
      ))}
    </div>
  )
}

/* ━━━ FOOTER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <TrustBadges />
        <img src={logoFull} alt="Success & Sobriety" className="footer-logo" loading="lazy" width="200" height="60" />
        <span className="footer-brand">Success & Sobriety</span>
        <p className="footer-tagline">No judgement. Just progress.</p>
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/features">Features</Link>
          <Link to="/podcast">Podcast</Link>
          <Link to="/pricing">Pricing</Link>
        </div>
        <div className="footer-legal">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
        <p className="footer-copy">&copy; 2026 Success & Sobriety. All rights reserved.</p>
      </div>
    </footer>
  )
}

/* ━━━ WAITLIST CTA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export function Waitlist() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setStatus('submitting')
    const { error } = await supabase.from('waitlist').insert({ email: email.toLowerCase().trim() })
    if (error && error.code !== '23505') {
      setStatus('error')
    } else {
      setStatus('success')
    }
  }

  return (
    <section className="waitlist" id="waitlist">
      <GradientMesh className="waitlist-mesh" />
      <div className="waitlist-inner">
        <Reveal>
          <span className="section-eyebrow">EARLY ACCESS</span>
          <h2 className="waitlist-heading">
            Ready to perform<br />
            <span className="text-gradient">at your peak?</span>
          </h2>
          <p className="section-sub">Join 1,200+ professionals on the waitlist. Be first to access the app built specifically for men who lead.</p>
        </Reveal>

        <Reveal delay={200}>
          {status === 'success' ? (
            <div className="waitlist-success">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span>You're on the list. We'll be in touch.</span>
            </div>
          ) : (
            <form className="waitlist-form" onSubmit={handleSubmit}>
              <div className="waitlist-input-wrap">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={status === 'submitting'}
                />
                <button type="submit" className="btn btn-primary" disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Joining...' : 'Join Waitlist'}
                </button>
              </div>
              {status === 'error' && <p className="waitlist-error">Something went wrong. Please try again.</p>}
            </form>
          )}
          <p className="waitlist-note">No spam. No data sharing. Unsubscribe anytime.</p>
        </Reveal>
      </div>
    </section>
  )
}

/* ━━━ MID-PAGE CTA STRIP ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export function CtaStrip() {
  return (
    <Reveal>
      <section className="cta-strip">
        <div className="cta-strip-inner">
          <h3 className="cta-strip-heading">Ready to get your <span className="text-gradient">edge?</span></h3>
          <Link to="/pricing" className="btn btn-primary btn-lg">
            <span>Join the Waitlist</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>
      </section>
    </Reveal>
  )
}
