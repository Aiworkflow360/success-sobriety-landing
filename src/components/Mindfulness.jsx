import { useState } from 'react'
import { Reveal, GlassCard } from './shared'

const techniques = [
  {
    title: 'Box Breathing',
    desc: '4-4-4-4 protocol used by Navy SEALs to maintain focus under pressure. 5 minutes reduces cortisol by up to 32%. Used by 73% of elite military trainees.',
    stat: '32%',
    statLabel: 'cortisol reduction',
    durations: ['2 min', '5 min'],
    icon: 'mindful-icon-breath',
  },
  {
    title: 'Urge Surfing',
    desc: 'Observe cravings as temporary waves, not commands. Ride them out without reacting. JAMA research: 54% fewer relapse days.',
    stat: '54%',
    statLabel: 'fewer relapse days',
    durations: ['5 min', '10 min'],
    icon: 'mindful-icon-wave',
  },
  {
    title: 'Pre-Event Focus',
    desc: 'Scenario-specific sessions before client dinners, networking events, or flights. Heart rate drops. Focus sharpens. You walk in ready.',
    stat: '15',
    statLabel: 'min to peak calm',
    durations: ['5 min', '10 min'],
    icon: 'mindful-icon-focus',
  },
  {
    title: 'Sleep Protocol',
    desc: 'Body scan + breathwork designed for deep recovery. Fall asleep faster, stay asleep longer. Sharp every morning.',
    stat: '20%',
    statLabel: 'better sleep quality',
    durations: ['10 min', '20 min'],
    icon: 'mindful-icon-sleep',
  },
]

export default function Mindfulness() {
  const [active, setActive] = useState(0)

  return (
    <section className="mindfulness" id="mindfulness">
      <div className="mindfulness-inner">
        <Reveal className="mindfulness-header">
          <span className="section-eyebrow">TRAIN YOUR MIND</span>
          <h2 className="section-heading">
            Master your mind.<br />
            <span className="text-gradient">Master your cravings.</span>
          </h2>
          <p className="section-sub">
            Not a meditation app. Not a spiritual retreat. Tactical breathwork and cognitive tools
            used by Navy SEALs and elite performers — applied to sobriety.
          </p>
        </Reveal>

        <div className="mindful-grid">
          {techniques.map((t, i) => (
            <Reveal key={i} delay={i * 80}>
              <div
                className={`mindful-card-wrap ${active === i ? 'mindful-active' : ''}`}
                onClick={() => setActive(i)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive(i) } }}
                role="button"
                tabIndex={0}
                aria-pressed={active === i}
              >
                <GlassCard className="mindful-card" hover={active !== i} glow={active === i ? 'primary' : undefined}>
                  <span className={`mindful-icon ${t.icon}`} />
                  <h4 className="mindful-title">{t.title}</h4>
                  <p className="mindful-desc">{t.desc}</p>
                  <div className="mindful-meta">
                    <div className="mindful-stat">
                      <span className="mindful-stat-num">{t.stat}</span>
                      <span className="mindful-stat-label">{t.statLabel}</span>
                    </div>
                    <div className="mindful-durations">
                      {t.durations.map((d, j) => (
                        <span key={j} className="mindful-duration-tag">{d}</span>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={300}>
          <div className="mindful-sources">
            <span className="mindful-source-label">Based on peer-reviewed research from</span>
            <span className="mindful-source-names">JAMA Psychiatry, Stanford Medicine, Nature Scientific Reports</span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
