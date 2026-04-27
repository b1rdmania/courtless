import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DEMO_LIST } from '../data/demoBriefs.js';
import { color, font, space, radius, t } from '../theme.js';
import { Container, Button, TopBar, Footer, Eyebrow, ArrowRight } from '../components/ui.jsx';

const DemoList = () => {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: color.canvas, color: color.ink, minHeight: '100vh' }}>
      <TopBar
        onWordmarkClick={() => navigate('/')}
        rightSlot={
          <Button variant="primary" size="sm" iconRight onClick={() => navigate('/start')}>
            Start my audit
          </Button>
        }
      />

      <main>
        <Container max="1080px" style={{ padding: `${space[8]} ${space[6]} ${space[12]}` }}>
          <div style={{ maxWidth: '720px', marginBottom: space[9] }}>
            <Eyebrow accent={color.accent}>Demo briefs</Eyebrow>
            <h1 style={{ ...t.h1, marginBottom: space[4] }}>
              See what a Courtless brief looks like.
            </h1>
            <p style={{ ...t.lede }}>
              Hand-crafted example briefs for sample disputes. Real audits use your own documents
              and circumstances — click through any of these to see the format, depth, and tone.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: space[4],
            }}
          >
            {DEMO_LIST.map((d) => (
              <DemoCard key={d.id} demo={d} onOpen={() => navigate(`/demo/${d.id}`)} />
            ))}
          </div>

          <div
            style={{
              marginTop: space[10],
              padding: `${space[6]} ${space[7]}`,
              backgroundColor: color.surface,
              border: `1px solid ${color.hairline}`,
              borderRadius: radius.lg,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: space[5],
            }}
          >
            <div style={{ ...t.body, maxWidth: '52ch', color: color.inkMuted }}>
              Ready to run your own? Upload your documents and we'll draft your brief in about a
              minute.
            </div>
            <Button variant="primary" size="md" iconRight onClick={() => navigate('/start')}>
              Start my audit
            </Button>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
};

const DemoCard = ({ demo, onOpen }) => {
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  return (
    <button
      onClick={onOpen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={{
        textAlign: 'left',
        backgroundColor: color.surface,
        border: `1px solid ${hover ? color.hairlineStrong : color.hairline}`,
        borderTop: `3px solid ${color.accent}`,
        borderRadius: radius.lg,
        padding: `${space[6]} ${space[6]} ${space[5]}`,
        cursor: 'pointer',
        fontFamily: font.body,
        color: color.ink,
        transition: 'transform 150ms ease, box-shadow 150ms ease',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '220px',
        boxShadow: hover ? '0 12px 30px rgba(27, 24, 21, 0.08)' : '0 1px 2px rgba(27, 24, 21, 0.04)',
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
        outline: focus ? `3px solid ${color.accent}` : 'none',
        outlineOffset: '2px',
      }}
    >
      <div style={{ ...t.eyebrow, marginBottom: space[3] }}>Example brief</div>
      <div
        style={{
          fontFamily: font.display,
          fontSize: '22px',
          fontWeight: 500,
          letterSpacing: '-0.3px',
          color: color.ink,
          marginBottom: space[3],
          lineHeight: 1.25,
        }}
      >
        {demo.title}
      </div>
      <div style={{ ...t.bodyMuted, marginBottom: space[4], flex: 1 }}>{demo.teaser}</div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: space[3],
          borderTop: `1px solid ${color.hairline}`,
        }}
      >
        <div style={{ ...t.small, color: color.inkMuted }}>
          £{Number(demo.amount_in_dispute || 0).toLocaleString()} in dispute
        </div>
        <div
          style={{
            ...t.small,
            color: color.accent,
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: space[1],
          }}
        >
          See the brief <ArrowRight size={12} />
        </div>
      </div>
    </button>
  );
};

export default DemoList;
