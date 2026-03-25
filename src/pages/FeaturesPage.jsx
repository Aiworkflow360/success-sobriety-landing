import { useState, useEffect } from 'react'
import { useInView, Reveal, GlassCard } from '../components/shared'
import Mindfulness from '../components/Mindfulness'
import SavingsCalculator from '../components/SavingsCalculator'
import PlaybookSection from '../components/PlaybookSection'
import aiCoachAvatar from '../assets/ai-coach-avatar.jpg'
import monthlyChipsRow from '../assets/chips/monthly-chips-row.jpg'

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
          <span className="section-eyebrow">AI SOBER COACH</span>
          <h2 className="section-heading">
            Your sharpest<br />
            <span className="text-gradient">advisor. 24/7.</span>
          </h2>
          <p className="coach-desc">
            Not a therapist. Not a chatbot. An executive-level mentor who reads your journal,
            knows your calendar, tracks your goals, and understands the pressure to perform.
          </p>
          <ul className="coach-list">
            <li><span className="coach-bullet" />Reads your diary entries, calendar, and daily goals for personalised support</li>
            <li><span className="coach-bullet" />Knows the science — testosterone, cortisol, sleep, cognition</li>
            <li><span className="coach-bullet" />Spots upcoming triggers in your calendar and prepares you</li>
            <li><span className="coach-bullet" />Challenges excuses. Celebrates wins. Never suggests moderation.</li>
            <li><span className="coach-bullet" />Available 24/7 — at 2am when you can't sleep, or 2pm before a trigger meeting</li>
          </ul>
        </Reveal>

        <Reveal className="coach-right" delay={200}>
          <div className="coach-avatar-wrap">
            <img src={aiCoachAvatar} alt="AI Performance Coach — holographic wireframe avatar" className="coach-avatar-img" loading="lazy" />
          </div>
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
                <p>I can see from your calendar that's the Meridian Group dinner. Your journal entry on Tuesday mentioned you've been feeling confident this week — let's use that. Arrive 10 minutes early, order sparkling water with lime. When the wine list comes: "I'm driving tonight." You'll close harder sober than anyone else will after their third glass.</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ━━━ PROGRESS CHIPS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function ProgressChips() {
  return (
    <section className="chips" id="chips">
      <div className="chips-inner">
        <Reveal className="chips-header">
          <span className="section-eyebrow">COLLECT YOUR PROGRESS</span>
          <h2 className="section-heading" style={{ textAlign: 'center' }}>
            Earn your <span className="text-gradient">chips.</span>
          </h2>
          <p className="section-sub" style={{ textAlign: 'center', margin: '0 auto' }}>
            Just like AA sobriety chips — each milestone earned, never given. Your collection grows as you do.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <h3 className="chips-subsection-title">Your Collection</h3>
        </Reveal>

        <Reveal className="chips-showcase" delay={200}>
          <img
            src={monthlyChipsRow}
            alt="1 to 11 month sobriety milestone chips in silver, bronze, and gold"
            className="chips-showcase-img"
            loading="lazy"
          />
          <div className="chips-showcase-gradient" />
        </Reveal>

        <Reveal delay={100}>
          <h3 className="chips-subsection-title">Health Milestones</h3>
        </Reveal>

        <div className="chips-milestones-row">
          {[
            { label: '24 Hours', desc: 'Alcohol leaves your bloodstream. The hardest day — done.' },
            { label: '1 Week', desc: 'Sleep cycles normalise. REM sleep returns.' },
            { label: '1 Month', desc: 'Liver enzymes recover. Skin clears. Brain fog lifts.' },
            { label: '3 Months', desc: 'Dopamine receptors heal. New neural pathways locked in.' },
            { label: '6 Months', desc: 'Testosterone rebounds. Immune system strengthens.' },
            { label: '1 Year', desc: 'Full cognitive recovery. You are a different person.' },
            { label: '5 Years', desc: 'Liver disease risk drops 50%. Half a decade of compounding.' },
          ].map((m, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="chips-milestone-item">
                <span className="chips-milestone-label">{m.label}</span>
                <span className="chips-milestone-desc">{m.desc}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ━━━ FEATURES PAGE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function FeaturesPage() {
  useEffect(() => { document.title = 'Features — Success & Sobriety' }, [])

  return (
    <>
      <SavingsCalculator />
      <PlaybookSection />
      <CoachSection />
      <Mindfulness />
      <ProgressChips />
    </>
  )
}
