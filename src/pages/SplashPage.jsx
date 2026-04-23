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
          <div style={eyebrow}>AI mediation for UK disputes under £100K</div>
          <h1 style={h1}>
            Two sides heard.<br />
            One realistic take.
          </h1>
          <p style={{ ...sub, marginBottom: '24px' }}>
            Courtless is a structured AI mediation protocol. Both parties submit independently, we read everything — your versions, your contracts, your correspondence — and produce a neutral joint brief grounded in real UK case law and game theory. The kind of reality check that actually ends disputes.
          </p>
          <p style={{
            fontSize: '14px', color: 'rgba(235, 235, 245, 0.55)',
            lineHeight: 1.55, maxWidth: '640px', marginBottom: '40px',
            fontStyle: 'italic',
          }}>
            Think Judge Judy — but mediative, not judgmental. With game theory and AI.
          </p>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={startAudit}
              onMouseEnter={() => setCtaHover(true)}
              onMouseLeave={() => setCtaHover(false)}
              style={primaryCtaStyle(ctaHover)}
            >
              Start a mediation — free
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
              'Dual intake · both sides heard',
              'Grounded in real UK case law',
              'Game-theoretic settlement bands',
              'Mediation, not legal advice',
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

      {/* HOW IT WORKS — dual intake mediation protocol */}
      <section style={section('#131314')}>
        <div style={inner}>
          <div style={eyebrow}>How it works</div>
          <h2 style={h2}>A structured mediation protocol. No mediator required.</h2>
          <p style={{ ...sub, marginBottom: '48px' }}>
            Courtless is a three-stage async mediation. Both sides submit independently, the AI reads everything, and a neutral synthesis lands with both of you. Same brief, same settlement band, same citations. The protocol does the work a mediator's billable hour would do.
          </p>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '14px',
          }}>
            <StepCard
              number="Stage 1 · Dual Intake"
              title="Both sides submit. Independently."
              body={
                <>
                  Party A initiates and submits their version plus evidence. The other party gets an invite link — they submit separately, in their own time, never seeing what A submitted.
                  <br /><br />
                  Contracts, emails, invoices, message threads, photos. Whatever you've got. The AI reads every document, pulls the dates, flags what's contested.
                </>
              }
            />
            <StepCard
              number="Stage 2 · Signal Extraction"
              title="The AI reads both sides against the same evidence."
              body={
                <>
                  Everything runs through a shared analysis: agreed facts, contested facts, evidence weight on each side, and what the actual paper trail supports.
                  <br /><br />
                  Case law comparables come from the National Archives — real UK judgments, real neutral citations. Game-theoretic model produces a BATNA/WATNA for each side.
                </>
              }
            />
            <StepCard
              number="Stage 3 · Mediated Output"
              title="Private briefs + one joint brief. Both sides get the same neutral take."
              body={
                <>
                  Each side gets a <em>private</em> brief — their own strongest and weakest points, honest and unshared.
                  <br /><br />
                  Then a <strong style={{ color: '#EBEBF5' }}>joint brief</strong> goes to both of you — word for word identical — with the case law, the settlement band, and a specific recommended next step. Neutral by construction. That's where disputes actually end.
                </>
              }
              accent="#0A84FF"
            />
          </div>

          <div style={{
            marginTop: '28px', padding: '16px 20px',
            backgroundColor: 'rgba(10, 132, 255, 0.06)',
            border: '1px solid rgba(10, 132, 255, 0.2)',
            borderRadius: '10px',
            fontSize: '13px', color: 'rgba(235, 235, 245, 0.72)', lineHeight: 1.6,
          }}>
            <strong style={{ color: '#EBEBF5' }}>If the other side declines or goes silent,</strong> we still deliver a one-sided audit for you — including a steelman of what they'd most likely argue. The joint brief is the unlock, but you're never stuck waiting on their consent to your own reality check.
          </div>
        </div>
      </section>

      {/* THE PROTOCOL — heritage + design principles */}
      <section style={section('transparent')}>
        <div style={inner}>
          <div style={eyebrow}>The protocol</div>
          <h2 style={h2}>Borrowed from couples therapy. Applied to disputes.</h2>
          <div style={{ ...paragraph, maxWidth: '760px', marginTop: '24px' }}>
            <p style={{ marginBottom: '16px' }}>
              The structure comes from evidence-based couples therapy. Gottman-method intake separates the partners: each answers the same structured questions independently, and the exchange history (texts, voicemails, emails) is read as behavioural data. A neutral synthesis is produced that's anchored in what <em>both</em> people said, not just the loudest.
            </p>
            <p style={{ marginBottom: '16px' }}>
              It turns out legal disputes have the same architecture. Two parties. Contested facts. A documentary trail of actual exchanges (contracts, emails, WhatsApps) that tells you what was agreed and when things went wrong. What's missing is the neutral analyst who reads both sides with the same cold eye.
            </p>
            <p style={{ marginBottom: '16px' }}>
              That's Courtless. Dual intake, signal extraction from the real paper trail, synthesis into briefs — private and shared. The case-law grounding and game-theory layer are the legal-specific additions. The mediation backbone is lifted from a model that's been working in clinical practice for three decades.
            </p>
            <p>
              And because it's asynchronous, neither party has to sit in the same room at the same time to get a read. Both of you submit in your own time. Both of you get the brief.
            </p>
          </div>
        </div>
      </section>

      {/* WHAT'S NEXT — async agentic mediation */}
      <section style={section('#131314')}>
        <div style={inner}>
          <div style={eyebrow}>What's coming next</div>
          <h2 style={h2}>Phase 2: Mediated dialogue.</h2>
          <p style={{ ...sub, marginBottom: '32px' }}>
            Today Courtless reads both sides and produces a brief. Phase 2 turns that into a live, structured exchange.
          </p>
          <div style={{ ...paragraph, maxWidth: '760px' }}>
            <p style={{ marginBottom: '16px' }}>
              One party makes a proposal. The AI frames it for the other side, probes their response, and surfaces where you're converging and where you're not. Multiple rounds toward agreement — at the pace that works for both of you, without a human mediator's hourly rate or the need to be in the same room.
            </p>
            <p style={{ marginBottom: '16px' }}>
              The protocol is the same. The AI stays neutral. It challenges weak positions on both sides, suggests compromises grounded in the case law, and moves the conversation toward a settlement that's realistic for the evidence at hand.
            </p>
            <p>
              Think of today's joint brief as round zero. Phase 2 is rounds one through however-many-it-takes.
            </p>
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
              Courtless sits in that gap, but not as a judge handing down verdicts. As a mediator. Both sides submit, separately. The AI reads what you've actually got — your versions, your contracts, the correspondence between you — and produces a neutral synthesis: where you agree, where you don't, what the case law says, and what a reasonable settlement would look like.
            </p>
            <p>
              It's the mediation you do <em>before</em> either side digs in. A real mediator charges £200-1000 an hour and needs both parties in the same room at the same time. Courtless runs asynchronously, costs nothing to start, and produces the same kind of neutral third-voice read. The point isn't enforcement. It's a shared, honest picture of what's actually reasonable — so you can stop paying to learn it.
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
            Start the mediation.<br />
            Before anyone lawyers up.
          </h2>
          <p style={{ ...sub, margin: '0 auto 36px', textAlign: 'center' }}>
            Free first mediation. Ten minutes to submit. Invite the other party when you're ready. Both of you get the brief when they engage.
          </p>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={startAudit}
              onMouseEnter={() => setFinalCtaHover(true)}
              onMouseLeave={() => setFinalCtaHover(false)}
              style={primaryCtaStyle(finalCtaHover)}
            >
              Start a mediation
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

const StepCard = ({ number, title, body, accent }) => (
  <div style={{
    backgroundColor: '#1A1A1C',
    border: `1px solid ${accent ? `${accent}40` : 'rgba(235, 235, 245, 0.06)'}`,
    borderRadius: '12px',
    padding: '28px 24px',
  }}>
    <div style={{
      fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.4px',
      color: accent || 'rgba(235, 235, 245, 0.4)',
      fontWeight: 700, marginBottom: '14px',
    }}>
      {number}
    </div>
    <div style={{
      fontFamily: serif, fontSize: '22px', fontWeight: 500,
      color: '#EBEBF5', marginBottom: '14px', letterSpacing: '-0.3px', lineHeight: 1.25,
    }}>
      {title}
    </div>
    <div style={{ fontSize: '14px', color: 'rgba(235, 235, 245, 0.72)', lineHeight: 1.65 }}>
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
