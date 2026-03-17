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

/* 3D scroll-driven tilt: returns { rotateX, rotateY, progress } based on element's viewport position */
function useScrollTilt(ref, { maxTilt = 12, axis = 'both' } = {}) {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, progress: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let ticking = false

    const update = () => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      // progress: 0 = just entering bottom, 0.5 = centered, 1 = exiting top
      const center = rect.top + rect.height / 2
      const progress = Math.max(0, Math.min(1, 1 - center / vh))
      // Map progress to tilt: enters tilted, straightens at center, tilts opposite as exits
      const normalized = (progress - 0.5) * 2 // -1 to 1
      const rx = axis === 'y' ? 0 : -normalized * maxTilt
      const ry = axis === 'x' ? 0 : normalized * (maxTilt * 0.4)
      setTilt({ rotateX: rx, rotateY: ry, progress })
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => window.removeEventListener('scroll', onScroll)
  }, [ref, maxTilt, axis])

  return tilt
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

/* 3D Tilt wrapper — applies perspective + scroll-driven rotation */
function Tilt3D({ children, className = '', maxTilt = 12, axis = 'both' }) {
  const ref = useRef(null)
  const { rotateX, rotateY } = useScrollTilt(ref, { maxTilt, axis })

  return (
    <div className={`tilt-3d-wrapper ${className}`} ref={ref}>
      <div
        className="tilt-3d-inner"
        style={{
          transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        }}
      >
        {children}
      </div>
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

/* ━━━ FLOATING PARTICLES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function FloatingParticles() {
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

function Nav() {
  const y = useScrollY()
  const scrolled = y > 60
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className={`nav ${scrolled ? 'nav-solid' : ''}`}>
      <div className="nav-inner">
        <a href="#" className="nav-brand">
          <span className="nav-logo">S</span>
          <span className="nav-brand-text">Success & Sobriety</span>
        </a>
        <div className={`nav-links ${menuOpen ? 'nav-links-open' : ''}`}>
          <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
          <a href="#calculator" onClick={() => setMenuOpen(false)}>Calculator</a>
          <a href="#playbook" onClick={() => setMenuOpen(false)}>Playbook</a>
          <a href="#coach" onClick={() => setMenuOpen(false)}>Coach</a>
          <a href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</a>
        </div>
        <a href="#waitlist" className="nav-cta-btn nav-cta-desktop">
          <span>Get Early Access</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </a>
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

/* ━━━ HERO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function Hero() {
  const y = useScrollY()
  const opacity = Math.max(0, 1 - y / 600)
  const scale = 1 + y * 0.0003
  const phoneY = y * 0.15
  const phoneRotateX = 8 - y * 0.02
  const phoneRotateY = -2 + y * 0.005

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

      {/* 3D Phone Mockup — scroll-driven rotation */}
      <div className="hero-phone-wrapper" style={{ transform: `translateY(${phoneY}px)` }}>
        <div className="phone-3d" style={{ transform: `rotateX(${Math.max(-5, phoneRotateX)}deg) rotateY(${Math.min(5, phoneRotateY)}deg)` }}>
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

/* ━━━ FEATURES BENTO GRID — with 3D SCROLL TILT ━━━━━ */

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
          {/* Large feature — Scoreboard with 3D tilt */}
          <Tilt3D className="bento-item bento-lg" maxTilt={8}>
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
          </Tilt3D>

          {/* Medium — AI Coach with 3D tilt */}
          <Tilt3D className="bento-item bento-md" maxTilt={10}>
            <GlassCard className="bento-card" glow="accent">
              <span className="bento-icon">🧠</span>
              <h3 className="bento-title">AI Performance Coach</h3>
              <p className="bento-desc">
                An executive-level sobriety coach, 24/7. Understands business culture,
                high-pressure environments, and client-facing roles.
              </p>
              <div className="bento-tag">Powered by AI</div>
            </GlassCard>
          </Tilt3D>

          {/* Medium — Privacy / Vault (merged) with 3D tilt */}
          <Tilt3D className="bento-item bento-md" maxTilt={10}>
            <GlassCard className="bento-card">
              <span className="bento-icon">🔐</span>
              <h3 className="bento-title">The Vault</h3>
              <p className="bento-desc">
                Face ID lock. Disguised icon. Zero social features. No data sharing.
                Built for men whose biggest concern is discretion.
              </p>
              <div className="bento-privacy-row">
                {['Face ID', 'Encrypted', 'No Social', 'GDPR'].map((item, i) => (
                  <span key={i} className="bento-privacy-tag">{item}</span>
                ))}
              </div>
            </GlassCard>
          </Tilt3D>

          {/* Small — Milestones */}
          <Tilt3D className="bento-item bento-sm" maxTilt={14}>
            <GlassCard className="bento-card">
              <span className="bento-icon">🏆</span>
              <h3 className="bento-title">22 Milestones</h3>
              <p className="bento-desc">
                From 24 hours to 5 years. Earn them. Collect them.
              </p>
              <div className="bento-milestone-row">
                {['24h', '72h', '1w', '1m', '3m', '6m', '1y'].map((m, i) => (
                  <div key={m} className={`bento-badge ${i < 4 ? 'earned' : ''}`}>{m}</div>
                ))}
              </div>
            </GlassCard>
          </Tilt3D>

          {/* Small — Protocol */}
          <Tilt3D className="bento-item bento-sm" maxTilt={14}>
            <GlassCard className="bento-card">
              <span className="bento-icon">✅</span>
              <h3 className="bento-title">Daily Protocol</h3>
              <p className="bento-desc">
                Morning. Midday. Evening. Track streaks from Bronze to Platinum.
              </p>
            </GlassCard>
          </Tilt3D>

          {/* Small — Debrief */}
          <Tilt3D className="bento-item bento-sm" maxTilt={14}>
            <GlassCard className="bento-card">
              <span className="bento-icon">📝</span>
              <h3 className="bento-title">Performance Log</h3>
              <p className="bento-desc">
                Rate mood, energy, productivity. Not a journal — a performance log.
              </p>
            </GlassCard>
          </Tilt3D>
        </div>
      </div>
    </section>
  )
}

/* ━━━ SAVINGS CALCULATOR ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function SavingsCalculator() {
  const [weeklySpend, setWeeklySpend] = useState(80)
  const [weeklyHours, setWeeklyHours] = useState(8)
  const [ref, inView] = useInView({ threshold: 0.15 })

  const yearlyMoney = weeklySpend * 52
  const yearlyHours = weeklyHours * 52
  const yearlyCalories = Math.round(weeklySpend / 5 * 180 * 52)
  const yearlyDays = Math.round(yearlyHours / 24)

  return (
    <section ref={ref} className={`calculator ${inView ? 'calculator-in' : ''}`} id="calculator">
      <div className="calculator-inner">
        <Reveal className="calculator-header">
          <span className="section-eyebrow">YOUR EDGE, QUANTIFIED</span>
          <h2 className="section-heading">
            See what sobriety<br />
            <span className="text-gradient">unlocks for you.</span>
          </h2>
          <p className="section-sub">Drag the sliders. See your numbers. This is your potential.</p>
        </Reveal>

        <div className="calculator-body">
          <div className="calculator-inputs">
            <GlassCard className="calculator-slider-card" hover={false}>
              <div className="slider-header">
                <label className="slider-label">Weekly alcohol spend</label>
                <span className="slider-value">&pound;{weeklySpend}</span>
              </div>
              <input
                type="range"
                min="10"
                max="300"
                step="5"
                value={weeklySpend}
                onChange={(e) => setWeeklySpend(Number(e.target.value))}
                className="calc-range"
              />
              <div className="slider-range-labels">
                <span>&pound;10</span>
                <span>&pound;300</span>
              </div>
            </GlassCard>

            <GlassCard className="calculator-slider-card" hover={false}>
              <div className="slider-header">
                <label className="slider-label">Weekly hours drinking/recovering</label>
                <span className="slider-value">{weeklyHours}h</span>
              </div>
              <input
                type="range"
                min="2"
                max="30"
                step="1"
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(Number(e.target.value))}
                className="calc-range"
              />
              <div className="slider-range-labels">
                <span>2h</span>
                <span>30h</span>
              </div>
            </GlassCard>
          </div>

          <div className="calculator-results">
            <div className="calc-result-grid">
              <GlassCard className="calc-result-card" glow="primary" hover={false}>
                <span className="calc-result-icon">💰</span>
                <span className="calc-result-num">&pound;{yearlyMoney.toLocaleString()}</span>
                <span className="calc-result-label">Saved per year</span>
                <span className="calc-result-sub">&pound;{(yearlyMoney * 5).toLocaleString()} over 5 years</span>
              </GlassCard>
              <GlassCard className="calc-result-card" glow="accent" hover={false}>
                <span className="calc-result-icon">⏱️</span>
                <span className="calc-result-num">{yearlyHours.toLocaleString()}</span>
                <span className="calc-result-label">Hours reclaimed</span>
                <span className="calc-result-sub">That's {yearlyDays} full days back</span>
              </GlassCard>
              <GlassCard className="calc-result-card" hover={false}>
                <span className="calc-result-icon">🔥</span>
                <span className="calc-result-num">{yearlyCalories.toLocaleString()}</span>
                <span className="calc-result-label">Calories avoided</span>
                <span className="calc-result-sub">~{Math.round(yearlyCalories / 7700)}kg of body fat</span>
              </GlassCard>
              <GlassCard className="calc-result-card" hover={false}>
                <span className="calc-result-icon">📈</span>
                <span className="calc-result-num">100%</span>
                <span className="calc-result-label">Of mornings sharp</span>
                <span className="calc-result-sub">No more wasted Sundays</span>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ━━━ BEFORE / AFTER with 3D TILT ━━━━━━━━━━━━━━━━━━━ */

function Transformation() {
  return (
    <section className="transformation">
      <div className="transformation-inner">
        <Reveal className="transformation-header">
          <span className="section-eyebrow">THE COMPOUND EFFECT</span>
          <h2 className="section-heading" style={{ textAlign: 'center' }}>
            Same career. <span className="text-gradient">Different edge.</span>
          </h2>
        </Reveal>

        <div className="transform-grid">
          <Tilt3D maxTilt={10} axis="x">
            <GlassCard className="transform-card transform-before" hover={false}>
              <h4 className="transform-card-title">With Alcohol</h4>
              <ul className="transform-list">
                <li><span className="transform-x">✕</span> Groggy mornings, slow starts</li>
                <li><span className="transform-x">✕</span> £4,000+ gone every year</li>
                <li><span className="transform-x">✕</span> Anxiety before big meetings</li>
                <li><span className="transform-x">✕</span> Sleep disrupted 3-4 nights/week</li>
                <li><span className="transform-x">✕</span> Brain fog during key decisions</li>
                <li><span className="transform-x">✕</span> Extra 15kg you can't shift</li>
              </ul>
            </GlassCard>
          </Tilt3D>

          <Tilt3D maxTilt={10} axis="x">
            <GlassCard className="transform-card transform-after" glow="primary" hover={false}>
              <h4 className="transform-card-title transform-title-glow">Without Alcohol</h4>
              <ul className="transform-list">
                <li><span className="transform-check">✓</span> 5am starts, total clarity</li>
                <li><span className="transform-check">✓</span> £4,000+ invested in yourself</li>
                <li><span className="transform-check">✓</span> Calm, confident presence</li>
                <li><span className="transform-check">✓</span> Deep sleep every single night</li>
                <li><span className="transform-check">✓</span> Sharpest person in every room</li>
                <li><span className="transform-check">✓</span> Lean, energised, unstoppable</li>
              </ul>
            </GlassCard>
          </Tilt3D>
        </div>
      </div>
    </section>
  )
}

/* ━━━ INTERACTIVE PLAYBOOK ━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function Playbook() {
  const [expanded, setExpanded] = useState(null)

  const scenarios = [
    {
      icon: '🍷', title: 'Client Dinner', sub: 'Everyone is drinking. You need to close the deal.',
      strategy: 'Arrive 10 minutes early. Order sparkling water with lime — looks like a G&T. When wine comes: "I\'m driving tonight." Focus on being the sharpest closer at the table. You\'ll outperform everyone after their third glass.',
    },
    {
      icon: '🍺', title: 'Friday Drinks', sub: 'The team heads to the pub. You\'re expected.',
      strategy: 'Show up for 45 minutes. Hold a tonic water. Steer conversations. Be the one who remembers the jokes on Monday. Leave with: "Early start tomorrow — big one." Nobody questions the guy who\'s winning.',
    },
    {
      icon: '🥂', title: 'Networking Event', sub: 'Open bar. New contacts. High pressure.',
      strategy: 'Get a glass of sparkling water first thing. Hold it visibly. Focus on collecting 3 quality contacts, not working the room drunk. You\'ll be the only person who follows up the next morning. That\'s the edge.',
    },
    {
      icon: '✈️', title: 'Business Class', sub: 'Free drinks trolley. 8-hour flight.',
      strategy: 'Noise-cancelling headphones on. Order espresso and water. Use the hours: read, plan, work. Land fresh while everyone else lands hungover. This is 8 hours of compound advantage.',
    },
    {
      icon: '😤', title: '"I Deserve a Drink"', sub: 'Bad deal. Bad day. The old voice returns.',
      strategy: 'That voice is your limbic system, not your rational mind. Counter: "I deserve to wake up sharp tomorrow." Hit the gym, cold shower, debrief in the app. The craving passes in 20 minutes. The regret lasts days.',
    },
    {
      icon: '🎉', title: 'The Stag Do', sub: 'The big trip. All eyes on you.',
      strategy: 'Tell 1-2 close mates beforehand. They\'ll cover for you. Volunteer to be the designated driver/organiser. Be the one with the stories, the photos, the energy. Nobody remembers who drank what — they remember who brought the energy.',
    },
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
          <p className="section-sub">Tap any situation. Get your game plan.</p>
        </Reveal>

        <div className="playbook-grid">
          {scenarios.map((s, i) => (
            <Tilt3D key={i} className="playbook-tilt" maxTilt={expanded === i ? 0 : 8}>
              <div
                className={`playbook-card-interactive ${expanded === i ? 'playbook-expanded' : ''}`}
                onClick={() => setExpanded(expanded === i ? null : i)}
              >
                <GlassCard className="playbook-card" hover={expanded !== i}>
                  <div className="playbook-card-front">
                    <span className="playbook-icon">{s.icon}</span>
                    <div className="playbook-text">
                      <h4 className="playbook-title">{s.title}</h4>
                      <p className="playbook-sub">{s.sub}</p>
                    </div>
                    <div className={`playbook-expand-icon ${expanded === i ? 'playbook-expand-open' : ''}`}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>
                  <div className="playbook-strategy">
                    <div className="playbook-strategy-inner">
                      <span className="playbook-strategy-label">YOUR GAME PLAN</span>
                      <p className="playbook-strategy-text">{s.strategy}</p>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </Tilt3D>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ━━━ AI COACH SECTION ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function CoachSection() {
  const [ref, inView] = useInView({ threshold: 0.2 })
  const [phase, setPhase] = useState(0)

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

        <Tilt3D maxTilt={6} className="coach-right">
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
        </Tilt3D>
      </div>
    </section>
  )
}

/* ━━━ TESTIMONIALS with 3D TILT ━━━━━━━━━━━━━━━━━━━━━ */

function Testimonials() {
  const quotes = [
    {
      text: "I was spending £200 a week on client dinners and after-work drinks. Now I'm sharper in every meeting, closing more deals, and banking that money instead.",
      name: "James T.",
      role: "Managing Director, London",
      days: 312,
    },
    {
      text: "The Playbook section alone is worth the subscription. I used the 'Client Dinner' strategy last week and nobody even noticed I wasn't drinking.",
      name: "Marcus R.",
      role: "Sales Director, Manchester",
      days: 147,
    },
    {
      text: "No social features, no community forums, no sharing. Finally an app that respects that some of us just want to handle this privately and get on with it.",
      name: "David K.",
      role: "Partner, Big 4 Firm",
      days: 89,
    },
  ]

  return (
    <section className="testimonials" id="testimonials">
      <div className="testimonials-inner">
        <Reveal>
          <span className="section-eyebrow">EARLY TESTERS</span>
          <h2 className="section-heading" style={{ textAlign: 'center' }}>
            Built with men <span className="text-gradient">like you.</span>
          </h2>
        </Reveal>

        <div className="testimonials-grid">
          {quotes.map((q, i) => (
            <Tilt3D key={i} maxTilt={10}>
              <GlassCard className="testimonial-card">
                <div className="testimonial-stars">{'★'.repeat(5)}</div>
                <p className="testimonial-text">"{q.text}"</p>
                <div className="testimonial-footer">
                  <div className="testimonial-avatar">{q.name.charAt(0)}</div>
                  <div className="testimonial-info">
                    <span className="testimonial-name">{q.name}</span>
                    <span className="testimonial-role">{q.role}</span>
                  </div>
                  <div className="testimonial-days">
                    <span className="testimonial-days-num">{q.days}</span>
                    <span className="testimonial-days-label">days</span>
                  </div>
                </div>
              </GlassCard>
            </Tilt3D>
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
      price: '9.99',
      period: '/month',
      annual: '95.90',
      annualSave: '20%',
      featured: true,
      features: ['Everything in Free', 'AI Performance Coach', 'Situation Playbook', 'Full debrief history', 'Advanced stats + trends', 'Content library'],
    },
    {
      name: 'Coaching',
      price: '149',
      period: '/month',
      annual: '1,430.40',
      annualSave: '20%',
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
            Less than <span className="text-gradient">one pint a month.</span>
          </h2>
          <p className="section-sub">That's it. Less than a single pint in your local. 30 days free. No credit card required.</p>
        </Reveal>

        <div className="pricing-grid">
          {tiers.map((tier, i) => (
            <Tilt3D key={i} maxTilt={6}>
              <GlassCard className={`pricing-card ${tier.featured ? 'pricing-featured gradient-border' : ''}`} hover={false}>
                {tier.featured && <div className="pricing-glow" />}
                {tier.badge && <span className="pricing-badge-tag">{tier.badge}</span>}
                <h3 className="pricing-tier-name">{tier.name}</h3>
                <div className="pricing-amount">
                  <span className="pricing-currency">&pound;</span>
                  <span className="pricing-value">{tier.price}</span>
                  <span className="pricing-interval">{tier.period}</span>
                </div>
                {tier.annual && (
                  <p className="pricing-annual">
                    &pound;{tier.annual}/year
                    {tier.annualSave && <span className="pricing-save">Save {tier.annualSave}</span>}
                  </p>
                )}
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
            </Tilt3D>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ━━━ FAQ ACCORDION ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function FAQ() {
  const [open, setOpen] = useState(null)

  const faqs = [
    { q: 'Is this app only for people with alcohol addiction?', a: 'No. Success & Sobriety is for any professional man who\'s decided alcohol no longer serves his goals. Whether you\'re cutting back, going fully sober, or just curious about the edge sobriety gives — this app meets you where you are.' },
    { q: 'Will anyone know I\'m using this app?', a: 'Absolutely not. The app uses a disguised icon, requires Face ID to open, has no social features, and shares zero data with anyone. It\'s designed from the ground up for men who need complete discretion.' },
    { q: 'How is the AI Coach different from ChatGPT?', a: 'Our coach is purpose-built for sobriety in professional contexts. It understands business culture, client entertainment, and corporate pressure. It\'s hardcoded to never suggest moderation — only strategies that support your decision to stay sharp.' },
    { q: 'What happens if I relapse?', a: 'You reset your counter and keep going. No judgement. No shame. Your historical data, savings calculations, and milestones are preserved. The app is designed to support long-term commitment, not perfection.' },
    { q: 'Can I cancel anytime?', a: 'Yes. No contracts, no lock-in. Cancel through the App Store or Google Play at any time. Your data is yours and can be exported or deleted permanently.' },
    { q: 'Is the £9.99/month price going up?', a: 'Yes — our launch price is less than two pints a month. Early subscribers lock in this founding member rate. Once we add human coaching features, the price will increase to reflect the value. Pay annually and save 20%.' },
  ]

  return (
    <section className="faq" id="faq">
      <div className="faq-inner">
        <Reveal>
          <span className="section-eyebrow">QUESTIONS</span>
          <h2 className="section-heading" style={{ textAlign: 'center' }}>
            Straight <span className="text-gradient">answers.</span>
          </h2>
        </Reveal>

        <div className="faq-list">
          {faqs.map((faq, i) => (
            <Reveal key={i} delay={i * 60}>
              <div
                className={`faq-item ${open === i ? 'faq-item-open' : ''}`}
                onClick={() => setOpen(open === i ? null : i)}
              >
                <div className="faq-question">
                  <span>{faq.q}</span>
                  <svg className="faq-chevron" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="faq-answer">
                  <p>{faq.a}</p>
                </div>
              </div>
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

/* ━━━ TRUST BADGES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function TrustBadges() {
  const badges = [
    { icon: '🔒', text: 'End-to-End Encrypted' },
    { icon: '🍎', text: 'Apple Health Ready' },
    { icon: '🛡️', text: 'GDPR Compliant' },
    { icon: '🔬', text: 'Evidence-Based' },
    { icon: '🇬🇧', text: 'Built in the UK' },
    { icon: '⚡', text: 'Offline Capable' },
  ]

  return (
    <div className="trust-badges">
      {badges.map((b, i) => (
        <div key={i} className="trust-badge">
          <span className="trust-badge-icon">{b.icon}</span>
          <span className="trust-badge-text">{b.text}</span>
        </div>
      ))}
    </div>
  )
}

/* ━━━ FOOTER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <TrustBadges />
        <span className="footer-brand">Success & Sobriety</span>
        <p className="footer-tagline">The performance app for men who've decided alcohol no longer serves them.</p>
        <div className="footer-links">
          <a href="#features">Features</a>
          <a href="#calculator">Calculator</a>
          <a href="#playbook">Playbook</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
        </div>
        <p className="footer-copy">&copy; 2026 Success & Sobriety. All rights reserved.</p>
      </div>
    </footer>
  )
}

/* ━━━ APP — 12 SECTIONS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function App() {
  return (
    <>
      <FloatingParticles />
      <ScrollProgress />
      <Nav />
      <Hero />
      <SocialProof />
      <Features />
      <SavingsCalculator />
      <Transformation />
      <Playbook />
      <CoachSection />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Waitlist />
      <Footer />
    </>
  )
}
