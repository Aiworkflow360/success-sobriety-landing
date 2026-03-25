import { useState, useEffect, useCallback } from 'react'
import { Reveal, GlassCard } from '../components/shared'

const scenarios = [
  { title: 'Client Dinner', sub: 'Everyone is drinking. You need to close the deal.', strategy: 'Arrive 10 minutes early. Order sparkling water with lime — looks like a G&T. When wine comes: "I\'m driving tonight." Focus on being the sharpest closer at the table. You\'ll outperform everyone after their third glass.', coachSays: 'I can see the Meridian Group dinner in your calendar. Last time you used the soda-and-lime strategy — it worked. Let\'s prep.', proTip: 'The earlier you order a non-alcoholic drink, the less anyone notices.' },
  { title: 'Friday Drinks', sub: 'The team heads to the pub. You\'re expected.', strategy: 'Show up for 45 minutes. Hold a tonic water. Steer conversations. Be the one who remembers the jokes on Monday. Leave with: "Early start tomorrow — big one." Nobody questions the guy who\'s winning.', coachSays: 'Your energy is high today — perfect window to show up confident. 45 minutes, then your gym session.', proTip: 'Arrive with a drink already in hand. It kills the "can I get you one?" loop.' },
  { title: 'Networking Event', sub: 'Open bar. New contacts. High pressure.', strategy: 'Get a glass of sparkling water first thing. Hold it visibly. Focus on collecting 3 quality contacts, not working the room drunk. You\'ll be the only person who follows up the next morning. That\'s the edge.', coachSays: 'Your goal tonight: 3 contacts, 3 follow-up emails by 8am. That\'s your competitive advantage.', proTip: 'Hold your glass in your left hand so your right is always dry for handshakes.' },
  { title: 'Business Class', sub: 'Free drinks trolley. 8-hour flight.', strategy: 'Noise-cancelling headphones on. Order espresso and water. Use the hours: read, plan, work. Land fresh while everyone else lands hungover. This is 8 hours of compound advantage.', coachSays: 'You\'ve got the Tokyo meeting 3 hours after landing. Hydration + sleep = closing power.', proTip: 'Pack a book you\'ve been wanting to read. Replace the ritual, don\'t just remove it.' },
  { title: '"I Deserve a Drink"', sub: 'Bad deal. Bad day. The old voice returns.', strategy: 'That voice is your limbic system, not your rational mind. Counter: "I deserve to wake up sharp tomorrow." Hit the gym, cold shower, debrief in the app. The craving passes in 20 minutes. The regret lasts days.', coachSays: 'Your journal entry from Tuesday shows you\'ve been under pressure. That\'s the trigger talking, not you. 20 minutes — let\'s breathe through it.', proTip: 'Set a 20-minute timer. If you still want it after, you\'ll at least have made a conscious choice.' },
  { title: 'The Stag Do', sub: 'The big trip. All eyes on you.', strategy: 'Tell 1-2 close mates beforehand. They\'ll cover for you. Volunteer to be the designated driver/organiser. Be the one with the stories, the photos, the energy. Nobody remembers who drank what — they remember who brought the energy.', coachSays: 'You\'ve got 2 allies briefed. Your role: the organiser. Energy, not excuses.', proTip: 'Bring a camera. The man with the best photos becomes the story, not the drink.' },
  { title: 'The Wedding', sub: 'Open bar. Your partner\'s friends. 12-hour day.', strategy: 'Champagne toast: hold it, touch your lips, set it down. Order tonic with cucumber for the rest. You\'ll be the best dancer, the best conversationalist, and the only one who remembers the speeches. Drive home.', coachSays: 'Long day ahead. Let\'s set three checkpoints: ceremony, dinner, first dance. Check in with me at each.', proTip: 'Volunteer for photos. Nobody questions why you\'re holding a camera instead of a glass.' },
  { title: 'Working From Home', sub: 'No accountability. Wine o\'clock habit.', strategy: 'Structure kills temptation. End your workday with a ritual: gym, cold shower, herbal tea, debrief in the app. Replace the "reward" with something that compounds. The bottle of wine costs £12 and tomorrow\'s focus. The gym costs nothing and builds everything.', coachSays: 'Your afternoon energy typically dips at 4pm. Let\'s front-load your hardest task before then and reward with a walk.', proTip: 'Move the wine out of sight. Literally. Friction is your friend.' },
  { title: 'The Christmas Party', sub: 'Annual blowout. Everyone expects it.', strategy: 'Arrive on time, leave by 10. Have your "story" ready: "I\'m training for a marathon" / "Doing a health experiment" / "Doctor\'s orders." Pick one and own it. You\'ll still have fun — and you\'ll be the only one who can face clients on December 23rd.', coachSays: 'Last year you said the Christmas party was your biggest trigger. This year, you\'ve got a plan and 90+ days of momentum. You\'ve earned this.', proTip: 'Eat before you go. Low blood sugar + social pressure = the danger zone.' },
]

function CoachIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <circle cx="10" cy="10" r="9" stroke="#5BA4E6" strokeWidth="1.5" fill="rgba(91,164,230,0.12)" />
      <path d="M10 5.5C8.62 5.5 7.5 6.62 7.5 8c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5c0-1.38-1.12-2.5-2.5-2.5zM6 14c0-1.66 2.69-2.5 4-2.5s4 .84 4 2.5v.5H6V14z" fill="#5BA4E6" />
    </svg>
  )
}

function AccordionCard({ scenario, isOpen, onClick }) {
  return (
    <GlassCard className="playbook-v2__accordion-card" hover onClick={onClick}>
      <div className="playbook-v2__accordion-header">
        <div>
          <h3 className="playbook-v2__accordion-title">{scenario.title}</h3>
          <p className="playbook-v2__accordion-sub">{scenario.sub}</p>
        </div>
        <span className={`playbook-v2__accordion-chevron ${isOpen ? 'open' : ''}`}>&#9662;</span>
      </div>
      <div className={`playbook-v2__accordion-body ${isOpen ? 'open' : ''}`}>
        <p className="playbook-v2__strategy-text">{scenario.strategy}</p>
        <div className="playbook-v2__coach-bubble">
          <CoachIcon />
          <p>{scenario.coachSays}</p>
        </div>
        <div className="playbook-v2__pro-tip">
          <span className="playbook-v2__pro-tip-label">PRO TIP</span>
          <p>{scenario.proTip}</p>
        </div>
      </div>
    </GlassCard>
  )
}

export default function PlaybookSection({ expanded = false, highlightScenarios }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [openAccordion, setOpenAccordion] = useState(null)
  const [isPaused, setIsPaused] = useState(false)
  const [animKey, setAnimKey] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // Order scenarios with highlights first
  const orderedScenarios = (() => {
    if (!highlightScenarios || highlightScenarios.length === 0) return scenarios
    const highlighted = []
    const rest = []
    scenarios.forEach(s => {
      if (highlightScenarios.includes(s.title)) highlighted.push(s)
      else rest.push(s)
    })
    return [...highlighted, ...rest]
  })()

  // Mobile detection
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Auto-cycle for expanded mode
  useEffect(() => {
    if (!expanded || isMobile || isPaused) return
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % orderedScenarios.length)
      setAnimKey(k => k + 1)
    }, 6000)
    return () => clearInterval(timer)
  }, [expanded, isMobile, isPaused, orderedScenarios.length])

  // Resume auto-cycle after 8s of no interaction
  useEffect(() => {
    if (!isPaused) return
    const resume = setTimeout(() => setIsPaused(false), 8000)
    return () => clearTimeout(resume)
  }, [isPaused])

  const handleSelectScenario = useCallback((index) => {
    setActiveIndex(index)
    setAnimKey(k => k + 1)
    setIsPaused(true)
  }, [])

  const handleToggleAccordion = useCallback((index) => {
    setOpenAccordion(prev => prev === index ? null : index)
  }, [])

  const useAccordion = !expanded || isMobile
  const active = orderedScenarios[activeIndex]

  return (
    <section className="playbook-v2">
      <style>{`
        .playbook-v2 {
          padding: 5rem 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .playbook-v2__header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .playbook-v2__eyebrow {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #D4AF37;
          margin-bottom: 0.75rem;
        }

        .playbook-v2__heading {
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          font-weight: 800;
          color: #f0f0f0;
          margin: 0 0 1rem;
          line-height: 1.15;
        }

        .playbook-v2__heading .text-gradient {
          background: linear-gradient(135deg, #D4AF37, #F5D76E, #D4AF37);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .playbook-v2__sub {
          font-size: 1.05rem;
          color: rgba(255,255,255,0.55);
          max-width: 540px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* ── Accordion Grid ── */

        .playbook-v2__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        @media (max-width: 767px) {
          .playbook-v2__grid {
            grid-template-columns: 1fr;
          }
        }

        .playbook-v2__accordion-card {
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .playbook-v2__accordion-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.25rem 1.5rem;
        }

        .playbook-v2__accordion-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #f0f0f0;
          margin: 0 0 0.25rem;
        }

        .playbook-v2__accordion-sub {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.45);
          margin: 0;
          line-height: 1.4;
        }

        .playbook-v2__accordion-chevron {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.35);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          margin-top: 0.2rem;
        }

        .playbook-v2__accordion-chevron.open {
          transform: rotate(180deg);
          color: #D4AF37;
        }

        .playbook-v2__accordion-body {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), padding 0.3s ease;
          padding: 0 1.5rem;
        }

        .playbook-v2__accordion-body.open {
          max-height: 600px;
          padding: 0 1.5rem 1.5rem;
        }

        .playbook-v2__strategy-text {
          font-size: 0.92rem;
          color: rgba(255,255,255,0.7);
          line-height: 1.65;
          margin: 0 0 1rem;
        }

        /* ── Coach Bubble ── */

        .playbook-v2__coach-bubble {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
          background: rgba(91, 164, 230, 0.08);
          border: 1px solid rgba(91, 164, 230, 0.2);
          border-radius: 12px;
          padding: 1rem 1.15rem;
          margin-bottom: 1rem;
        }

        .playbook-v2__coach-bubble p {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.65);
          margin: 0;
          line-height: 1.55;
          font-style: italic;
        }

        /* ── Pro Tip ── */

        .playbook-v2__pro-tip {
          display: flex;
          align-items: baseline;
          gap: 0.65rem;
          background: rgba(212, 175, 55, 0.06);
          border-radius: 8px;
          padding: 0.75rem 1rem;
        }

        .playbook-v2__pro-tip-label {
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: #D4AF37;
          white-space: nowrap;
        }

        .playbook-v2__pro-tip p {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.5);
          margin: 0;
          line-height: 1.5;
        }

        /* ── Split Layout (expanded) ── */

        .playbook-v2__split {
          display: flex;
          gap: 1.5rem;
        }

        .playbook-v2__nav {
          width: 40%;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          overflow-y: auto;
          max-height: 560px;
          padding-right: 0.5rem;
        }

        .playbook-v2__nav::-webkit-scrollbar {
          width: 3px;
        }

        .playbook-v2__nav::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
        }

        .playbook-v2__nav-item {
          padding: 1rem 1.25rem;
          border-left: 3px solid transparent;
          border-radius: 0 10px 10px 0;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          background: rgba(255,255,255,0.02);
        }

        .playbook-v2__nav-item:hover {
          background: rgba(255,255,255,0.04);
        }

        .playbook-v2__nav-item.active {
          border-left-color: #D4AF37;
          background: rgba(212, 175, 55, 0.06);
        }

        .playbook-v2__nav-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #f0f0f0;
          margin: 0 0 0.2rem;
          transition: color 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .playbook-v2__nav-item.active .playbook-v2__nav-title {
          color: #D4AF37;
        }

        .playbook-v2__nav-sub {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.35);
          margin: 0;
          line-height: 1.4;
        }

        .playbook-v2__detail {
          width: 60%;
          position: relative;
          min-height: 420px;
        }

        .playbook-v2__detail-inner {
          animation: playbookFadeSlide 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes playbookFadeSlide {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .playbook-v2__detail-card {
          padding: 2rem;
        }

        .playbook-v2__detail-eyebrow {
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #D4AF37;
          margin-bottom: 0.5rem;
        }

        .playbook-v2__detail-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: #f0f0f0;
          margin: 0 0 0.35rem;
        }

        .playbook-v2__detail-sub {
          font-size: 0.88rem;
          color: rgba(255,255,255,0.4);
          margin: 0 0 1.25rem;
        }

        .playbook-v2__detail-strategy {
          font-size: 0.95rem;
          color: rgba(255,255,255,0.75);
          line-height: 1.7;
          margin: 0 0 1.5rem;
        }

        .playbook-v2__detail .playbook-v2__coach-bubble {
          margin-bottom: 1.25rem;
        }

        .playbook-v2__detail .playbook-v2__pro-tip {
          margin-top: 0;
        }

        /* ── Progress dots ── */

        .playbook-v2__dots {
          display: flex;
          justify-content: center;
          gap: 6px;
          margin-top: 1.5rem;
        }

        .playbook-v2__dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .playbook-v2__dot.active {
          background: #D4AF37;
          transform: scale(1.4);
        }
      `}</style>

      <Reveal>
        <div className="playbook-v2__header">
          <p className="playbook-v2__eyebrow">SITUATION PLAYBOOK</p>
          <h2 className="playbook-v2__heading">
            Master <span className="text-gradient">any situation.</span>
          </h2>
          <p className="playbook-v2__sub">
            Every high-pressure scenario. A tested strategy. Tap to see your game plan.
          </p>
        </div>
      </Reveal>

      {useAccordion ? (
        <div className="playbook-v2__grid">
          {orderedScenarios.map((s, i) => (
            <Reveal key={s.title} delay={i * 60}>
              <AccordionCard
                scenario={s}
                isOpen={openAccordion === i}
                onClick={() => handleToggleAccordion(i)}
              />
            </Reveal>
          ))}
        </div>
      ) : (
        <Reveal>
          <div className="playbook-v2__split">
            <div className="playbook-v2__nav">
              {orderedScenarios.map((s, i) => (
                <div
                  key={s.title}
                  className={`playbook-v2__nav-item ${i === activeIndex ? 'active' : ''}`}
                  onClick={() => handleSelectScenario(i)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelectScenario(i) } }}
                >
                  <p className="playbook-v2__nav-title">{s.title}</p>
                  <p className="playbook-v2__nav-sub">{s.sub}</p>
                </div>
              ))}
            </div>

            <div className="playbook-v2__detail">
              <div className="playbook-v2__detail-inner" key={animKey}>
                <GlassCard className="playbook-v2__detail-card" glow="primary" hover={false}>
                  <p className="playbook-v2__detail-eyebrow">YOUR GAME PLAN</p>
                  <h3 className="playbook-v2__detail-title">{active.title}</h3>
                  <p className="playbook-v2__detail-sub">{active.sub}</p>
                  <p className="playbook-v2__detail-strategy">{active.strategy}</p>
                  <div className="playbook-v2__coach-bubble">
                    <CoachIcon />
                    <p>{active.coachSays}</p>
                  </div>
                  <div className="playbook-v2__pro-tip">
                    <span className="playbook-v2__pro-tip-label">PRO TIP</span>
                    <p>{active.proTip}</p>
                  </div>
                </GlassCard>
              </div>
              <div className="playbook-v2__dots">
                {orderedScenarios.map((_, i) => (
                  <div key={i} className={`playbook-v2__dot ${i === activeIndex ? 'active' : ''}`} />
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      )}
    </section>
  )
}
