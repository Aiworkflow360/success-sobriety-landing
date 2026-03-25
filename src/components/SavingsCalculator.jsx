import { useState, useEffect } from 'react'
import { useInView, Reveal, GlassCard } from '../components/shared'

export default function SavingsCalculator({ compact = false, initialSpend }) {
  const [weeklySpend, setWeeklySpend] = useState(initialSpend || 80)
  const [weeklyHours, setWeeklyHours] = useState(8)
  const [ref, inView] = useInView({ threshold: 0.15 })

  useEffect(() => {
    if (initialSpend != null) setWeeklySpend(initialSpend)
  }, [initialSpend])

  const yearlyMoney = weeklySpend * 52
  const yearlyHours = weeklyHours * 52
  const yearlyCalories = Math.round(weeklySpend / 5 * 180 * 52)
  const yearlyDays = Math.round(yearlyHours / 24)

  const Heading = compact ? 'h2' : 'h1'

  return (
    <section ref={ref} className={`calculator ${inView ? 'calculator-in' : ''}`} id="calculator">
      <div className="calculator-inner">
        <Reveal className="calculator-header">
          <span className="section-eyebrow">YOUR EDGE, QUANTIFIED</span>
          <Heading className="section-heading">
            What's sobriety<br />
            <span className="text-gradient">worth to you?</span>
          </Heading>
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
