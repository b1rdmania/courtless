import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const fontFamily = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const serif = 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif';

const bodyStyle = {
  backgroundColor: '#0F0F10',
  color: '#EBEBF5',
  fontFamily,
  fontSize: '15px',
  lineHeight: 1.6,
  width: '100vw',
  minHeight: '100vh',
  overflowX: 'hidden',
  WebkitFontSmoothing: 'antialiased',
};

const topBar = {
  position: 'sticky', top: 0, zIndex: 20,
  backgroundColor: 'rgba(15, 15, 16, 0.85)',
  backdropFilter: 'blur(12px)',
  borderBottom: '1px solid rgba(235, 235, 245, 0.06)',
  padding: 'clamp(14px, 2vw, 18px) clamp(20px, 4vw, 40px)',
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
};

const section = (bg = 'transparent', pad = 'clamp(64px, 9vw, 100px) clamp(20px, 4vw, 40px)') => ({
  padding: pad,
  backgroundColor: bg,
  borderBottom: '1px solid rgba(235, 235, 245, 0.06)',
});

const inner = { maxWidth: '1100px', margin: '0 auto' };

const eyebrow = {
  fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.8px',
  color: 'rgba(235, 235, 245, 0.4)', fontWeight: 600, marginBottom: '16px',
};

const h1 = {
  fontFamily: serif,
  fontSize: 'clamp(36px, 6vw, 64px)',
  fontWeight: 500,
  lineHeight: 1.1,
  letterSpacing: '-1.2px',
  color: '#EBEBF5',
  marginBottom: '24px',
};

const h2 = {
  fontFamily: serif,
  fontSize: 'clamp(26px, 4vw, 40px)',
  fontWeight: 500,
  lineHeight: 1.2,
  letterSpacing: '-0.8px',
  color: '#EBEBF5',
  marginBottom: '16px',
};

const sub = {
  fontSize: 'clamp(15px, 1.4vw, 17px)',
  color: 'rgba(235, 235, 245, 0.7)',
  lineHeight: 1.6,
  maxWidth: '680px',
};

const paragraph = {
  fontSize: '15px',
  color: 'rgba(235, 235, 245, 0.68)',
  lineHeight: 1.75,
};

const Wordmark = ({ size = 15 }) => (
  <div style={{
    fontWeight: 700, letterSpacing: '-0.3px', color: '#EBEBF5', fontSize: `${size}px`,
    display: 'inline-flex', alignItems: 'baseline', gap: '10px',
  }}>
    COURTLESS
    <span style={{ color: 'rgba(235, 235, 245, 0.5)', fontWeight: 400, fontSize: `${size - 2}px`, letterSpacing: '0.2px' }}>
      Disputes Without Courts
    </span>
  </div>
);

const SplashPage = () => {
  const navigate = useNavigate();
  const [ctaHover, setCtaHover] = useState(false);
  const [topCtaHover, setTopCtaHover] = useState(false);
  const [finalCtaHover, setFinalCtaHover] = useState(false);

  const startAudit = () => navigate('/start');
  const seeDemo = () => navigate('/demo');

  const primaryCtaStyle = (hovered) => ({
    display: 'inline-flex', alignItems: 'center', gap: '10px',
    backgroundColor: hovered ? '#0077e6' : '#0A84FF',
    color: 'white',
    border: 'none',
    padding: '14px 28px',
    borderRadius: '8px',
    fontSize: '14px', fontWeight: 600,
    cursor: 'pointer',
    fontFamily,
    transition: 'all 0.15s ease',
    transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
    boxShadow: hovered ? '0 8px 24px rgba(10, 132, 255, 0.3)' : '0 2px 8px rgba(10, 132, 255, 0.15)',
  });

  const ghostCtaStyle = (hovered) => ({
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    backgroundColor: hovered ? 'rgba(235, 235, 245, 0.08)' : 'transparent',
    color: '#EBEBF5',
    border: '1px solid rgba(235, 235, 245, 0.15)',
    padding: '9px 18px',
    borderRadius: '6px',
    fontSize: '12px', fontWeight: 500,
    cursor: 'pointer', fontFamily,
    transition: 'all 0.15s ease',
  });

  return (
    <div style={bodyStyle}>
      {/* Top bar */}
      <div style={topBar}>
        <Wordmark />
        <button
          onClick={startAudit}
          onMouseEnter={() => setTopCtaHover(true)}
          onMouseLeave={() => setTopCtaHover(false)}
          style={ghostCtaStyle(topCtaHover)}
        >
          Start audit →
        </button>
      </div>

      {/* HERO */}
      <section style={section('transparent', 'clamp(64px, 10vh, 120px) clamp(20px, 4vw, 40px)')}>
        <div style={inner}>
          <div style={eyebrow}>Disputes Without Courts</div>
          <h1 style={h1}>
            The reality check on your dispute.<br />
            Before the lawyers get involved.
          </h1>
          <p style={{ ...sub, marginBottom: '40px' }}>
            Courtless is a neutral AI audit for disputes under £100K. Both sides' evidence, real case law, likely outcomes, realistic settlement ranges — in a single brief.
          </p>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={startAudit}
              onMouseEnter={() => setCtaHover(true)}
              onMouseLeave={() => setCtaHover(false)}
              style={primaryCtaStyle(ctaHover)}
            >
              Start your audit — free
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
            <button
              onClick={seeDemo}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: 'none', border: 'none', color: 'rgba(235, 235, 245, 0.85)',
                padding: '10px 8px', fontSize: '13px', fontWeight: 500,
                cursor: 'pointer', fontFamily, textDecoration: 'underline',
                textDecorationColor: 'rgba(235, 235, 245, 0.25)', textUnderlineOffset: '4px',
              }}
            >
              See a demo brief →
            </button>
            <div style={{ fontSize: '12px', color: 'rgba(235, 235, 245, 0.4)', marginLeft: '8px' }}>
              Free first audit · Takes 10 minutes · Not legal advice
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <div style={{ ...inner, marginTop: '72px', borderTop: '1px solid rgba(235, 235, 245, 0.06)', paddingTop: '28px' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px 40px', fontSize: '12px', color: 'rgba(235, 235, 245, 0.55)',
          }}>
            {[
              'Neutral by design',
              'Grounded in UK case law',
              'Game-theoretic settlement bands',
              'Not legal advice — a reality check',
            ].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#32D74B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT IT DOES — 3 columns */}
      <section style={section('#131314')}>
        <div style={inner}>
          <div style={eyebrow}>What it does</div>
          <h2 style={h2}>Three steps. About ten minutes.</h2>
          <p style={{ ...sub, marginBottom: '48px' }}>
            Most disputes never need a judge — they need a neutral pressure test. Courtless is built to give you that, fast.
          </p>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px',
          }}>
            <StepCard
              number="01"
              title="Tell us your side"
              body="Guided questions walk you through what happened. Upload contracts, emails, photos, invoices — drag-drop, keep it messy, we'll sort it. Takes about 10 minutes."
            />
            <StepCard
              number="02"
              title="We analyse"
              body="Your evidence is weighed against real UK case law. Game theory models the realistic range of outcomes. Both sides' likely arguments get mapped out."
            />
            <StepCard
              number="03"
              title="Get a realistic take"
              body="Your strongest and weakest points. What the other side would argue. Where your evidence is thin. A settlement band you can actually act on. A specific next step."
            />
          </div>
        </div>
      </section>

      {/* WHY THIS EXISTS */}
      <section style={section('transparent')}>
        <div style={inner}>
          <div style={eyebrow}>Why this exists</div>
          <h2 style={h2}>There's a gap between "shrug it off" and "hire a solicitor."</h2>

          <div style={{ ...paragraph, maxWidth: '760px', marginTop: '24px' }}>
            <p style={{ marginBottom: '16px' }}>
              If your deposit is £1,800 or a client owes you £6,000, a solicitor at £300-500 an hour is maths that doesn't work. You'll spend half the claim before you even have a letter drafted. Small claims court is meant to fix that for disputes under £10K, but it's still stressful, adversarial, and slow — and most people have no idea whether they'd actually win.
            </p>
            <p style={{ marginBottom: '16px' }}>
              Meanwhile, the other side is probably as unsure as you are. They think they're right. You think you're right. Nobody has read it back with a cold eye. And so things escalate — a WhatsApp goes unanswered, a formal letter gets sent, and suddenly everyone's paying for lawyers to say things everyone already knew.
            </p>
            <p style={{ marginBottom: '16px' }}>
              Courtless sits in that gap. We read what you've actually got — your side, their likely side, your evidence — and tell you straight: where you're strong, where you're exposed, what a reasonable settlement looks like, and whether this is worth fighting at all.
            </p>
            <p>
              It's the sanity check you do <em>before</em> you escalate, not after. Judge Judy doesn't have binding authority either — that's not the point. The point is a neutral voice telling both sides the truth so they can stop paying to learn it.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT'S DIFFERENT — 3 pillars */}
      <section style={section('#131314')}>
        <div style={inner}>
          <div style={eyebrow}>How it's different</div>
          <h2 style={h2}>Three things wired in from day one.</h2>

          <div style={{ display: 'grid', gap: '0px', marginTop: '40px' }}>
            <Pillar
              number="01"
              title="Neutral by design."
              body={
                <>
                  When both parties engage, you both get the same joint brief — word for word. The analysis is blind to who paid to initiate it. That symmetry is the whole point: a dispute settles when both sides trust the referee.
                  <br /><br />
                  Your private brief is yours alone — it'll tell you things the other side never sees. But the joint take that goes to both of you is identical.
                </>
              }
            />
            <Pillar
              number="02"
              title="Grounded in real case law."
              body={
                <>
                  Courtless reads 4,700+ UK judgments via The National Archives' Find Case Law API. When a precedent matters to your situation, we'll cite it with a real neutral citation — not a hallucinated one.
                  <br /><br />
                  England & Wales coverage at launch, including the Supreme Court. No invented authorities. If a claim can't be grounded in a real case, we say so.
                </>
              }
            />
            <Pillar
              number="03"
              title="Realistic, not hopeful."
              body={
                <>
                  We run a game-theory analysis on the combined picture — your BATNA (best alternative if you walk), your WATNA (worst realistic outcome), and the other side's equivalents. The output is a settlement band both sides could rationally accept.
                  <br /><br />
                  No false reassurance. If your case is weak, we'll say so — kindly. If the realistic take is "settle for forty pence on the pound," we'll tell you that too.
                </>
              }
            />
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section style={section('transparent')}>
        <div style={inner}>
          <div style={eyebrow}>What it's for</div>
          <h2 style={h2}>Built for the disputes that fall through the cracks.</h2>
          <p style={{ ...sub, marginBottom: '40px' }}>
            If you're looking at thousands of pounds in dispute and wondering whether it's worth the fight, this is the tool.
          </p>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '12px',
          }}>
            {[
              { name: 'Deposit disputes', blurb: 'Landlord withholding, tenant-side deductions, check-out reports.' },
              { name: 'Freelancer invoices & contracts', blurb: 'Unpaid work, scope creep, kill fees, late payment penalties.' },
              { name: 'Founder fall-outs', blurb: 'Equity splits, unvested founder shares, IP ownership, exits.' },
              { name: 'Workplace disagreements', blurb: 'Bonus disputes, constructive dismissal territory, settlement terms.' },
              { name: 'Supplier / service disputes', blurb: 'Botched work, missed SLAs, consultants who didn\'t deliver.' },
              { name: 'Consumer complaints', blurb: 'Retailers, builders, mechanics, anyone who took your money.' },
            ].map(u => (
              <UseCaseCard key={u.name} name={u.name} blurb={u.blurb} />
            ))}
          </div>

          {/* NOT for */}
          <div style={{
            marginTop: '40px', padding: '20px 24px',
            backgroundColor: 'rgba(255, 69, 58, 0.04)',
            border: '1px solid rgba(255, 69, 58, 0.15)',
            borderRadius: '10px',
          }}>
            <div style={{
              fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px',
              color: '#FF6B5C', fontWeight: 600, marginBottom: '10px',
            }}>
              Not designed for
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(235, 235, 245, 0.75)', lineHeight: 1.7 }}>
              Family law · Criminal matters · Personal injury · Anything above £100K in dispute.
              If you're in one of these, please talk to a qualified solicitor.
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ ...section('#131314', 'clamp(64px, 9vw, 100px) clamp(20px, 4vw, 40px) clamp(80px, 12vw, 140px)') }}>
        <div style={{ ...inner, textAlign: 'center' }}>
          <div style={eyebrow}>Ready?</div>
          <h2 style={{ ...h2, marginBottom: '20px' }}>
            Get the real take on your dispute —<br />before you spend £10K on lawyers.
          </h2>
          <p style={{ ...sub, margin: '0 auto 36px', textAlign: 'center' }}>
            Free first audit. Ten minutes. No sign-up hoops. A brief in your inbox at the end.
          </p>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={startAudit}
              onMouseEnter={() => setFinalCtaHover(true)}
              onMouseLeave={() => setFinalCtaHover(false)}
              style={primaryCtaStyle(finalCtaHover)}
            >
              Start your audit
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
            <button
              onClick={seeDemo}
              style={{
                background: 'none', border: 'none', color: 'rgba(235, 235, 245, 0.7)',
                fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily,
                textDecoration: 'underline', textDecorationColor: 'rgba(235, 235, 245, 0.25)',
                textUnderlineOffset: '4px',
              }}
            >
              Not ready? See a demo brief →
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '28px clamp(20px, 4vw, 40px)', borderTop: '1px solid rgba(235, 235, 245, 0.06)' }}>
        <div style={{
          ...inner,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '16px',
        }}>
          <div style={{ fontSize: '12px', color: 'rgba(235, 235, 245, 0.4)' }}>
            COURTLESS · Disputes Without Courts · UK only · Not legal advice
          </div>
          <div style={{ display: 'flex', gap: '24px', fontSize: '12px', color: 'rgba(235, 235, 245, 0.5)' }}>
            <a href="#terms" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</a>
            <a href="#privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</a>
            <a href="#about" style={{ color: 'inherit', textDecoration: 'none' }}>About</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- Sub-components ---

const StepCard = ({ number, title, body }) => (
  <div style={{
    backgroundColor: '#1A1A1C',
    border: '1px solid rgba(235, 235, 245, 0.06)',
    borderRadius: '12px',
    padding: '28px 24px',
  }}>
    <div style={{
      fontFamily: serif, fontSize: '22px', fontWeight: 400,
      color: 'rgba(235, 235, 245, 0.3)', letterSpacing: '-0.3px', marginBottom: '14px',
    }}>
      {number}
    </div>
    <div style={{
      fontFamily: serif, fontSize: '20px', fontWeight: 500,
      color: '#EBEBF5', marginBottom: '12px', letterSpacing: '-0.3px',
    }}>
      {title}
    </div>
    <div style={{ fontSize: '14px', color: 'rgba(235, 235, 245, 0.68)', lineHeight: 1.65 }}>
      {body}
    </div>
  </div>
);

const Pillar = ({ number, title, body }) => (
  <div style={{
    display: 'grid', gridTemplateColumns: '80px 1fr',
    gap: '24px',
    padding: '28px 0',
    borderTop: '1px solid rgba(235, 235, 245, 0.06)',
  }}>
    <div style={{
      fontFamily: serif, fontSize: '28px', fontWeight: 400,
      color: 'rgba(235, 235, 245, 0.3)', letterSpacing: '-0.3px',
    }}>
      {number}
    </div>
    <div>
      <div style={{
        fontFamily: serif, fontSize: '22px', fontWeight: 500, color: '#EBEBF5',
        marginBottom: '12px', letterSpacing: '-0.3px',
      }}>
        {title}
      </div>
      <div style={{ ...paragraph, maxWidth: '700px' }}>{body}</div>
    </div>
  </div>
);

const UseCaseCard = ({ name, blurb }) => (
  <div style={{
    backgroundColor: '#1A1A1C',
    border: '1px solid rgba(235, 235, 245, 0.06)',
    borderRadius: '10px',
    padding: '20px 22px',
  }}>
    <div style={{
      fontSize: '14px', fontWeight: 600, color: '#EBEBF5',
      marginBottom: '8px', letterSpacing: '-0.1px',
    }}>
      {name}
    </div>
    <div style={{ fontSize: '13px', color: 'rgba(235, 235, 245, 0.6)', lineHeight: 1.55 }}>
      {blurb}
    </div>
  </div>
);

export default SplashPage;
