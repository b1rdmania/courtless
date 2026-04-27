import React from 'react';
import { useNavigate } from 'react-router-dom';
import { color, font, space, radius, t } from '../theme.js';
import {
  Container,
  Section,
  Eyebrow,
  Button,
  Card,
  TopBar,
  Footer,
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
              <Button variant="ghost" size="sm" onClick={() => navigate('/about')}>About</Button>
            )}
            <Button variant="primary" size="sm" iconRight onClick={start}>Start</Button>
          </>
        }
      />

      {/* HERO */}
      <section
        style={{
          padding: `clamp(${space[10]}, 12vh, ${space[13]}) 0 clamp(${space[9]}, 8vw, ${space[11]})`,
          borderBottom: `1px solid ${color.hairline}`,
        }}
      >
        <Container max="1100px">
          <Eyebrow>AI mediation · UK disputes under £100K</Eyebrow>
          <h1 style={{ ...t.display, marginBottom: space[5], maxWidth: '15ch' }}>
            Two sides heard.<br />
            <span style={{ fontStyle: 'italic', color: color.accent }}>One realistic take.</span>
          </h1>
          <p style={{ ...t.lede, maxWidth: '40ch', marginBottom: space[7] }}>
            Both parties submit independently. The AI reads everything and produces a neutral
            joint brief — grounded in real UK case law.
          </p>
          <div style={{ display: 'flex', gap: space[3], alignItems: 'center', flexWrap: 'wrap' }}>
            <Button variant="primary" size="lg" iconRight onClick={start}>
              Start a mediation — free
            </Button>
            <Button variant="link" size="md" onClick={demo}>
              See a demo brief →
            </Button>
          </div>
          <div style={{ ...t.caption, marginTop: space[4] }}>
            10 minutes · Free first audit · Not legal advice
          </div>
        </Container>

        <Container max="1100px" style={{ marginTop: space[9] }}>
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
              'Both sides heard',
              'Real UK case law',
              'Settlement bands',
              'Not legal advice',
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
          <h2 style={{ ...t.h1, marginBottom: space[8], maxWidth: '20ch' }}>
            Three stages. No mediator required.
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: space[4],
            }}
          >
            <StepCard number="01" label="Dual intake" title="Both sides submit, separately.">
              You submit your version and evidence. The other party gets an invite link and submits
              their own — never seeing yours.
            </StepCard>
            <StepCard number="02" label="Signal extraction" title="AI reads both against the same evidence.">
              Agreed facts, contested facts, evidence weight. Real UK case law from the National
              Archives. A BATNA/WATNA for each side.
            </StepCard>
            <StepCard number="03" label="Mediated output" title="One identical joint brief." accent={color.accent}>
              Each side gets a private brief — strong points, weak points, honest. Then a joint
              brief lands with both of you, word for word identical.
            </StepCard>
          </div>
        </Container>
      </Section>

      {/* USE CASES */}
      <Section>
        <Container max="1100px">
          <Eyebrow>What it's for</Eyebrow>
          <h2 style={{ ...t.h1, marginBottom: space[8], maxWidth: '22ch' }}>
            For disputes that fall through the cracks.
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: space[3],
            }}
          >
            {[
              'Deposit disputes',
              'Freelance invoices',
              'Founder fall-outs',
              'Workplace disagreements',
              'Supplier disputes',
              'Consumer complaints',
            ].map((name) => (
              <UseCaseCard key={name} name={name} />
            ))}
          </div>

          <p style={{ ...t.caption, marginTop: space[6], color: color.inkSubtle }}>
            Not for: family law, criminal matters, personal injury, or anything above £100K. Talk
            to a solicitor.
          </p>
        </Container>
      </Section>

      {/* FINAL CTA */}
      <Section alt>
        <Container max="780px" style={{ textAlign: 'center' }}>
          <h2 style={{ ...t.h1, marginBottom: space[5] }}>
            Start the mediation.<br />
            <span style={{ fontStyle: 'italic' }}>Before anyone lawyers up.</span>
          </h2>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: space[4] }}>
            <Button variant="primary" size="lg" iconRight onClick={start}>
              Start a mediation
            </Button>
            <Button variant="link" size="sm" onClick={demo}>
              Or see a demo brief →
            </Button>
          </div>
        </Container>
      </Section>

      <Footer />
    </main>
  );
};

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

const UseCaseCard = ({ name }) => (
  <div
    style={{
      backgroundColor: color.surface,
      border: `1px solid ${color.hairline}`,
      borderRadius: radius.md,
      padding: `${space[5]} ${space[5]}`,
      fontFamily: font.display,
      fontSize: '18px',
      fontWeight: 500,
      color: color.ink,
      letterSpacing: '-0.1px',
    }}
  >
    {name}
  </div>
);

export default SplashPage;
