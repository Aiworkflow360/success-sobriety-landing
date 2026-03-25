import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = 'Privacy Policy — Success & Sobriety'
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
    <main className="legal-page">
      <div className="legal-inner">
        <Link to="/" className="legal-back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to Home
        </Link>
        <h1 className="legal-title">Privacy Policy</h1>
        <p className="legal-updated">Last updated: 19 March 2026</p>

        <section className="legal-section">
          <h2>1. Who We Are</h2>
          <p>
            Success & Sobriety ("S&S", "we", "us", "our") is operated by S&S Ltd, registered in England and Wales.
            We provide a mobile application and website designed to support individuals in their sobriety journey.
          </p>
          <p>
            <strong>Contact:</strong> privacy@successandsobriety.com
          </p>
        </section>

        <section className="legal-section">
          <h2>2. What Data We Collect</h2>
          <h3>Account Data</h3>
          <ul>
            <li>Email address (for authentication)</li>
            <li>Display name (optional)</li>
            <li>Sobriety start date</li>
          </ul>

          <h3>Usage Data</h3>
          <ul>
            <li>Daily debrief entries (mood, energy, productivity ratings and journal notes)</li>
            <li>Daily protocol completion records</li>
            <li>Milestone achievements</li>
            <li>AI coach conversation history (stored locally on your device)</li>
          </ul>

          <h3>Profile Data</h3>
          <ul>
            <li>Weekly alcohol spending estimate (used to calculate savings)</li>
            <li>Weekly drinking hours estimate (used to calculate time reclaimed)</li>
            <li>Weekly calorie intake estimate (used to calculate health impact)</li>
          </ul>

          <h3>Technical Data</h3>
          <ul>
            <li>Device type and operating system</li>
            <li>App version</li>
            <li>Crash reports (anonymised)</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>3. How We Use Your Data</h2>
          <ul>
            <li><strong>Service delivery:</strong> To provide personalised sobriety tracking, AI coaching, and recovery insights</li>
            <li><strong>Improvement:</strong> To improve app features and user experience (using anonymised, aggregated data only)</li>
            <li><strong>Communication:</strong> To send push notifications you have opted into (morning motivation, evening debrief reminders, milestone celebrations)</li>
            <li><strong>Security:</strong> To protect your account and prevent fraud</li>
          </ul>
          <p>We <strong>never</strong> sell, rent, or share your personal data with third parties for marketing purposes.</p>
        </section>

        <section className="legal-section">
          <h2>4. AI Coach Privacy</h2>
          <p>
            Your AI coach conversations are processed by our AI provider (Anthropic / OpenRouter) to generate responses.
            Conversations are <strong>not stored on our servers</strong> beyond the active session.
            The AI provider does not use your conversations for training purposes.
          </p>
          <p>
            Context provided to the AI coach (your name, days sober, money saved, milestone data) is sent only when you actively use the coach feature.
          </p>
        </section>

        <section className="legal-section">
          <h2>5. Data Storage & Security</h2>
          <ul>
            <li>Data is stored on Supabase (hosted on AWS in the EU region)</li>
            <li>All data is encrypted in transit (TLS 1.3) and at rest (AES-256)</li>
            <li>Row-level security ensures you can only access your own data</li>
            <li>Face ID / biometric authentication available for additional protection</li>
            <li>We conduct regular security audits</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>6. Your Rights (UK GDPR)</h2>
          <p>Under UK data protection law, you have the right to:</p>
          <ul>
            <li><strong>Access</strong> your personal data</li>
            <li><strong>Correct</strong> inaccurate data</li>
            <li><strong>Delete</strong> your data ("right to be forgotten")</li>
            <li><strong>Export</strong> your data in a portable format</li>
            <li><strong>Object</strong> to processing</li>
            <li><strong>Restrict</strong> processing</li>
          </ul>
          <p>To exercise any of these rights, email <strong>privacy@successandsobriety.com</strong>.</p>
        </section>

        <section className="legal-section">
          <h2>7. Data Retention</h2>
          <p>
            We retain your data for as long as your account is active. If you delete your account, all personal data
            is permanently removed within 30 days. Anonymised, aggregated data may be retained for service improvement.
          </p>
        </section>

        <section className="legal-section">
          <h2>8. Third-Party Services</h2>
          <ul>
            <li><strong>Supabase:</strong> Database and authentication (EU-hosted)</li>
            <li><strong>OpenRouter / Anthropic:</strong> AI coach responses</li>
            <li><strong>Expo:</strong> Push notification delivery</li>
            <li><strong>Vercel:</strong> Website hosting</li>
          </ul>
          <p>We do not use any advertising SDKs, social media trackers, or analytics tools that share data with third parties.</p>
        </section>

        <section className="legal-section">
          <h2>9. Children's Privacy</h2>
          <p>
            Our service is intended for users aged 18 and over. We do not knowingly collect data from anyone under 18.
          </p>
        </section>

        <section className="legal-section">
          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. We will notify you of significant changes via the app or email.
            The "last updated" date at the top of this page reflects the most recent revision.
          </p>
        </section>

        <section className="legal-section">
          <h2>11. Contact</h2>
          <p>
            For any privacy-related questions or concerns:<br />
            <strong>Email:</strong> privacy@successandsobriety.com<br />
            <strong>Address:</strong> S&S Ltd, United Kingdom
          </p>
          <p>
            You also have the right to lodge a complaint with the Information Commissioner's Office (ICO) at <strong>ico.org.uk</strong>.
          </p>
        </section>
      </div>
    </main>
    </>
  )
}
