import { useState, useEffect } from 'react'
import { useInView, Reveal, GlassCard } from '../components/shared'
import Mindfulness from '../components/Mindfulness'
import aiCoachAvatar from '../assets/ai-coach-avatar.jpg'
import monthlyChipsRow from '../assets/chips/monthly-chips-row.jpg'

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
          <h1 className="section-heading">
            What's sobriety<br />
            <span className="text-gradient">worth to you?</span>
          </h1>
          <p className="section-sub">Move the sliders. See the return on your sobriety.</p>
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
                <span className="calc-result-icon calc-icon-money" />
                <span className="calc-result-num">&pound;{yearlyMoney.toLocaleString()}</span>
                <span className="calc-result-label">Saved per year</span>
                <span className="calc-result-sub">&pound;{(yearlyMoney * 5).toLocaleString()} over 5 years</span>
              </GlassCard>
              <GlassCard className="calc-result-card" glow="accent" hover={false}>
                <span className="calc-result-icon calc-icon-time" />
                <span className="calc-result-num">{yearlyHours.toLocaleString()}</span>
                <span className="calc-result-label">Hours reclaimed</span>
                <span className="calc-result-sub">That's {yearlyDays} full days back</span>
              </GlassCard>
              <GlassCard className="calc-result-card" hover={false}>
                <span className="calc-result-icon calc-icon-cal" />
                <span className="calc-result-num">{yearlyCalories.toLocaleString()}</span>
                <span className="calc-result-label">Calories avoided</span>
                <span className="calc-result-sub">~{Math.round(yearlyCalories / 7700)}kg of body fat</span>
              </GlassCard>
              <GlassCard className="calc-result-card" hover={false}>
                <span className="calc-result-icon calc-icon-sharp" />
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

/* ━━━ INTERACTIVE PLAYBOOK ━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function Playbook() {
  const [expanded, setExpanded] = useState(null)

  const scenarios = [
    {
      title: 'Client Dinner', sub: 'Everyone is drinking. You need to close the deal.',
      strategy: 'Arrive 10 minutes early. Order sparkling water with lime — looks like a G&T. When wine comes: "I\'m driving tonight." Focus on being the sharpest closer at the table. You\'ll outperform everyone after their third glass.',
    },
    {
      title: 'Friday Drinks', sub: 'The team heads to the pub. You\'re expected.',
      strategy: 'Show up for 45 minutes. Hold a tonic water. Steer conversations. Be the one who remembers the jokes on Monday. Leave with: "Early start tomorrow — big one." Nobody questions the guy who\'s winning.',
    },
    {
      title: 'Networking Event', sub: 'Open bar. New contacts. High pressure.',
      strategy: 'Get a glass of sparkling water first thing. Hold it visibly. Focus on collecting 3 quality contacts, not working the room drunk. You\'ll be the only person who follows up the next morning. That\'s the edge.',
    },
    {
      title: 'Business Class', sub: 'Free drinks trolley. 8-hour flight.',
      strategy: 'Noise-cancelling headphones on. Order espresso and water. Use the hours: read, plan, work. Land fresh while everyone else lands hungover. This is 8 hours of compound advantage.',
    },
    {
      title: '"I Deserve a Drink"', sub: 'Bad deal. Bad day. The old voice returns.',
      strategy: 'That voice is your limbic system, not your rational mind. Counter: "I deserve to wake up sharp tomorrow." Hit the gym, cold shower, debrief in the app. The craving passes in 20 minutes. The regret lasts days.',
    },
    {
      title: 'The Stag Do', sub: 'The big trip. All eyes on you.',
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
          <p className="section-sub">Real situations. Real strategies. Tested by early access members.</p>
        </Reveal>

        <div className="playbook-grid">
          {scenarios.map((s, i) => (
            <Reveal key={i} delay={i * 60}>
              <div
                className={`playbook-card-interactive ${expanded === i ? 'playbook-expanded' : ''}`}
                onClick={() => setExpanded(expanded === i ? null : i)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpanded(expanded === i ? null : i) } }}
                role="button"
                tabIndex={0}
                aria-expanded={expanded === i}
              >
                <GlassCard className="playbook-card" hover={expanded !== i}>
                  <div className="playbook-card-front">
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

        <Reveal className="chips-showcase" delay={200}>
          <img
            src={monthlyChipsRow}
            alt="1 to 11 month sobriety milestone chips in silver, bronze, and gold"
            className="chips-showcase-img"
            loading="lazy"
          />
          <div className="chips-showcase-gradient" />
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
      <Playbook />
      <CoachSection />
      <Mindfulness />
      <ProgressChips />
    </>
  )
}
