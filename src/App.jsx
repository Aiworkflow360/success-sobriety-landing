import { useEffect, useRef, useState, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'
import './App.css'

const supabase = createClient(
  'https://celhbnwgtvlpkkckwndg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlbGhibndndHZscGtrY2t3bmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NTUzMDMsImV4cCI6MjA4OTMzMTMwM30.RhORGgnjyxsiRN6XRDRSsTg29xCuysLFdv4YSyFOtPk'
)

/* ── Hooks ─────────────────────────────────────────── */

function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, visible]
}

function useParallax(speed = 0.3) {
  const ref = useRef(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (ref.current) {
            const rect = ref.current.getBoundingClientRect()
            const center = rect.top + rect.height / 2 - window.innerHeight / 2
            setOffset(center * speed)
          }
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [speed])

  return [ref, offset]
}

function useCountUp(end, duration = 2000, start = 0, active = false) {
  const [value, setValue] = useState(start)

  useEffect(() => {
    if (!active) return
    const startTime = performance.now()
    const tick = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.floor(start + (end - start) * eased))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [active, end, duration, start])

  return value
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
          setProgress(scrollHeight > 0 ? window.scrollY / scrollHeight : 0)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return progress
}

/* ── Components ────────────────────────────────────── */

function Section({ children, className = '', id }) {
  const [ref, visible] = useScrollReveal()
  return (
    <section
      ref={ref}
      id={id}
      className={`section ${className} ${visible ? 'visible' : ''}`}
    >
      {children}
    </section>
  )
}

function ScrollProgress() {
  const progress = useScrollProgress()
  return (
    <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} />
  )
}

function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <span className="nav-brand">S&S</span>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#playbook">Playbook</a>
          <a href="#pricing">Pricing</a>
          <a href="#privacy">Privacy</a>
        </div>
        <a href="#cta" className="nav-cta">Get Early Access</a>
      </div>
    </nav>
  )
}

function Hero() {
  const [counter, setCounter] = useState({ d: 0, h: 0, m: 0 })
  const [parallaxRef, offset] = useParallax(0.4)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    let frame = 0
    const tick = () => {
      frame++
      setCounter({
        d: Math.floor(frame / 60),
        h: Math.floor((frame % 60) / 2.5),
        m: frame % 60,
      })
      if (frame < 247) requestAnimationFrame(tick)
    }
    const timeout = setTimeout(tick, 800)
    return () => clearTimeout(timeout)
  }, [])

  const handleMouseMove = useCallback((e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20
    const y = (e.clientY / window.innerHeight - 0.5) * 20
    setMousePos({ x, y })
  }, [])

  return (
    <section className="hero" onMouseMove={handleMouseMove} ref={parallaxRef}>
      <div
        className="hero-bg"
        style={{
          transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)`,
        }}
      />
      <div className="hero-particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>
      <div
        className="hero-content"
        style={{ transform: `translateY(${offset}px)` }}
      >
        <span className="hero-badge">FOR PROFESSIONAL MEN</span>
        <h1 className="hero-title">
          Perform at<br />your peak.
        </h1>
        <p className="hero-subtitle">
          The sobriety app built for men who refuse to settle for less.
          Track your edge. Master every situation. Unlock your full potential.
        </p>

        <div className="hero-counter">
          <div className="counter-group">
            <span className="counter-value">{counter.d}</span>
            <span className="counter-label">DAYS</span>
          </div>
          <span className="counter-sep">:</span>
          <div className="counter-group">
            <span className="counter-value">{counter.h}</span>
            <span className="counter-label">HOURS</span>
          </div>
          <span className="counter-sep">:</span>
          <div className="counter-group">
            <span className="counter-value">{counter.m}</span>
            <span className="counter-label">MINUTES</span>
          </div>
        </div>

        <div className="hero-actions">
          <a href="#cta" className="btn-primary btn-glow">Get Early Access</a>
          <a href="#features" className="btn-ghost">See Features</a>
        </div>
      </div>

      <div className="hero-scroll-indicator">
        <div className="scroll-line" />
      </div>
    </section>
  )
}

function Stats() {
  const [ref, visible] = useScrollReveal(0.3)
  const money = useCountUp(4160, 2000, 0, visible)
  const hours = useCountUp(624, 1800, 0, visible)
  const calories = useCountUp(91000, 2200, 0, visible)

  return (
    <section
      ref={ref}
      id="stats"
      className={`section stats-section ${visible ? 'visible' : ''}`}
    >
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-number">&pound;{money.toLocaleString()}</span>
          <span className="stat-label">Average saved per year</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{hours.toLocaleString()}</span>
          <span className="stat-label">Hours reclaimed annually</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{calories.toLocaleString()}</span>
          <span className="stat-label">Calories avoided per year</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">100%</span>
          <span className="stat-label">Private. Always.</span>
        </div>
      </div>
    </section>
  )
}

function Features() {
  const features = [
    {
      icon: '📊',
      title: 'The Scoreboard',
      desc: 'Not just a day counter. A full performance dashboard — money saved, calories avoided, hours reclaimed, productivity tracked. Your edge, quantified.',
    },
    {
      icon: '🏆',
      title: 'Milestone System',
      desc: '22 progressive achievements from 24 hours to 5 years. Earn them. Collect them. Each one a marker of who you\'re becoming.',
    },
    {
      icon: '🧠',
      title: 'AI Performance Coach',
      desc: 'An executive-level sobriety coach, 24/7. Understands business culture, high-pressure environments, and client-facing roles. Sharp, experienced, no-nonsense.',
    },
    {
      icon: '✅',
      title: 'Daily Protocol',
      desc: 'A customisable high-performance routine. Morning breathwork. Midday check-in. Evening debrief. Track streaks from Bronze to Platinum.',
    },
    {
      icon: '📝',
      title: 'Daily Debrief',
      desc: 'An executive-style end-of-day review. Rate your mood, energy, productivity. Track trends. Not a feelings journal — a performance log.',
    },
    {
      icon: '📚',
      title: 'Content Library',
      desc: 'Curated for professional men. Neuroscience of alcohol. Leadership without drinking. Success stories from executives who got sober and doubled their output.',
    },
  ]

  return (
    <Section className="features-section" id="features">
      <span className="section-badge">FEATURES</span>
      <h2 className="section-title">Everything you need.<br />Nothing you don't.</h2>
      <p className="section-subtitle">Built for men who optimise everything else — sleep, fitness, nutrition. Now optimise this.</p>

      <div className="features-grid">
        {features.map((f, i) => (
          <div key={i} className="feature-card" style={{ animationDelay: `${i * 0.1}s` }}>
            <span className="feature-icon">{f.icon}</span>
            <h3 className="feature-title">{f.title}</h3>
            <p className="feature-desc">{f.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}

function Playbook() {
  const scenarios = [
    { title: 'Client Dinner', desc: 'Everyone is drinking. You need to close the deal.' },
    { title: 'Friday Drinks', desc: 'The team heads to the pub. You\'re expected.' },
    { title: 'Networking Event', desc: 'Open bar. New contacts. High pressure.' },
    { title: 'Business Class Flight', desc: 'Free drinks trolley. 8-hour flight.' },
    { title: '"I Deserve a Drink"', desc: 'Bad deal. Bad day. The old voice returns.' },
    { title: 'Stag Do', desc: 'The big trip. All eyes on you.' },
  ]

  return (
    <Section className="playbook-section" id="playbook">
      <span className="section-badge">SITUATION PLAYBOOK</span>
      <h2 className="section-title">Every scenario.<br />A strategy ready.</h2>
      <p className="section-subtitle">What to say. What to order. How to handle questions. How to exit. Pre-built plans for every situation professional men face.</p>

      <div className="playbook-grid">
        {scenarios.map((s, i) => (
          <div key={i} className="playbook-card" style={{ animationDelay: `${i * 0.08}s` }}>
            <h4 className="playbook-title">{s.title}</h4>
            <p className="playbook-desc">{s.desc}</p>
            <span className="playbook-arrow">View strategy &rarr;</span>
          </div>
        ))}
      </div>
    </Section>
  )
}

function CoachPreview() {
  const [ref, visible] = useScrollReveal(0.2)
  const [typingDone, setTypingDone] = useState(false)

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => setTypingDone(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [visible])

  return (
    <section
      ref={ref}
      id="coach"
      className={`section coach-section ${visible ? 'visible' : ''}`}
    >
      <div className="coach-container">
        <div className="coach-text">
          <span className="section-badge">AI PERFORMANCE COACH</span>
          <h2 className="section-title" style={{ textAlign: 'left' }}>Your sharpest<br />advisor. 24/7.</h2>
          <p className="coach-desc">
            Not a therapist. Not a chatbot. An executive-level mentor who understands
            boardrooms, client dinners, and the pressure to perform.
          </p>
          <ul className="coach-features">
            <li>Knows the science — testosterone, cortisol, sleep, cognition</li>
            <li>Generates personalised game plans for upcoming events</li>
            <li>Challenges excuses. Celebrates wins. No patronising.</li>
            <li>Hardcoded rule: never suggests moderation. Abstinence only.</li>
          </ul>
        </div>
        <div className="coach-preview">
          <div className={`chat-bubble chat-user ${visible ? 'chat-animate' : ''}`}>
            I've got a client dinner Thursday at a steakhouse. Everyone will be drinking. I need to close this deal.
          </div>
          {visible && (
            <div className="chat-typing-indicator" style={{ opacity: typingDone ? 0 : 1 }}>
              <span /><span /><span />
            </div>
          )}
          <div className={`chat-bubble chat-ai ${typingDone ? 'chat-animate' : 'chat-hidden'}`}>
            Here's your game plan. Arrive 10 minutes early and order a sparkling water with lime — it looks like a G&T. When the wine list comes, say "I'm driving tonight" or "I'm training for something." Focus on being the sharpest person at the table. You'll close harder sober than anyone else will after their third glass.
          </div>
        </div>
      </div>
    </section>
  )
}

function Privacy() {
  return (
    <Section className="privacy-section" id="privacy">
      <span className="section-badge">THE VAULT</span>
      <h2 className="section-title">What happens in the app<br />stays in the app.</h2>
      <p className="section-subtitle">Built for men whose biggest fear is someone finding out.</p>

      <div className="privacy-grid">
        <div className="privacy-card">
          <span className="privacy-icon">🔐</span>
          <h4>Face ID / Fingerprint Lock</h4>
          <p>Biometric authentication required to open the app.</p>
        </div>
        <div className="privacy-card">
          <span className="privacy-icon">🎭</span>
          <h4>Disguised App Icon</h4>
          <p>Looks like a generic utility. No one will know.</p>
        </div>
        <div className="privacy-card">
          <span className="privacy-icon">🚫</span>
          <h4>No Social Features</h4>
          <p>No forums. No profiles. No community. Just you.</p>
        </div>
        <div className="privacy-card">
          <span className="privacy-icon">🛡️</span>
          <h4>Zero Data Sharing</h4>
          <p>Your data is never sold, shared, or aggregated. Ever.</p>
        </div>
      </div>
    </Section>
  )
}

function Pricing() {
  return (
    <Section className="pricing-section" id="pricing">
      <span className="section-badge">PRICING</span>
      <h2 className="section-title">Less than one night out.</h2>
      <p className="section-subtitle">30 days free. Full access. No credit card required.</p>

      <div className="pricing-grid">
        <div className="pricing-card">
          <h3 className="pricing-tier">Free</h3>
          <div className="pricing-price">&pound;0</div>
          <p className="pricing-period">forever</p>
          <ul className="pricing-features">
            <li>Day counter + live timer</li>
            <li>Milestone tracking</li>
            <li>Daily protocol</li>
            <li>Daily quotes</li>
          </ul>
        </div>
        <div className="pricing-card pricing-featured">
          <span className="pricing-badge">MOST POPULAR</span>
          <h3 className="pricing-tier">Premium</h3>
          <div className="pricing-price">&pound;4.99<span>/mo</span></div>
          <p className="pricing-period">&pound;59.88/year</p>
          <ul className="pricing-features">
            <li>Everything in Free</li>
            <li>AI Performance Coach</li>
            <li>Situation Playbook</li>
            <li>Full debrief history</li>
            <li>Advanced stats + trends</li>
            <li>Content library</li>
          </ul>
          <a href="#cta" className="btn-primary btn-glow" style={{ width: '100%' }}>Start Free Trial</a>
        </div>
        <div className="pricing-card">
          <h3 className="pricing-tier">Coaching</h3>
          <div className="pricing-price">&pound;149<span>/mo</span></div>
          <p className="pricing-period">Coming soon</p>
          <ul className="pricing-features">
            <li>Everything in Premium</li>
            <li>1-to-1 human coaching</li>
            <li>Former executive mentor</li>
            <li>Weekly video calls</li>
            <li>Priority support</li>
          </ul>
        </div>
      </div>
    </Section>
  )
}

function CTA() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return

    setStatus('submitting')
    setErrorMsg('')

    const { error } = await supabase
      .from('waitlist')
      .insert({ email: email.toLowerCase().trim() })

    if (error) {
      if (error.code === '23505') {
        setStatus('success')
      } else {
        setStatus('error')
        setErrorMsg('Something went wrong. Please try again.')
      }
    } else {
      setStatus('success')
    }
  }

  return (
    <Section className="cta-section" id="cta">
      <span className="section-badge">EARLY ACCESS</span>
      <h2 className="section-title">Ready to perform<br />at your peak?</h2>
      <p className="section-subtitle">
        Join the waitlist. Be first to access the app built specifically for professional men.
      </p>

      {status === 'success' ? (
        <div className="cta-success">
          <span>✓</span> You're on the list. We'll be in touch.
        </div>
      ) : (
        <form className="cta-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === 'submitting'}
          />
          <button type="submit" className="btn-primary" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Joining...' : 'Join Waitlist'}
          </button>
        </form>
      )}

      {status === 'error' && <p className="cta-error">{errorMsg}</p>}
      <p className="cta-note">No spam. No data sharing. Unsubscribe anytime.</p>
    </Section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span className="footer-brand">Success & Sobriety</span>
        <p className="footer-tagline">The performance app for men who've decided alcohol no longer serves them.</p>
        <p className="footer-copy">&copy; 2026 Success & Sobriety. All rights reserved.</p>
      </div>
    </footer>
  )
}

function App() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <Hero />
      <Stats />
      <Features />
      <Playbook />
      <CoachPreview />
      <Privacy />
      <Pricing />
      <CTA />
      <Footer />
    </>
  )
}

export default App
