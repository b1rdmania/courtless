import React from 'react';
import { useNavigate } from 'react-router-dom';
import { color, font, space, t } from '../theme.js';
import {
  Container,
  Section,
  Eyebrow,
  Button,
  Note,
  TopBar,
  Footer,
} from '../components/ui.jsx';

const AboutPage = () => {
  const navigate = useNavigate();
  const start = () => navigate('/start');

  return (
    <main style={{ backgroundColor: color.canvas, color: color.ink, minHeight: '100vh' }}>
      <TopBar
        onWordmarkClick={() => navigate('/')}
        rightSlot={
          <Button variant="primary" size="sm" iconRight onClick={start}>Start</Button>
        }
      />

      {/* INTRO */}
      <section
        style={{
          padding: `clamp(${space[10]}, 10vh, ${space[12]}) 0`,
          borderBottom: `1px solid ${color.hairline}`,
        }}
      >
        <Container max="900px">
          <Eyebrow>About Courtless</Eyebrow>
          <h1 style={{ ...t.display, marginBottom: space[5], maxWidth: '18ch' }}>
            Mediation, not <span style={{ fontStyle: 'italic', color: color.accent }}>verdict.</span>
          </h1>
          <p style={{ ...t.lede, maxWidth: '52ch' }}>
            A structured AI mediation protocol for UK disputes under £100K. Built on the
            architecture of evidence-based couples therapy, grounded in real case law, with a
            game-theory layer for realism.
          </p>
        </Container>
      </section>

      {/* HERITAGE */}
      <Section>
        <Container max="780px">
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
        <Container max="780px">
          <Eyebrow>Why this exists</Eyebrow>
          <h2 style={{ ...t.h1, marginBottom: space[6], maxWidth: '22ch' }}>
            There's a gap between &ldquo;shrug it off&rdquo; and &ldquo;hire a solicitor.&rdquo;
          </h2>
          <Prose>
            <p>
              If your deposit is £1,800 or a client owes you £6,000, a solicitor at £300–500 an
              hour is maths that doesn't work. You'll spend half the claim before you have a letter
              drafted. Small claims court is meant to fix that under £10K, but it's still stressful,
              adversarial, slow — and most people have no idea whether they'd actually win.
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

      {/* IF OTHER SIDE DECLINES */}
      <Section alt>
        <Container max="900px">
          <Eyebrow>What if the other side declines?</Eyebrow>
          <h2 style={{ ...t.h1, marginBottom: space[6], maxWidth: '24ch' }}>
            You're never stuck waiting on their consent.
          </h2>
          <Note tone="accent" title="One-sided audit, with a steelman of their argument">
            We still deliver a private audit for you — including a steelman of what the other side
            would most likely argue. The joint brief is the unlock when both parties engage, but
            you don't need their permission to get a reality check on your own case.
          </Note>
        </Container>
      </Section>

      {/* CTA */}
      <Section>
        <Container max="780px" style={{ textAlign: 'center' }}>
          <h2 style={{ ...t.h1, marginBottom: space[5] }}>
            Ready to start?
          </h2>
          <Button variant="primary" size="lg" iconRight onClick={start}>
            Start a mediation
          </Button>
        </Container>
      </Section>

      <Footer />
    </main>
  );
};

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

export default AboutPage;
