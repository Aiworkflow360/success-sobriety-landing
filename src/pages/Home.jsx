import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  useScrollY, useInView, useCountUp,
  Reveal, GlassCard, GradientMesh, Waitlist, CtaStrip,
} from '../components/shared'

import phoneHero from '../assets/phone-hero.jpg'
import silhouetteMan from '../assets/silhouette-man.jpg'
import aiCoachBento from '../assets/ai-coach-bento.jpg'
import vaultDoor from '../assets/vault-door.jpg'
import milestoneCollection from '../assets/chips/milestone-collection.jpg'
import dailyProtocol from '../assets/daily-protocol.jpg'
import performanceLog from '../assets/performance-log.jpg'
import beforeAfter from '../assets/before-after.jpg'
import morningDiscipline from '../assets/morning-discipline.jpeg'
import wellnessHero from '../assets/wellness-hero.jpeg'
import testimonialJames from '../assets/testimonial-james.jpeg'
import testimonialMarcus from '../assets/testimonial-marcus.jpeg'
import testimonialDavid from '../assets/testimonial-david.jpeg'
import testimonialTom from '../assets/testimonial-tom.jpeg'

/* ━━━ HERO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function Hero() {
  const y = useScrollY()
  const opacity = Math.max(0, 1 - y / 600)
  const scale = 1 + y * 0.0003
  const imgScale = 1 + y * 0.0005

  return (
    <section className="hero hero-cinematic">
      <div className="hero-bg">
        <img
          src={silhouetteMan}
          alt="Professional man silhouetted against dawn skyline holding a glass of water"
          className="hero-bg-img"
          style={{ transform: `scale(${imgScale})` }}
          fetchpriority="high"
          loading="eager"
        />
        <div className="hero-bg-overlay" />
      </div>

      <div className="hero-content" style={{ opacity, transform: `scale(${scale})` }}>
        <div className="hero-eyebrow">
          <div className="eyebrow-line" />
          <span>FOR PROFESSIONAL MEN</span>
          <div className="eyebrow-line" />
        </div>

        <h1 className="hero-title">
          <span className="hero-title-line">Your edge starts</span>
          <span className="hero-title-line hero-title-accent">sober.</span>
        </h1>

        <p className="hero-sub">
          67% of alcohol-related deaths are men. Zero apps are built for them. Until now.<br />
          Track money saved. Master client dinners. Reclaim 600+ hours a year.
        </p>

        <div className="hero-ctas">
          <Link to="/pricing" className="btn btn-primary btn-lg">
            <span>Join the Waitlist</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
          <Link to="/features" className="btn btn-glass btn-lg">See What's Inside</Link>
        </div>
      </div>

      <div className="hero-scroll-hint" style={{ opacity: Math.max(0, 1 - y / 200) }}>
        <span>Scroll to explore</span>
        <div className="scroll-arrow" />
      </div>
    </section>
  )
}

/* ━━━ APP SHOWCASE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function AppShowcase() {
  return (
    <section className="app-showcase">
      <Reveal>
        <div className="app-showcase-inner">
          <div className="app-showcase-phone">
            <div className="phone-glow" />
            <img
              src={phoneHero}
              alt="Success & Sobriety app showing 247 days sober, £3,847 saved, 578 hours reclaimed"
              className="app-showcase-img"
              loading="lazy"
            />
          </div>
          <div className="app-showcase-text">
            <span className="section-eyebrow">YOUR DAILY DASHBOARD</span>
            <h2 className="section-heading">
              Every metric that <span className="text-gradient">matters.</span>
            </h2>
            <p className="section-sub">
              Money saved. Hours reclaimed. Health milestones unlocked. All in one glance.
            </p>
            <Link to="/features" className="btn btn-glass">Explore Features</Link>
          </div>
        </div>
      </Reveal>
    </section>
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
          <span className="proof-num">100%</span>
          <span className="proof-label">Private. Face ID. No social.</span>
        </div>
        <div className="proof-divider" />
        <div className="proof-stat">
          <span className="proof-num">&pound;{money.toLocaleString()}</span>
          <span className="proof-label">Redirected from bars to your future</span>
        </div>
        <div className="proof-divider" />
        <div className="proof-stat">
          <span className="proof-num">{hours}</span>
          <span className="proof-label">Hours back — that's 26 full days</span>
        </div>
        <div className="proof-divider" />
        <div className="proof-stat">
          <span className="proof-num">{cals.toLocaleString()}</span>
          <span className="proof-label">Calories — ~12kg of body fat</span>
        </div>
      </div>
    </section>
  )
}

/* ━━━ FEATURES BENTO GRID ━━━━━━━━━━━━━━━━━━━━━━━━━━ */

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
          <Reveal className="bento-item bento-lg">
            <GlassCard className="bento-card" glow="primary">
              <div className="bento-card-content">
                <span className="bento-icon bento-icon-scoreboard" />
                <h3 className="bento-title">The Scoreboard</h3>
                <p className="bento-desc">
                  Not just a day counter. A full performance dashboard — money saved, calories avoided,
                  hours reclaimed, plus an evidence-based health timeline. Day 7: sleep normalises.
                  Day 30: liver enzymes recover. Day 90: testosterone rebounds.
                </p>
              </div>
              <div className="bento-visual bento-visual-scoreboard">
                <div className="mini-stat-card"><span className="mini-val">&pound;3,847</span><span className="mini-label">Money Saved</span></div>
                <div className="mini-stat-card"><span className="mini-val">578h</span><span className="mini-label">Time Back</span></div>
                <div className="mini-stat-card accent"><span className="mini-val">84,240</span><span className="mini-label">Calories</span></div>
              </div>
            </GlassCard>
          </Reveal>

          <Reveal className="bento-item bento-md" delay={100}>
            <GlassCard className="bento-card bento-card-coach" glow="accent">
              <div className="bento-card-content">
                <span className="bento-icon bento-icon-coach" />
                <h3 className="bento-title">AI Sober Coach</h3>
                <p className="bento-desc">
                  Knows your triggers before you do. Coaches you through client dinners,
                  flights, and high-pressure moments. Hardcoded to never suggest moderation.
                </p>
                <div className="bento-tag">Powered by AI</div>
              </div>
              <img src={aiCoachBento} alt="AI Performance Coach — holographic figure emerging from smartphone in boardroom" className="bento-coach-img" loading="lazy" />
            </GlassCard>
          </Reveal>

          <Reveal className="bento-item bento-md" delay={200}>
            <GlassCard className="bento-card bento-card-vault">
              <div className="bento-card-content">
                <span className="bento-icon bento-icon-vault" />
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
              </div>
              <img src={vaultDoor} alt="Premium titanium vault with biometric lock" className="bento-vault-img" loading="lazy" />
            </GlassCard>
          </Reveal>

          <Reveal className="bento-item bento-sm" delay={100}>
            <GlassCard className="bento-card bento-card-chips">
              <span className="bento-icon bento-icon-milestones" />
              <h3 className="bento-title">22 Milestones</h3>
              <p className="bento-desc">
                From 24 hours to 5 years. Gamified progression that rewires your brain to expect daily wins.
              </p>
              <img src={milestoneCollection} alt="Monthly and yearly milestone chips collection" className="bento-chips-img" loading="lazy" />
            </GlassCard>
          </Reveal>

          <Reveal className="bento-item bento-sm" delay={200}>
            <GlassCard className="bento-card bento-card-protocol">
              <span className="bento-icon bento-icon-protocol" />
              <h3 className="bento-title">Daily Protocol</h3>
              <p className="bento-desc">
                3 check-ins, 5 minutes total. Reset your mind, manage triggers, reflect on wins. Streak from Bronze to Platinum.
              </p>
              <img src={dailyProtocol} alt="Premium daily protocol setup - journal, headphones, water" className="bento-protocol-img" loading="lazy" />
            </GlassCard>
          </Reveal>

          <Reveal className="bento-item bento-sm" delay={300}>
            <GlassCard className="bento-card bento-card-log">
              <span className="bento-icon bento-icon-log" />
              <h3 className="bento-title">Performance Log</h3>
              <p className="bento-desc">
                Rate mood, energy, productivity. AI spots patterns — "Your energy spikes 40% from day 3 onwards."
              </p>
              <img src={performanceLog} alt="Performance analytics dashboard — mood trend, energy bar, productivity score" className="bento-log-img" loading="lazy" />
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ━━━ BEFORE / AFTER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function Transformation() {
  return (
    <section className="transformation">
      <div className="transformation-inner">
        <Reveal className="transformation-header">
          <span className="section-eyebrow">THE COMPOUND EFFECT</span>
          <h2 className="section-heading" style={{ textAlign: 'center' }}>
            Same career. <span className="text-gradient">Different edge.</span>
          </h2>
          <p className="section-sub" style={{ textAlign: 'center', margin: '0 auto' }}>
            Day 3: sleep improves. Week 2: energy surges. Month 1: people notice.
          </p>
        </Reveal>

        <Reveal className="transform-image-wrap">
          <img src={beforeAfter} alt="Before: blurred bar scene. After: sharp office at sunrise." className="transform-hero-img" loading="lazy" />
        </Reveal>

        <div className="transform-grid">
          <Reveal>
            <GlassCard className="transform-card transform-before" hover={false}>
              <h4 className="transform-card-title">With Alcohol</h4>
              <ul className="transform-list">
                <li><span className="transform-x">&#10005;</span> Groggy mornings, slow starts</li>
                <li><span className="transform-x">&#10005;</span> £4,000+ gone every year</li>
                <li><span className="transform-x">&#10005;</span> Anxiety before big meetings</li>
                <li><span className="transform-x">&#10005;</span> Sleep disrupted 3-4 nights/week</li>
                <li><span className="transform-x">&#10005;</span> Brain fog during key decisions</li>
                <li><span className="transform-x">&#10005;</span> Extra 15kg you can't shift</li>
              </ul>
            </GlassCard>
          </Reveal>

          <Reveal delay={150}>
            <GlassCard className="transform-card transform-after" glow="primary" hover={false}>
              <h4 className="transform-card-title transform-title-glow">Without Alcohol</h4>
              <ul className="transform-list">
                <li><span className="transform-check">&#10003;</span> 5am starts, total clarity</li>
                <li><span className="transform-check">&#10003;</span> £4,000+ invested in yourself — a holiday, a course, a deposit</li>
                <li><span className="transform-check">&#10003;</span> Calm, confident presence</li>
                <li><span className="transform-check">&#10003;</span> Deep sleep every single night</li>
                <li><span className="transform-check">&#10003;</span> Sharpest person in every room</li>
                <li><span className="transform-check">&#10003;</span> Lean, energised, unstoppable</li>
              </ul>
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ━━━ TESTIMONIALS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function Testimonials() {
  const quotes = [
    {
      text: "I was spending £200 a week on client dinners and after-work drinks. Now I'm sharper in every meeting, closing more deals, and banking that money instead.",
      name: "James T.",
      role: "Managing Director, London",
      days: 312,
      img: testimonialJames,
    },
    {
      text: "Built my company from a co-working space while getting sober. The daily protocol kept me accountable when nobody else knew what I was going through.",
      name: "Marcus R.",
      role: "Founder & CEO, Manchester",
      days: 147,
      img: testimonialMarcus,
    },
    {
      text: "I needed a clear head and steady hands every single day. No community features, no forums — just a private, intelligent system that respects your time.",
      name: "David K.",
      role: "Consultant Surgeon, Edinburgh",
      days: 89,
      img: testimonialDavid,
    },
    {
      text: "I was the one always buying rounds, always last to leave. The Playbook's social strategies meant I could still do client dinners without anyone noticing.",
      name: "Tom H.",
      role: "Property Developer, Leeds",
      days: 203,
      img: testimonialTom,
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
            <Reveal key={i} delay={i * 100}>
              <GlassCard className="testimonial-card">
                <div className="testimonial-stars">{'★'.repeat(5)}</div>
                <p className="testimonial-text">"{q.text}"</p>
                <div className="testimonial-footer">
                  <img className="testimonial-avatar" src={q.img} alt={q.name} />
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
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ━━━ LIFE TRANSFORMED ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function LifeTransformed() {
  const stages = [
    {
      phase: 'THE BLUR',
      title: 'Where You Are Now',
      desc: 'Foggy mornings. Missed opportunities. Telling yourself "I\'ll cut back next week" for the hundredth time. The hangovers get worse but the drinking stays the same.',
      accent: '#8B3A3A',
    },
    {
      phase: 'THE SHIFT',
      title: 'Day 1 — You Decide',
      desc: 'One morning you wake up and something clicks. You don\'t need willpower — you need a system. A private, intelligent companion that understands your world.',
      accent: '#D4AF37',
    },
    {
      phase: 'THE BUILD',
      title: '30 Days — Momentum',
      desc: 'Sleep normalises. Focus sharpens. You\'re the first one in the office. Colleagues notice something different but can\'t put their finger on it. You can.',
      accent: '#4A90D9',
    },
    {
      phase: 'THE CLIMB',
      title: '90 Days — Compounding',
      desc: 'The promotion lands. The side project takes off. You\'re running 5Ks before sunrise. The money you used to spend on rounds is now in an ISA.',
      accent: '#50C878',
    },
    {
      phase: 'THE LIFE',
      title: '1 Year — Unrecognisable',
      desc: 'Corner office. Dream car on the drive. Holiday villa booked. You didn\'t just quit drinking — you became the man you always knew you could be.',
      accent: '#D4AF37',
    },
  ]

  return (
    <section className="life-transformed" id="life-transformed">
      <div className="life-transformed-inner">
        <Reveal>
          <span className="section-eyebrow">THE JOURNEY</span>
          <h2 className="section-heading" style={{ textAlign: 'center' }}>
            Your life, <span className="text-gradient">transformed.</span>
          </h2>
          <p className="section-sub" style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
            Giving up alcohol doesn't just remove a habit — it rewrites your entire future. Here's what the next 12 months look like.
          </p>
        </Reveal>

        <div className="life-timeline">
          {stages.map((s, i) => (
            <Reveal key={i} delay={i * 120}>
              <div className="life-stage">
                <div className="life-stage-marker" style={{ background: s.accent }} />
                <div className="life-stage-line" />
                <div className="life-stage-content">
                  <span className="life-stage-phase" style={{ color: s.accent }}>{s.phase}</span>
                  <h3 className="life-stage-title">{s.title}</h3>
                  <p className="life-stage-desc">{s.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={600}>
          <div className="life-transformed-video-placeholder">
            <div className="life-transformed-video-text">
              <span className="section-eyebrow">COMING SOON</span>
              <p>Watch the full cinematic transformation — from rock bottom to dream life.</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={700}>
          <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)' }}>
            <a href="#waitlist" className="btn btn-primary btn-lg">Start Your Transformation</a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ━━━ HOME PAGE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function Home() {
  useEffect(() => { document.title = 'Success & Sobriety — Perform at Your Peak' }, [])

  return (
    <>
      <Hero />
      <SocialProof />
      <AppShowcase />
      <Features />
      <Transformation />
      <section className="hero-divider">
        <img src={morningDiscipline} alt="Man running at dawn across a bridge — discipline, clarity, golden sunrise" className="hero-divider-img" loading="lazy" />
        <div className="hero-divider-overlay" />
        <div className="hero-divider-text">
          <span className="section-eyebrow">DISCIPLINE IS FREEDOM</span>
          <h2 className="section-heading hero-divider-heading">
            5am starts. <span className="text-gradient">Total clarity.</span>
          </h2>
        </div>
      </section>
      <Testimonials />
      <section className="hero-divider">
        <img src={wellnessHero} alt="Man meditating in luxury apartment overlooking London skyline at night" className="hero-divider-img" loading="lazy" />
        <div className="hero-divider-overlay" />
        <div className="hero-divider-text">
          <span className="section-eyebrow">BUILT-IN WELLNESS TOOLKIT</span>
          <h2 className="section-heading hero-divider-heading">
            Breathe. Ground. <span className="text-gradient">Reset.</span>
          </h2>
        </div>
      </section>
      <LifeTransformed />
      <Waitlist />
    </>
  )
}
