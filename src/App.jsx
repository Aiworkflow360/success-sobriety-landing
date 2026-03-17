import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { createClient } from '@supabase/supabase-js'
import './App.css'

const supabase = createClient(
  'https://celhbnwgtvlpkkckwndg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlbGhibndndHZscGtrY2t3bmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NTUzMDMsImV4cCI6MjA4OTMzMTMwM30.RhORGgnjyxsiRN6XRDRSsTg29xCuysLFdv4YSyFOtPk'
)

/* ━━━ HOOKS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function useInView(opts = {}) {
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

function useScrollY() {
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

function useCountUp(end, duration = 2000, active = false) {
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

function useMouseParallax(factor = 0.02) {
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

function Reveal({ children, className = '', delay = 0, as: Tag = 'div' }) {
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

function GlassCard({ children, className = '', hover = true, glow, ...props }) {
  return (
    <div className={`glass ${hover ? 'glass-hover' : ''} ${glow ? `glass-glow-${glow}` : ''} ${className}`} {...props}>
      {children}
    </div>
  )
}

/* ━━━ GRADIENT MESH BG ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function GradientMesh({ className = '' }) {
  const mouse = useMouseParallax(0.015)
  return (
    <div className={`gradient-mesh ${className}`} style={{ transform: `translate(${mouse.x}px, ${mouse.y}px)` }}>
      <div className="mesh-orb mesh-orb-1" />
      <div className="mesh-orb mesh-orb-2" />
      <div className="mesh-orb mesh-orb-3" />
    </div>
  )
}

/* ━━━ SCROLL PROGRESS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function ScrollProgress() {
  const y = useScrollY()
  const max = typeof document !== 'undefined' ? document.documentElement.scrollHeight - window.innerHeight : 1
  const progress = max > 0 ? y / max : 0
  return <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} />
}

/* ━━━ NAV ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function Nav() {
  const y = useScrollY()
  const scrolled = y > 60

  return (
    <nav className={`nav ${scrolled ? 'nav-solid' : ''}`}>
      <div className="nav-inner">
        <a href="#" className="nav-brand">
          <span className="nav-logo">S</span>
          <span className="nav-brand-text">Success & Sobriety</span>
        </a>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#playbook">Playbook</a>
          <a href="#coach">Coach</a>
          <a href="#pricing">Pricing</a>
        </div>
        <a href="#waitlist" className="nav-cta-btn">
          <span>Get Early Access</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </a>
      </div>
    </nav>
  )
}

/* ━━━ HERO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function Hero() {
  const y = useScrollY()
  const opacity = Math.max(0, 1 - y / 600)
  const scale = 1 + y * 0.0003
  const phoneY = y * 0.15

  return (
    <section className="hero">
      <GradientMesh className="hero-mesh" />

      <div className="hero-content" style={{ opacity, transform: `scale(${scale})` }}>
        <div className="hero-eyebrow">
          <div className="eyebrow-line" />
          <span>FOR PROFESSIONAL MEN</span>
          <div className="eyebrow-line" />
        </div>

        <h1 className="hero-title">
          <span className="hero-title-line">Perform at</span>
          <span className="hero-title-line hero-title-accent">your peak.</span>
        </h1>

        <p className="hero-sub">
          The sobriety app built for men who refuse to settle.<br />
          Track your edge. Master every situation. Unlock your potential.
        </p>

        <div className="hero-ctas">
          <a href="#waitlist" className="btn btn-primary btn-lg">
            <span>Join the Waitlist</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
          <a href="#features" className="btn btn-glass btn-lg">See What's Inside</a>
        </div>
      </div>

      {/* 3D Phone Mockup */}
      <div className="hero-phone-wrapper" style={{ transform: `translateY(${phoneY}px)` }}>
        <div className="phone-3d">
          <div className="phone-glow" />
          <div className="phone-frame">
            <div className="phone-notch" />
            <div className="phone-screen">
              <PhoneScreenContent />
            </div>
          </div>
          <div className="phone-reflection" />
        </div>
      </div>

      <div className="hero-scroll-hint" style={{ opacity: Math.max(0, 1 - y / 200) }}>
        <span>Scroll to explore</span>
        <div className="scroll-arrow" />
      </div>
    </section>
  )
}

function PhoneScreenContent() {
  const [time, setTime] = useState({ d: 247, h: 14, m: 32 })

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => {
        let m = prev.m + 1
        let h = prev.h
        let d = prev.d
        if (m >= 60) { m = 0; h++ }
        if (h >= 24) { h = 0; d++ }
        return { d, h, m }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="phone-ui">
      <div className="phone-status-bar">
        <span>9:41</span>
        <div className="phone-status-icons">
          <span>&#9679;&#9679;&#9679;&#9679;</span>
        </div>
      </div>
      <div className="phone-app">
        <div className="phone-badge">YOUR STREAK</div>
        <div className="phone-counter">
          <span className="phone-counter-num">{time.d}</span>
          <span className="phone-counter-unit">days</span>
        </div>
        <div className="phone-counter-row">
          <div className="phone-counter-small">
            <span>{time.h}</span><small>hrs</small>
          </div>
          <div className="phone-counter-sep">:</div>
          <div className="phone-counter-small">
            <span>{String(time.m).padStart(2, '0')}</span><small>min</small>
          </div>
        </div>
        <div className="phone-stats-row">
          <div className="phone-stat">
            <span className="phone-stat-val">&pound;3,847</span>
            <span className="phone-stat-label">Saved</span>
          </div>
          <div className="phone-stat">
            <span className="phone-stat-val">578</span>
            <span className="phone-stat-label">Hours</span>
          </div>
          <div className="phone-stat">
            <span className="phone-stat-val">84k</span>
            <span className="phone-stat-label">Calories</span>
          </div>
        </div>
        <div className="phone-milestone">
          <div className="phone-milestone-label">Next: 9 Months</div>
          <div className="phone-milestone-bar">
            <div className="phone-milestone-fill" style={{ width: '82%' }} />
          </div>
          <div className="phone-milestone-pct">82%</div>
        </div>
      </div>
    </div>
  )
}

/* ━━━ SOCIAL PROOF BAR ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function SocialProof() {
  const [ref, inView] = useInView({ threshold: 0.3 })
  const money = useCountUp(4160, 2200, inView)
  const hours = useCountUp(624, 1800, inView)
  const cals = useCountUp(91000, 2500, inView)

  return (
    <section ref={ref} className={`proof ${inView ? 'proof-in' : ''}`}>
      <div className="proof-inner">
        <div className="proof-stat">
          <span className="proof-num">&pound;{money.toLocaleString()}</span>
          <span className="proof-label">Average saved per year</span>
        </div>
        <div className="proof-divider" />
        <div className="proof-stat">
          <span className="proof-num">{hours}</span>
          <span className="proof-label">Hours reclaimed annually</span>
        </div>
        <div className="proof-divider" />
        <div className="proof-stat">
          <span className="proof-num">{cals.toLocaleString()}</span>
          <span className="proof-label">Calories avoided per year</span>
        </div>
        <div className="proof-divider" />
        <div className="proof-stat">
          <span className="proof-num">100%</span>
          <span className="proof-label">Private. Always.</span>
        </div>
      </div>
    </section>
  )
}

/* ━━━ FEATURES BENTO GRID ━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function Features() {
  return (
    <section className="features" id="features">
      <div className="features-inner">
        <Reveal className="features-header">
          <span className="section-eyebrow">BUILT FOR PERFORMANCE</span>
          <h2 className="section-heading">
            Everything you need.<br />
            <span className="text-gradient">Nothing you don't.</span>
          </h2>
          <p className="section-sub">Built for men who optimise everything — sleep, fitness, nutrition. Now optimise this.</p>
        </Reveal>

        <div className="bento">
          {/* Large feature — Scoreboard */}
          <Reveal className="bento-item bento-lg" delay={0}>
            <GlassCard className="bento-card" glow="primary">
              <div className="bento-card-content">
                <span className="bento-icon">📊</span>
                <h3 className="bento-title">The Scoreboard</h3>
                <p className="bento-desc">
                  Not just a day counter. A full performance dashboard — money saved, calories avoided,
                  hours reclaimed, productivity tracked. Your edge, quantified.
                </p>
              </div>
              <div className="bento-visual bento-visual-scoreboard">
                <div className="mini-stat-card"><span className="mini-val">&pound;3,847</span><span className="mini-label">Money Saved</span></div>
                <div className="mini-stat-card"><span className="mini-val">578h</span><span className="mini-label">Time Back</span></div>
                <div className="mini-stat-card accent"><span className="mini-val">84,240</span><span className="mini-label">Calories</span></div>
              </div>
            </GlassCard>
          </Reveal>

          {/* Medium — AI Coach */}
          <Reveal className="bento-item bento-md" delay={100}>
            <GlassCard className="bento-card" glow="accent">
              <span className="bento-icon">🧠</span>
              <h3 className="bento-title">AI Performance Coach</h3>
              <p className="bento-desc">
                An executive-level sobriety coach, 24/7. Understands business culture,
                high-pressure environments, and client-facing roles.
              </p>
              <div className="bento-tag">Coming in v1</div>
            </GlassCard>
          </Reveal>

          {/* Medium — Milestones */}
          <Reveal className="bento-item bento-md" delay={200}>
            <GlassCard className="bento-card">
              <span className="bento-icon">🏆</span>
              <h3 className="bento-title">22 Milestones</h3>
              <p className="bento-desc">
                From 24 hours to 5 years. Each one a marker of who you're becoming.
                Earn them. Collect them.
              </p>
              <div className="bento-milestone-row">
                {['24h', '72h', '1w', '1m', '3m', '6m', '1y'].map((m, i) => (
                  <div key={m} className={`bento-badge ${i < 4 ? 'earned' : ''}`}>{m}</div>
                ))}
              </div>
            </GlassCard>
          </Reveal>

          {/* Small — Protocol */}
          <Reveal className="bento-item bento-sm" delay={150}>
            <GlassCard className="bento-card">
              <span className="bento-icon">✅</span>
              <h3 className="bento-title">Daily Protocol</h3>
              <p className="bento-desc">
                Morning breathwork. Midday check-in. Evening debrief. Track streaks from Bronze to Platinum.
              </p>
            </GlassCard>
          </Reveal>

          {/* Small — Debrief */}
          <Reveal className="bento-item bento-sm" delay={250}>
            <GlassCard className="bento-card">
              <span className="bento-icon">📝</span>
              <h3 className="bento-title">Daily Debrief</h3>
              <p className="bento-desc">
                Rate mood, energy, productivity. Track trends. Not a feelings journal — a performance log.
              </p>
            </GlassCard>
          </Reveal>

          {/* Small — Content */}
          <Reveal className="bento-item bento-sm" delay={350}>
            <GlassCard className="bento-card">
              <span className="bento-icon">📚</span>
              <h3 className="bento-title">Content Library</h3>
              <p className="bento-desc">
                Neuroscience of alcohol. Leadership without drinking. Success stories from executives.
              </p>
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ━━━ PLAYBOOK ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function Playbook() {
  const scenarios = [
    { icon: '🍷', title: 'Client Dinner', sub: 'Everyone is drinking. You need to close the deal.' },
    { icon: '🍺', title: 'Friday Drinks', sub: 'The team heads to the pub. You\'re expected.' },
    { icon: '🥂', title: 'Networking Event', sub: 'Open bar. New contacts. High pressure.' },
    { icon: '✈️', title: 'Business Class', sub: 'Free drinks trolley. 8-hour flight.' },
    { icon: '😤', title: '"I Deserve a Drink"', sub: 'Bad deal. Bad day. The old voice returns.' },
    { icon: '🎉', title: 'The Stag Do', sub: 'The big trip. All eyes on you.' },
  ]

  return (
    <section className="playbook" id="playbook">
      <div className="playbook-inner">
        <Reveal className="playbook-header">
          <span className="section-eyebrow">SITUATION PLAYBOOK</span>
          <h2 className="section-heading">
            Every scenario.<br />
            <span className="text-gradient">A strategy ready.</span>
          </h2>
          <p className="section-sub">What to say. What to order. How to handle questions. How to exit. Pre-built plans for every situation professional men face.</p>
        </Reveal>

        <div className="playbook-grid">
          {scenarios.map((s, i) => (
            <Reveal key={i} delay={i * 80}>
              <GlassCard className="playbook-card">
                <span className="playbook-icon">{s.icon}</span>
                <div className="playbook-text">
                  <h4 className="playbook-title">{s.title}</h4>
                  <p className="playbook-sub">{s.sub}</p>
                </div>
                <svg className="playbook-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 10h10M11 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ━━━ AI COACH SECTION ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function CoachSection() {
  const [ref, inView] = useInView({ threshold: 0.2 })
  const [phase, setPhase] = useState(0) // 0=idle, 1=user msg, 2=typing, 3=ai msg

  useEffect(() => {
    if (!inView) return
    const t1 = setTimeout(() => setPhase(1), 400)
    const t2 = setTimeout(() => setPhase(2), 1200)
    const t3 = setTimeout(() => setPhase(3), 2800)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [inView])

  return (
    <section ref={ref} className="coach" id="coach">
      <div className="coach-inner">
        <Reveal className="coach-left">
          <span className="section-eyebrow">AI PERFORMANCE COACH</span>
          <h2 className="section-heading">
            Your sharpest<br />
            <span className="text-gradient">advisor. 24/7.</span>
          </h2>
          <p className="coach-desc">
            Not a therapist. Not a chatbot. An executive-level mentor who understands
            boardrooms, client dinners, and the pressure to perform.
          </p>
          <ul className="coach-list">
            <li><span className="coach-bullet" />Knows the science — testosterone, cortisol, sleep, cognition</li>
            <li><span className="coach-bullet" />Generates personalised game plans for upcoming events</li>
            <li><span className="coach-bullet" />Challenges excuses. Celebrates wins. No patronising.</li>
            <li><span className="coach-bullet" />Hardcoded: never suggests moderation. Abstinence only.</li>
          </ul>
        </Reveal>

        <div className="coach-right">
          <div className="coach-chat-frame">
            <div className="coach-chat-bar">
              <div className="coach-chat-dot" /><div className="coach-chat-dot" /><div className="coach-chat-dot" />
              <span className="coach-chat-title">Performance Coach</span>
            </div>
            <div className="coach-chat-body">
              <div className={`chat-msg chat-user ${phase >= 1 ? 'chat-in' : ''}`}>
                <p>I've got a client dinner Thursday at a steakhouse. Everyone will be drinking. I need to close this deal.</p>
              </div>
              {phase >= 2 && phase < 3 && (
                <div className="chat-typing">
                  <span /><span /><span />
                </div>
              )}
              <div className={`chat-msg chat-ai ${phase >= 3 ? 'chat-in' : ''}`}>
                <p>Here's your game plan. Arrive 10 minutes early and order a sparkling water with lime — it looks like a G&T. When the wine list comes, say "I'm driving tonight." Focus on being the sharpest person at the table. You'll close harder sober than anyone else will after their third glass.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ━━━ PRIVACY / VAULT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function Vault() {
  const items = [
    { icon: '🔐', title: 'Face ID Lock', desc: 'Biometric authentication required every time.' },
    { icon: '🎭', title: 'Disguised Icon', desc: 'Looks like a utility app. No one will know.' },
    { icon: '🚫', title: 'No Social', desc: 'No forums. No profiles. No community. Just you.' },
    { icon: '🛡️', title: 'Zero Data Sharing', desc: 'Never sold. Never shared. Never aggregated.' },
  ]

  return (
    <section className="vault" id="privacy">
      <div className="vault-inner">
        <Reveal className="vault-header">
          <span className="section-eyebrow">THE VAULT</span>
          <h2 className="section-heading">
            What happens in the app<br />
            <span className="text-gradient">stays in the app.</span>
          </h2>
          <p className="section-sub">Built for men whose biggest concern is discretion.</p>
        </Reveal>

        <div className="vault-grid">
          {items.map((item, i) => (
            <Reveal key={i} delay={i * 100}>
              <GlassCard className="vault-card">
                <span className="vault-icon">{item.icon}</span>
                <h4 className="vault-title">{item.title}</h4>
                <p className="vault-desc">{item.desc}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ━━━ PRICING ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function Pricing() {
  const tiers = [
    {
      name: 'Free',
      price: '0',
      period: 'forever',
      features: ['Live day counter + timer', 'Milestone tracking', 'Daily protocol', 'Daily quotes'],
    },
    {
      name: 'Premium',
      price: '4.99',
      period: '/month',
      annual: '59.88/year',
      featured: true,
      features: ['Everything in Free', 'AI Performance Coach', 'Situation Playbook', 'Full debrief history', 'Advanced stats + trends', 'Content library'],
    },
    {
      name: 'Coaching',
      price: '149',
      period: '/month',
      badge: 'COMING SOON',
      features: ['Everything in Premium', '1-to-1 human coaching', 'Former executive mentor', 'Weekly video calls', 'Priority support'],
    },
  ]

  return (
    <section className="pricing" id="pricing">
      <div className="pricing-inner">
        <Reveal>
          <span className="section-eyebrow">PRICING</span>
          <h2 className="section-heading">
            Less than <span className="text-gradient">one night out.</span>
          </h2>
          <p className="section-sub">30 days free. Full access. No credit card.</p>
        </Reveal>

        <div className="pricing-grid">
          {tiers.map((tier, i) => (
            <Reveal key={i} delay={i * 120}>
              <GlassCard className={`pricing-card ${tier.featured ? 'pricing-featured' : ''}`} hover={false}>
                {tier.featured && <div className="pricing-glow" />}
                {tier.badge && <span className="pricing-badge-tag">{tier.badge}</span>}
                <h3 className="pricing-tier-name">{tier.name}</h3>
                <div className="pricing-amount">
                  <span className="pricing-currency">&pound;</span>
                  <span className="pricing-value">{tier.price}</span>
                  <span className="pricing-interval">{tier.period}</span>
                </div>
                {tier.annual && <p className="pricing-annual">&pound;{tier.annual}</p>}
                <ul className="pricing-list">
                  {tier.features.map((f, j) => (
                    <li key={j}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8.5l3 3 7-7" stroke="var(--success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                {tier.featured && (
                  <a href="#waitlist" className="btn btn-primary btn-full">Start Free Trial</a>
                )}
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ━━━ WAITLIST CTA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function Waitlist() {
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
          <p className="section-sub">Join the waitlist. Be first to access the app built specifically for professional men.</p>
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

/* ━━━ FOOTER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

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

/* ━━━ APP ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function App() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <Hero />
      <SocialProof />
      <Features />
      <Playbook />
      <CoachSection />
      <Vault />
      <Pricing />
      <Waitlist />
      <Footer />
    </>
  )
}
