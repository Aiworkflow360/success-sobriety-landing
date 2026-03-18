import { useState, useEffect, useRef, useCallback } from 'react'
import { Reveal, GlassCard } from '../components/shared'
import logoMark from '../assets/logo-mark.png'

/* ━━━ PODCAST PLAYER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function PodcastPlayer() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const toggle = useCallback(() => {
    const a = audioRef.current
    if (!a) return
    if (playing) { a.pause() } else { a.play() }
    setPlaying(!playing)
  }, [playing])

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const handleTimeUpdate = useCallback(() => {
    const a = audioRef.current
    if (!a || !a.duration) return
    setProgress((a.currentTime / a.duration) * 100)
    setCurrentTime(a.currentTime)
  }, [])

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) setDuration(audioRef.current.duration)
  }, [])

  const handleSeek = useCallback((e) => {
    const a = audioRef.current
    if (!a || !a.duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    a.currentTime = x * a.duration
  }, [])

  const handleEnded = useCallback(() => setPlaying(false), [])

  return (
    <section className="podcast" id="podcast">
      <div className="podcast-inner">
        <Reveal className="podcast-header">
          <span className="section-eyebrow">LISTEN</span>
          <h1 className="section-heading" style={{ textAlign: 'center' }}>
            The Sober <span className="text-gradient">Edge.</span>
          </h1>
          <p className="section-sub" style={{ textAlign: 'center', margin: '0 auto' }}>
            A deep dive into why the sharpest executives are making sobriety their competitive advantage.
          </p>
        </Reveal>

        <Reveal delay={200}>
          <div className="podcast-card-wrap">
            <GlassCard className="podcast-card" hover={false} glow="primary">
              <audio
                ref={audioRef}
                src="/podcast.mp3"
                preload="metadata"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
              />

              <div className="podcast-top">
                <div className="podcast-artwork">
                  <div className="podcast-artwork-inner">
                    <div className={`podcast-pulse ${playing ? 'podcast-pulse-active' : ''}`} />
                    <img src={logoMark} alt="S&S" className="podcast-logo" />
                  </div>
                </div>
                <div className="podcast-meta">
                  <span className="podcast-label">PODCAST</span>
                  <h3 className="podcast-title">The Competitive Advantage of the Sober Executive</h3>
                  <span className="podcast-subtitle">Success & Sobriety</span>
                </div>
              </div>

              <div className="podcast-progress" onClick={handleSeek}>
                <div className="podcast-progress-track">
                  <div className="podcast-progress-fill" style={{ width: `${progress}%` }} />
                  <div className="podcast-progress-thumb" style={{ left: `${progress}%` }} />
                </div>
                <div className="podcast-times">
                  <span>{formatTime(currentTime)}</span>
                  <span>{duration ? formatTime(duration) : '--:--'}</span>
                </div>
              </div>

              <div className="podcast-controls">
                <button className="podcast-skip" onClick={() => { if (audioRef.current) audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 30) }} aria-label="Rewind 30s">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10a6 6 0 1112 0 6 6 0 01-12 0z" stroke="currentColor" strokeWidth="1.3"/><path d="M10 4V1L7 4l3 3V4z" fill="currentColor"/><text x="10" y="12" textAnchor="middle" fontSize="6" fill="currentColor" fontWeight="600">30</text></svg>
                </button>

                <button className={`podcast-play ${playing ? 'podcast-playing' : ''}`} onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
                  {playing ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l14 8-14 8V4z"/></svg>
                  )}
                </button>

                <button className="podcast-skip" onClick={() => { if (audioRef.current) audioRef.current.currentTime = Math.min(audioRef.current.duration || 0, audioRef.current.currentTime + 30) }} aria-label="Forward 30s">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M16 10a6 6 0 11-12 0 6 6 0 0112 0z" stroke="currentColor" strokeWidth="1.3"/><path d="M10 4V1l3 3-3 3V4z" fill="currentColor"/><text x="10" y="12" textAnchor="middle" fontSize="6" fill="currentColor" fontWeight="600">30</text></svg>
                </button>
              </div>
            </GlassCard>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ━━━ DAILY QUOTES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function DailyQuotes() {
  const quotes = [
    { text: "Discipline equals freedom.", author: "Jocko Willink", role: "Navy SEAL Commander" },
    { text: "You are what you do, not what you say you'll do.", author: "Carl Jung", role: "Psychologist" },
    { text: "The impediment to action advances action. What stands in the way becomes the way.", author: "Marcus Aurelius", role: "Roman Emperor" },
    { text: "You don't rise to the level of your goals. You fall to the level of your systems.", author: "James Clear", role: "Author, Atomic Habits" },
    { text: "Who you are is defined by what you're willing to struggle for.", author: "Mark Manson", role: "Author" },
    { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson", role: "Philosopher" },
    { text: "It's not about being the best. It's about being better than you were yesterday.", author: "David Goggins", role: "Ultra-endurance Athlete" },
    { text: "First say to yourself what you would be; and then do what you have to do.", author: "Epictetus", role: "Stoic Philosopher" },
    { text: "A man who conquers himself is greater than one who conquers a thousand men in battle.", author: "Buddha", role: "Spiritual Teacher" },
    { text: "The secret of change is to focus all of your energy not on fighting the old, but on building the new.", author: "Socrates", role: "Philosopher" },
    { text: "Strength does not come from winning. Your struggles develop your strengths.", author: "Arnold Schwarzenegger", role: "Actor & Governor" },
    { text: "We suffer more often in imagination than in reality.", author: "Seneca", role: "Stoic Philosopher" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", role: "Prime Minister" },
    { text: "The man who moves a mountain begins by carrying away small stones.", author: "Confucius", role: "Philosopher" },
    { text: "Every action you take is a vote for the type of person you wish to become.", author: "James Clear", role: "Author, Atomic Habits" },
  ]

  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % quotes.length)
    }, 12000)
    return () => clearInterval(interval)
  }, [])

  const q = quotes[current]

  return (
    <section className="quotes" id="quotes">
      <div className="quotes-inner">
        <Reveal className="quotes-header">
          <span className="section-eyebrow">DAILY FUEL</span>
          <h2 className="section-heading" style={{ textAlign: 'center' }}>
            Words that <span className="text-gradient">forge willpower.</span>
          </h2>
        </Reveal>

        <div className="quotes-card-wrap">
          <GlassCard className="quotes-card" hover={false} glow="accent">
            <div className="quotes-mark">&ldquo;</div>
            <p className="quotes-text" key={current}>{q.text}</p>
            <div className="quotes-attribution">
              <span className="quotes-author">{q.author}</span>
              <span className="quotes-role">{q.role}</span>
            </div>
            <div className="quotes-nav">
              {quotes.map((_, i) => (
                <button
                  key={i}
                  className={`quotes-dot ${i === current ? 'quotes-dot-active' : ''}`}
                  onClick={() => setCurrent(i)}
                  aria-label={`Quote ${i + 1}`}
                />
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}

/* ━━━ PODCAST PAGE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function PodcastPage() {
  useEffect(() => { document.title = 'Podcast — Success & Sobriety' }, [])

  return (
    <>
      <PodcastPlayer />
      <DailyQuotes />
    </>
  )
}
