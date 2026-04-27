import React from 'react';
import { useNavigate } from 'react-router-dom';
import { color, font, space, radius, t } from '../theme.js';
import {
  Container,
  Section,
  Eyebrow,
  Button,
  Card,
  Note,
  TopBar,
  Footer,
  ArrowRight,
  Check,
  useMediaQuery,
} from '../components/ui.jsx';

const SplashPage = () => {
  const navigate = useNavigate();
  const start = () => navigate('/start');
  const demo = () => navigate('/demo');
  const showSecondary = useMediaQuery('(min-width: 640px)');

  return (
    <main style={{ backgroundColor: color.canvas, color: color.ink, minHeight: '100vh' }}>
      <TopBar
        onWordmarkClick={() => navigate('/')}
        rightSlot={
          <>
            {showSecondary && (
              <Button variant="ghost" size="sm" onClick={demo}>See a demo brief</Button>
            )}
            <Button variant="primary" size="sm" iconRight onClick={start}>Start a mediation</Button>
          </>
        }
      />

      {/* HERO */}
      <section
        style={{
          padding: `clamp(${space[10]}, 12vh, ${space[13]}) 0 clamp(${space[10]}, 9vw, ${space[12]})`,
          borderBottom: `1px solid ${color.hairline}`,
          position: 'relative',
        }}
      >
        <Container max="1100px">
          <Eyebrow>AI mediation · UK disputes under £100K</Eyebrow>
          <h1 style={{ ...t.display, marginBottom: space[5], maxWidth: '15ch' }}>
            Two sides heard.<br />
            <span style={{ fontStyle: 'italic', color: color.accent }}>One realistic take.</span>
          </h1>
          <p style={{ ...t.lede, maxWidth: '38ch', marginBottom: space[6] }}>
            A structured AI mediation protocol. Both parties submit independently — we read your
            versions, your contracts, your correspondence — and produce a neutral joint brief
            grounded in real UK case law and game theory.
          </p>
          <p style={{ ...t.bodyMuted, maxWidth: '52ch', marginBottom: space[8], fontStyle: 'italic' }}>
            Think Judge Judy — but mediative, not judgmental. With game theory and AI.
          </p>
          <div style={{ display: 'flex', gap: space[3], alignItems: 'center', flexWrap: 'wrap' }}>
            <Button variant="primary" size="lg" iconRight onClick={start}>
              Start a mediation — free
            </Button>
            <Button variant="link" size="md" onClick={demo}>
              See a demo brief →
            </Button>
          </div>
          <div style={{ ...t.caption, marginTop: space[5] }}>
            Free first audit · Takes 10 minutes · Not legal advice
          </div>
        </Container>

        {/* Trust strip */}
        <Container max="1100px" style={{ marginTop: space[10] }}>
          <div
            style={{
              borderTop: `1px solid ${color.hairline}`,
              paddingTop: space[6],
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: `${space[3]} ${space[8]}`,
            }}
          >
            {[
              'Dual intake · both sides heard',
              'Grounded in real UK case law',
              'Game-theoretic settlement bands',
              'Mediation, not legal advice',
            ].map((label) => (
              <div
                key={label}
                style={{ display: 'flex', alignItems: 'center', gap: space[2], ...t.small, color: color.inkMuted }}
              >
                <Check />
                {label}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* HOW IT WORKS */}
      <Section alt>
        <Container max="1100px">
          <Eyebrow>How it works</Eyebrow>
          <h2 style={{ ...t.h1, marginBottom: space[4], maxWidth: '20ch' }}>
            A structured mediation protocol. No mediator required.
          </h2>
          <p style={{ ...t.bodyMuted, maxWidth: '60ch', marginBottom: space[8] }}>
            Three asynchronous stages. Both sides submit independently, the AI reads everything,
            and a neutral synthesis lands with both of you. Same brief, same settlement band, same citations.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: space[4],
            }}
          >
            <StepCard
              number="Stage 1"
              label="Dual Intake"
              title="Both sides submit. Independently."
            >
              Party A initiates and submits their version plus evidence. The other party gets an
              invite link — they submit separately, never seeing what A submitted. The AI reads
              every document, pulls dates, flags what's contested.
            </StepCard>
            <StepCard
              number="Stage 2"
              label="Signal Extraction"
              title="The AI reads both sides against the same evidence."
            >
              Agreed facts, contested facts, evidence weight on each side. Case law comparables
              come from the National Archives — real UK judgments, real neutral citations. Game
              theory produces a BATNA/WATNA for each side.
            </StepCard>
            <StepCard
              number="Stage 3"
              label="Mediated Output"
              title="Private briefs. One identical joint brief."
              accent={color.accent}
            >
              Each side gets a <em>private</em> brief — strongest and weakest points, honest and
              unshared. Then a joint brief goes to both — word for word identical — with case law,
              the settlement band, and a specific recommended next step.
            </StepCard>
          </div>

          <Note tone="accent" title="If the other side declines or goes silent" style={{ marginTop: space[6] }}>
            We still deliver a one-sided audit for you — including a steelman of what they'd most
            likely argue. The joint brief is the unlock, but you're never stuck waiting on their
            consent to your own reality check.
          </Note>
        </Container>
      </Section>

      {/* PROTOCOL HERITAGE */}
      <Section>
        <Container max="900px">
          <Eyebrow>The protocol</Eyebrow>
          <h2 style={{ ...t.h1, marginBottom: space[6] }}>
            Borrowed from couples therapy. <br />
            <span style={{ fontStyle: 'italic' }}>Applied to disputes.</span>
          </h2>
          <Prose>
            <p>
              The structure comes from evidence-based couples therapy. Gottman-method intake
              separates the partners: each answers the same structured questions independently,
              and the exchange history (texts, voicemails, emails) is read as behavioural data.
              A neutral synthesis is produced that's anchored in what <em>both</em> people said —
              not just the loudest.
            </p>
            <p>
              Legal disputes have the same architecture. Two parties. Contested facts.
              A documentary trail of actual exchanges (contracts, emails, WhatsApps) telling you
              what was agreed and when things went wrong. What's missing is the neutral analyst
              who reads both sides with the same cold eye.
            </p>
            <p>
              That's Courtless. Dual intake, signal extraction from the real paper trail, synthesis
              into private and shared briefs. The case-law grounding and game-theory layer are the
              legal-specific additions. The mediation backbone is lifted from a model that's been
              working in clinical practice for three decades.
            </p>
          </Prose>
        </Container>
      </Section>

      {/* WHY THIS EXISTS */}
      <Section alt>
        <Container max="900px">
          <Eyebrow>Why this exists</Eyebrow>
          <h2 style={{ ...t.h1, marginBottom: space[6], maxWidth: '22ch' }}>
            There's a gap between &ldquo;shrug it off&rdquo; and &ldquo;hire a solicitor.&rdquo;
          </h2>
          <Prose>
            <p>
              If your deposit is £1,800 or a client owes you £6,000, a solicitor at £300–500 an hour
              is maths that doesn't work. You'll spend half the claim before you have a letter
              drafted. Small claims court is meant to fix that for disputes under £10K, but it's
              still stressful, adversarial, slow — and most people have no idea whether they'd
              actually win.
            </p>
            <p>
              Meanwhile, the other side is probably as unsure as you are. They think they're right.
              You think you're right. Nobody has read it back with a cold eye. Things escalate —
              a WhatsApp goes unanswered, a formal letter gets sent, and suddenly everyone's paying
              for lawyers to say things everyone already knew.
            </p>
            <p>
              Courtless sits in that gap, but not as a judge handing down verdicts. As a mediator.
              Both sides submit, separately. The AI reads what you've actually got and produces a
              neutral synthesis: where you agree, where you don't, what the case law says, and what
              a reasonable settlement looks like.
            </p>
          </Prose>
        </Container>
      </Section>

      {/* THREE PILLARS */}
      <Section>
        <Container max="1080px">
          <Eyebrow>How it's different</Eyebrow>
          <h2 style={{ ...t.h1, marginBottom: space[8], maxWidth: '20ch' }}>
            Three things wired in from day one.
          </h2>

          <Pillar
            number="01"
            title="Neutral by design."
            body={
              <>
                When both parties engage, you both get the same joint brief — word for word.
                The analysis is blind to who paid to initiate it. That symmetry is the whole point:
                a dispute settles when both sides trust the referee.
                <br /><br />
                Your private brief is yours alone — it'll tell you things the other side never sees.
                But the joint take that goes to both of you is identical.
              </>
            }
          />
          <Pillar
            number="02"
            title="Grounded in real case law."
            body={
              <>
                Courtless reads 4,700+ UK judgments via The National Archives' Find Case Law API.
                When a precedent matters to your situation, we'll cite it with a real neutral citation —
                not a hallucinated one.
                <br /><br />
                England &amp; Wales coverage at launch, including the Supreme Court. No invented
                authorities. If a claim can't be grounded in a real case, we say so.
              </>
            }
          />
          <Pillar
            number="03"
            title="Realistic, not hopeful."
            body={
              <>
                We run a game-theory analysis on the combined picture — your BATNA, your WATNA,
                and the other side's equivalents. The output is a settlement band both sides could
                rationally accept.
                <br /><br />
                No false reassurance. If your case is weak, we'll say so — kindly. If the realistic
                take is &ldquo;settle for forty pence on the pound,&rdquo; we'll tell you that too.
              </>
            }
          />
        </Container>
      </Section>

      {/* USE CASES */}
      <Section alt>
        <Container max="1100px">
          <Eyebrow>What it's for</Eyebrow>
          <h2 style={{ ...t.h1, marginBottom: space[4], maxWidth: '22ch' }}>
            Built for the disputes that fall through the cracks.
          </h2>
          <p style={{ ...t.bodyMuted, maxWidth: '54ch', marginBottom: space[8] }}>
            If you're looking at thousands of pounds in dispute and wondering whether it's worth
            the fight, this is the tool.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: space[3],
            }}
          >
            {[
              { name: 'Deposit disputes', blurb: 'Landlord withholding, tenant-side deductions, check-out reports.' },
              { name: 'Freelancer invoices & contracts', blurb: 'Unpaid work, scope creep, kill fees, late payment penalties.' },
              { name: 'Founder fall-outs', blurb: 'Equity splits, unvested founder shares, IP ownership, exits.' },
              { name: 'Workplace disagreements', blurb: 'Bonus disputes, constructive dismissal territory, settlement terms.' },
              { name: 'Supplier / service disputes', blurb: "Botched work, missed SLAs, consultants who didn't deliver." },
              { name: 'Consumer complaints', blurb: 'Retailers, builders, mechanics, anyone who took your money.' },
            ].map((u) => (
              <UseCaseCard key={u.name} name={u.name} blurb={u.blurb} />
            ))}
          </div>

          <Note tone="danger" title="Not designed for" style={{ marginTop: space[7] }}>
            Family law · Criminal matters · Personal injury · Anything above £100K in dispute.
            If you're in one of these, please talk to a qualified solicitor.
          </Note>
        </Container>
      </Section>

      {/* FINAL CTA */}
      <Section>
        <Container max="780px" style={{ textAlign: 'center' }}>
          <Eyebrow style={{ justifyContent: 'center', display: 'inline-block' }}>Ready?</Eyebrow>
          <h2 style={{ ...t.h1, marginBottom: space[4] }}>
            Start the mediation.<br />
            <span style={{ fontStyle: 'italic' }}>Before anyone lawyers up.</span>
          </h2>
          <p style={{ ...t.bodyMuted, marginBottom: space[7] }}>
            Free first mediation. Ten minutes to submit. Invite the other party when you're ready.
            Both of you get the brief when they engage.
          </p>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: space[4] }}>
            <Button variant="primary" size="lg" iconRight onClick={start}>
              Start a mediation
            </Button>
            <Button variant="link" size="sm" onClick={demo}>
              Not ready? See a demo brief →
            </Button>
          </div>
        </Container>
      </Section>

      <Footer />
    </main>
  );
};

// ----- Splash sub-components -----

const StepCard = ({ number, label, title, children, accent }) => (
  <Card accent={accent}>
    <div style={{ ...t.eyebrow, color: accent || color.inkSubtle, marginBottom: space[3] }}>
      <span style={{ fontWeight: 700 }}>{number}</span>
      <span style={{ margin: `0 ${space[2]}`, color: color.hairlineStrong }}>·</span>
      <span>{label}</span>
    </div>
    <div style={{ ...t.h3, marginBottom: space[3] }}>{title}</div>
    <div style={{ ...t.bodyMuted, fontSize: '15px' }}>{children}</div>
  </Card>
);

const Pillar = ({ number, title, body }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '90px 1fr',
      gap: space[6],
      padding: `${space[7]} 0`,
      borderTop: `1px solid ${color.hairline}`,
    }}
  >
    <div
      style={{
        fontFamily: font.display,
        fontSize: '36px',
        fontWeight: 300,
        color: color.accent,
        letterSpacing: '-0.5px',
        lineHeight: 1,
      }}
    >
      {number}
    </div>
    <div>
      <div style={{ ...t.h3, marginBottom: space[3], fontFamily: font.display, fontSize: '24px' }}>
        {title}
      </div>
      <div style={{ ...t.body, color: color.inkMuted, maxWidth: '62ch' }}>{body}</div>
    </div>
  </div>
);

const UseCaseCard = ({ name, blurb }) => (
  <div
    style={{
      backgroundColor: color.surface,
      border: `1px solid ${color.hairline}`,
      borderRadius: radius.md,
      padding: `${space[5]} ${space[5]}`,
    }}
  >
    <div
      style={{
        fontFamily: font.display,
        fontSize: '18px',
        fontWeight: 500,
        color: color.ink,
        marginBottom: space[2],
        letterSpacing: '-0.1px',
      }}
    >
      {name}
    </div>
    <div style={{ ...t.small, color: color.inkMuted }}>{blurb}</div>
  </div>
);

const Prose = ({ children }) => (
  <div
    style={{
      maxWidth: '64ch',
      display: 'flex',
      flexDirection: 'column',
      gap: space[4],
      ...t.prose,
    }}
  >
    {children}
  </div>
);

export default SplashPage;
