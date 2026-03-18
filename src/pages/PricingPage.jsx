import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Reveal, GlassCard, Waitlist } from '../components/shared'

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
      features: ['Everything in Free', 'AI Sober Coach', 'Situation Playbook', 'Full debrief history', 'Advanced stats + trends', 'Health recovery timeline'],
    },
    {
      name: 'Sober Support',
      price: '150',
      period: '/month',
      annual: '1,440',
      annualSave: '20%',
      badge: 'COMING SOON',
      features: ['Everything in Premium', '2\u00d7 1-hour sessions per month', 'Matched with a professional sober coach', 'AI briefing pack before every session', 'Priority support'],
    },
  ]

  return (
    <section className="pricing" id="pricing">
      <div className="pricing-inner">
        <Reveal>
          <span className="section-eyebrow">PRICING</span>
          <h1 className="section-heading">
            Less than <span className="text-gradient">one double whiskey.</span>
          </h1>
          <p className="section-sub">That's it. Less than a single double whiskey a month. 30 days free. No credit card required.</p>
        </Reveal>

        <div className="pricing-grid">
          {tiers.map((tier, i) => (
            <Reveal key={i} delay={i * 100}>
              <div className={tier.badge ? 'pricing-card-badge-wrap' : undefined} style={{ height: '100%' }}>
                {tier.badge && <span className="pricing-badge-tag">{tier.badge}</span>}
                <GlassCard className={`pricing-card ${tier.featured ? 'pricing-featured gradient-border' : ''}`} hover={false}>
                  {tier.featured && <div className="pricing-glow" />}
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
                  {tier.featured ? (
                    <a href="#waitlist" className="btn btn-primary btn-full">Start Free Trial</a>
                  ) : (
                    <a href="#waitlist" className="btn btn-glass btn-full">Join Waitlist</a>
                  )}
                </GlassCard>
              </div>
            </Reveal>
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
    { q: 'How is the AI Coach different from ChatGPT?', a: 'Our coach reads your journal entries, knows your calendar, tracks your daily goals, and understands your recovery stats. It\'s purpose-built for sobriety in professional contexts — it spots upcoming triggers in your schedule and prepares you in advance. Hardcoded to never suggest moderation.' },
    { q: 'What happens if I relapse?', a: 'You reset your counter and keep going. No judgement. No shame. Your historical data, savings calculations, and milestones are preserved. The app is designed to support long-term commitment, not perfection.' },
    { q: 'Can I cancel anytime?', a: 'Yes. No contracts, no lock-in. Cancel through the App Store or Google Play at any time. Your data is yours and can be exported or deleted permanently.' },
    { q: 'Is the £9.99/month price going up?', a: 'Yes. Founding members lock in £9.99/month forever. Post-launch, the price increases to £14.99/month. First 500 members get founding pricing. Pay annually and save 20%. Less than a single round of drinks.' },
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
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(open === i ? null : i) } }}
                role="button"
                tabIndex={0}
                aria-expanded={open === i}
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

/* ━━━ ADDITIONAL SUPPORT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function Support() {
  const resources = [
    {
      name: 'Alcoholics Anonymous UK',
      desc: 'The original fellowship. Meetings nationwide, 24/7 helpline.',
      url: 'https://www.alcoholics-anonymous.org.uk',
      tag: 'MEETINGS',
    },
    {
      name: 'AA Meeting Finder',
      desc: 'Find your nearest AA meeting — in-person or online, any time.',
      url: 'https://www.alcoholics-anonymous.org.uk/AA-Meetings/Find-a-Meeting',
      tag: 'FIND A MEETING',
    },
    {
      name: 'SMART Recovery UK',
      desc: 'Science-based mutual support. Tools and techniques for self-empowerment.',
      url: 'https://smartrecovery.org.uk',
      tag: 'SCIENCE-BASED',
    },
    {
      name: 'Drinkline',
      desc: 'Free, confidential helpline. Call 0300 123 1110. Weekdays 9am-8pm, weekends 11am-4pm.',
      url: 'tel:03001231110',
      tag: 'FREE HELPLINE',
    },
    {
      name: 'Al-Anon UK',
      desc: 'Support for families and friends affected by someone else\'s drinking.',
      url: 'https://www.al-anonuk.org.uk',
      tag: 'FOR FAMILIES',
    },
    {
      name: 'NHS Alcohol Support',
      desc: 'NHS guidance, local services, and treatment options. Always free.',
      url: 'https://www.nhs.uk/live-well/alcohol-advice/',
      tag: 'NHS',
    },
  ]

  return (
    <section className="support" id="support">
      <div className="support-inner">
        <Reveal className="support-header">
          <span className="section-eyebrow">YOU'RE NOT ALONE</span>
          <h2 className="section-heading" style={{ textAlign: 'center' }}>
            Additional <span className="text-gradient">support.</span>
          </h2>
          <p className="section-sub" style={{ textAlign: 'center', margin: '0 auto' }}>
            An app is a tool. Sometimes you need people too. These organisations are trusted, free, and confidential.
          </p>
        </Reveal>

        <div className="support-grid">
          {resources.map((r, i) => (
            <Reveal key={i} delay={i * 80}>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="support-link-anchor"
              >
                <GlassCard className="support-card gradient-border">
                  <div className="support-card-top">
                    <span className="support-tag">{r.tag}</span>
                  </div>
                  <h4 className="support-name">{r.name}</h4>
                  <p className="support-desc">{r.desc}</p>
                  <div className="support-arrow-row">
                    <span className="support-cta">Visit</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </GlassCard>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ━━━ PRICING PAGE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function PricingPage() {
  useEffect(() => { document.title = 'Pricing — Success & Sobriety' }, [])

  return (
    <>
      <Pricing />
      <FAQ />
      <Support />
      <Waitlist />
    </>
  )
}
