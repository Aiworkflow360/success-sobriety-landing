import { useState } from 'react';
import { GlassCard, Reveal, supabase } from '../components/shared';

const STEPS = [
  {
    label: 'Step 01',
    heading: 'What best describes you?',
    type: 'single',
    options: [
      'I\'m sober-curious — thinking about cutting back',
      'I\'ve quit — I need tools to stay sharp',
      'I\'m reducing — not zero, but less',
    ],
  },
  {
    label: 'Step 02',
    heading: 'How much do you spend on alcohol per week?',
    type: 'single',
    options: ['Under £30', '£30–80', '£80–150', '£150+'],
    values: [20, 55, 115, 200],
  },
  {
    label: 'Step 03',
    heading: 'What situations are hardest?',
    subtitle: 'Pick up to 3',
    type: 'multi',
    max: 3,
    options: [
      'Client dinners',
      'Friday drinks',
      'Networking events',
      'Flights',
      'Stress/bad days',
      'Stag dos',
      'Boredom',
      'Peer pressure',
    ],
  },
  {
    label: 'Step 04',
    heading: 'What matters most to you?',
    type: 'single',
    options: ['Sharper performance', 'Save money', 'Better health', 'Better sleep'],
  },
];

export default function SobrietyQuiz({ onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSelect = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    if (step < 4) {
      setTimeout(() => setStep((s) => s + 1), 350);
    }
  };

  const handleMultiSelect = (option) => {
    const current = answers.triggers || [];
    if (current.includes(option)) {
      setAnswers((prev) => ({
        ...prev,
        triggers: current.filter((o) => o !== option),
      }));
    } else if (current.length < 3) {
      setAnswers((prev) => ({
        ...prev,
        triggers: [...current, option],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    setError('');

    try {
      const { error: dbError } = await supabase
        .from('waitlist')
        .insert({ email, quiz_data: JSON.stringify(answers) });

      if (dbError && dbError.code !== '23505') {
        throw dbError;
      }

      setSubmitted(true);
      onComplete?.(answers);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const annualSavings = (answers.weeklySpend || 0) * 52;
  const topTrigger = answers.triggers?.[0] || '—';
  const primaryGoal = answers.goal || '—';

  const renderStep = () => {
    if (step === 4) {
      return (
        <div className="quiz-result">
          <p className="section-eyebrow">Your results</p>
          <h3 className="section-heading">
            Your edge, <span className="text-gradient">calculated</span>
          </h3>

          <div className="quiz-stats">
            <div className="quiz-stat glass">
              <span className="quiz-stat-value">£{annualSavings.toLocaleString()}</span>
              <span className="quiz-stat-label">Estimated annual savings</span>
            </div>
            <div className="quiz-stat glass">
              <span className="quiz-stat-value">{topTrigger}</span>
              <span className="quiz-stat-label">Top trigger</span>
            </div>
            <div className="quiz-stat glass">
              <span className="quiz-stat-value">{primaryGoal}</span>
              <span className="quiz-stat-label">Primary goal</span>
            </div>
          </div>

          {!submitted ? (
            <form className="quiz-form" onSubmit={handleSubmit}>
              <input
                type="email"
                className="quiz-email"
                placeholder="Your best email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email address"
              />
              <button
                type="submit"
                className="btn-primary btn-lg quiz-cta"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Get My Plan →'}
              </button>
              {error && <p className="quiz-error">{error}</p>}
            </form>
          ) : (
            <div className="quiz-success">
              <p>You're in. Check your inbox.</p>
            </div>
          )}
        </div>
      );
    }

    const currentStep = STEPS[step];

    if (currentStep.type === 'multi') {
      const selected = answers.triggers || [];
      return (
        <div className="quiz-step">
          <p className="section-eyebrow">{currentStep.label}</p>
          <h3 className="section-heading">{currentStep.heading}</h3>
          {currentStep.subtitle && (
            <p className="quiz-subtitle">{currentStep.subtitle}</p>
          )}
          <div className="quiz-pills">
            {currentStep.options.map((option) => (
              <button
                key={option}
                className={`quiz-pill ${selected.includes(option) ? 'quiz-pill--selected' : ''}`}
                onClick={() => handleMultiSelect(option)}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
          <button
            className="btn-primary quiz-next"
            onClick={() => selected.length > 0 && setStep((s) => s + 1)}
            disabled={selected.length === 0}
            type="button"
          >
            Continue →
          </button>
        </div>
      );
    }

    return (
      <div className="quiz-step">
        <p className="section-eyebrow">{currentStep.label}</p>
        <h3 className="section-heading">{currentStep.heading}</h3>
        <div className={`quiz-options ${step === 0 ? 'quiz-options--large' : 'quiz-options--row'}`}>
          {currentStep.options.map((option, i) => {
            const handleClick = () => {
              if (step === 0) handleSelect('identity', option);
              else if (step === 1) handleSelect('weeklySpend', currentStep.values[i]);
              else if (step === 3) handleSelect('goal', option);
            };

            const isSelected =
              (step === 0 && answers.identity === option) ||
              (step === 1 && answers.weeklySpend === currentStep.values?.[i]) ||
              (step === 3 && answers.goal === option);

            return (
              <button
                key={option}
                className={`quiz-option glass ${isSelected ? 'quiz-option--selected' : ''}`}
                onClick={handleClick}
                type="button"
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Reveal>
      <style>{`
        .quiz {
          max-width: 720px;
          margin: 0 auto;
          padding: 3rem 1.5rem;
          position: relative;
        }

        .quiz-slide-wrapper {
          overflow: hidden;
          position: relative;
        }

        .quiz-slide {
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .quiz-step,
        .quiz-result {
          text-align: center;
        }

        .quiz-subtitle {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.875rem;
          margin-top: -0.5rem;
          margin-bottom: 1.5rem;
        }

        .quiz-options {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
          justify-content: center;
        }

        .quiz-options--large {
          flex-direction: column;
          align-items: center;
        }

        .quiz-options--row {
          flex-wrap: wrap;
        }

        .quiz-option {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 1.25rem 2rem;
          color: rgba(255, 255, 255, 0.8);
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          min-width: 180px;
          text-align: center;
          font-family: inherit;
        }

        .quiz-options--large .quiz-option {
          width: 100%;
          max-width: 480px;
          padding: 1.5rem 2rem;
          font-size: 1.05rem;
        }

        .quiz-option:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        .quiz-option--selected {
          border-color: #D4AF37;
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.15), inset 0 0 20px rgba(212, 175, 55, 0.05);
          color: #fff;
        }

        .quiz-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          justify-content: center;
          margin-top: 2rem;
        }

        .quiz-pill {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 100px;
          padding: 0.75rem 1.5rem;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          font-family: inherit;
        }

        .quiz-pill:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .quiz-pill--selected {
          border-color: #5BA4E6;
          box-shadow: 0 0 16px rgba(91, 164, 230, 0.25), inset 0 0 16px rgba(91, 164, 230, 0.06);
          color: #fff;
          background: rgba(91, 164, 230, 0.08);
        }

        .quiz-next {
          margin-top: 2rem;
          padding: 0.875rem 2.5rem;
          font-size: 1rem;
        }

        .quiz-next:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .quiz-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin: 2.5rem 0;
        }

        .quiz-stat {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .quiz-stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #D4AF37;
        }

        .quiz-stat-label {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.45);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .quiz-form {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          margin-top: 2rem;
        }

        .quiz-email {
          width: 100%;
          max-width: 400px;
          padding: 1rem 1.25rem;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.04);
          color: #fff;
          font-size: 1rem;
          font-family: inherit;
          outline: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .quiz-email:focus {
          border-color: #5BA4E6;
          box-shadow: 0 0 0 3px rgba(91, 164, 230, 0.15);
        }

        .quiz-email::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }

        .quiz-cta {
          width: 100%;
          max-width: 400px;
        }

        .quiz-error {
          color: #e57373;
          font-size: 0.875rem;
          margin: 0;
        }

        .quiz-success p {
          color: #D4AF37;
          font-size: 1.1rem;
          font-weight: 600;
          margin-top: 1.5rem;
        }

        .quiz-dots {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 2.5rem;
        }

        .quiz-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .quiz-dot--active {
          background: #D4AF37;
          box-shadow: 0 0 8px rgba(212, 175, 55, 0.4);
        }

        .quiz-dot--completed {
          background: rgba(212, 175, 55, 0.4);
        }

        @media (max-width: 640px) {
          .quiz-options--row {
            flex-direction: column;
            align-items: center;
          }

          .quiz-option {
            width: 100%;
          }

          .quiz-stats {
            grid-template-columns: 1fr;
          }

          .quiz-stat-value {
            font-size: 1.25rem;
          }

          .quiz-pills {
            gap: 0.5rem;
          }

          .quiz-pill {
            padding: 0.625rem 1.25rem;
            font-size: 0.85rem;
          }
        }
      `}</style>

      <section className="quiz" aria-label="Sobriety quiz">
        <div className="quiz-slide-wrapper">
          <div
            className="quiz-slide"
            key={step}
            style={{
              animation: 'quizSlideIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          >
            {renderStep()}
          </div>
        </div>

        <div className="quiz-dots" role="tablist" aria-label="Quiz progress">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`quiz-dot ${i === step ? 'quiz-dot--active' : ''} ${i < step ? 'quiz-dot--completed' : ''}`}
              role="tab"
              aria-selected={i === step}
              aria-label={`Step ${i + 1}`}
            />
          ))}
        </div>

        <style>{`
          @keyframes quizSlideIn {
            from {
              opacity: 0;
              transform: translateX(40px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}</style>
      </section>
    </Reveal>
  );
}
