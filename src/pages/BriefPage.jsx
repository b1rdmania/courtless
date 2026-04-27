import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getDemoBrief } from '../data/demoBriefs.js';
import { color, font, space, radius, t } from '../theme.js';
import {
  Container,
  Button,
  Note,
  TopBar,
  Footer,
  Eyebrow,
} from '../components/ui.jsx';

const API_BASE = import.meta.env.VITE_API_URL || '';

const formatDate = (iso) => {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return iso;
  }
};

const BriefPage = ({ isDemo: isDemoProp = false }) => {
  const { disputeId, demoId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isDemo = isDemoProp || location.pathname.startsWith('/demo/');
  const id = isDemo ? demoId : disputeId;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (isDemo) {
      const d = getDemoBrief(id);
      if (d) {
        setData(d);
      } else {
        setError('Demo not found');
      }
      setLoading(false);
      return;
    }

    let mounted = true;
    (async () => {
      try {
        let token = '';
        try {
          token = localStorage.getItem(`courtless_token_${id}`) || '';
        } catch {
          // localStorage unavailable — request will 403.
        }
        const res = await fetch(`${API_BASE}/api/disputes/${id}`, {
          headers: token ? { 'X-Owner-Token': token } : {},
        });
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const j = await res.json();
        if (mounted) {
          setData(j);
          setLoading(false);
        }
      } catch (e) {
        if (mounted) {
          setError(e.message || String(e));
          setLoading(false);
        }
      }
    })();
    return () => { mounted = false; };
  }, [id, isDemo]);

  return (
    <div style={{ backgroundColor: color.canvas, color: color.ink, minHeight: '100vh' }}>
      <TopBar
        onWordmarkClick={() => navigate('/')}
        rightSlot={
          <>
            {data && data.status === 'brief_ready' && (
              <Button variant="secondary" size="sm" onClick={() => window.print()}>
                Save as PDF
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>Home</Button>
          </>
        }
      />

      <main>
        <Container max="800px" style={{ padding: `${space[8]} ${space[6]} ${space[12]}` }}>
          {loading && <LoadingState />}
          {!loading && (error || !data) && <ErrorState message={error} />}
          {!loading && data && data.status && data.status !== 'brief_ready' && (
            <PendingState status={data.status} />
          )}
          {!loading && data && (data.status === 'brief_ready' || isDemo) && (
            <BriefBody data={data} isDemo={isDemo} onStart={() => navigate('/start')} />
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
};

// ===== Brief body =====

const BriefBody = ({ data, isDemo, onStart }) => {
  const brief = data.brief || {};
  const title = data.title || 'Your dispute';

  return (
    <article
      style={{
        backgroundColor: color.surface,
        border: `1px solid ${color.hairline}`,
        borderRadius: radius.lg,
        padding: `clamp(${space[7]}, 5vw, ${space[10]}) clamp(${space[6]}, 5vw, ${space[10]})`,
      }}
    >
      {isDemo && (
        <Note tone="caution" title="Example brief" style={{ marginBottom: space[7] }}>
          Based on a fictional dispute used to demonstrate Courtless. Your real audit will use
          your own documents.{' '}
          <button
            onClick={onStart}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              color: color.accent,
              fontWeight: 600,
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              cursor: 'pointer',
              fontFamily: font.body,
              fontSize: 'inherit',
            }}
          >
            Start your own audit →
          </button>
        </Note>
      )}

      {/* Document head — like a court filing */}
      <header
        style={{
          paddingBottom: space[6],
          borderBottom: `1px solid ${color.hairline}`,
          marginBottom: space[8],
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: space[4],
            marginBottom: space[5],
          }}
        >
          <div style={{ ...t.eyebrow, color: color.accent }}>
            {isDemo ? 'Demo · Private brief' : 'Private brief'}
          </div>
          <div style={{ ...t.caption, fontVariantNumeric: 'tabular-nums' }}>
            {data.reference ? `Ref. ${data.reference}` : `Generated ${formatDate(data.generated_at || data.updated_at)}`}
          </div>
        </div>
        <h1
          style={{
            ...t.h1,
            fontWeight: 400,
            marginBottom: space[3],
          }}
        >
          {title}
        </h1>
        <p style={{ ...t.small, color: color.inkSubtle }}>
          Prepared by Courtless · An informational mediation audit · Not legal advice
        </p>
      </header>

      {/* HONEST TAKE — pull-quote */}
      {brief.honest_take && (
        <section
          aria-labelledby="honest-take"
          style={{
            margin: `0 0 ${space[8]}`,
            padding: `${space[5]} ${space[6]}`,
            borderLeft: `3px solid ${color.accent}`,
            backgroundColor: color.accentSoft,
            borderRadius: `${radius.sm} ${radius.md} ${radius.md} ${radius.sm}`,
          }}
        >
          <div id="honest-take" style={{ ...t.eyebrow, color: color.accent, marginBottom: space[3] }}>
            The honest take
          </div>
          <div
            style={{
              fontFamily: font.display,
              fontSize: 'clamp(19px, 2vw, 22px)',
              lineHeight: 1.5,
              color: color.ink,
              fontWeight: 400,
              fontStyle: 'italic',
            }}
          >
            {brief.honest_take}
          </div>
        </section>
      )}

      {brief.summary && (
        <BriefSection number="01" title="Summary" eyebrow="What this dispute looks like from the outside">
          <Paragraphs text={brief.summary} />
        </BriefSection>
      )}

      {Array.isArray(brief.strongest_points) && brief.strongest_points.length > 0 && (
        <BriefSection number="02" title="Your strongest points" eyebrow="Where you're on solid ground">
          <PointList items={brief.strongest_points} keyA="point" keyB="reasoning" tone="positive" />
        </BriefSection>
      )}

      {Array.isArray(brief.weakest_points) && brief.weakest_points.length > 0 && (
        <BriefSection number="03" title="Your weakest points" eyebrow="Where you're exposed">
          <PointList items={brief.weakest_points} keyA="point" keyB="reasoning" tone="caution" />
        </BriefSection>
      )}

      {Array.isArray(brief.evidence_gaps) && brief.evidence_gaps.length > 0 && (
        <BriefSection number="04" title="Evidence gaps" eyebrow="What you said, but couldn't show">
          <PointList items={brief.evidence_gaps} keyA="claim" keyB="gap" tone="info" />
        </BriefSection>
      )}

      {brief.opposing_argument && (
        <BriefSection number="05" title="The other side's steelman" eyebrow="What they'd likely argue">
          <Paragraphs text={brief.opposing_argument} />
        </BriefSection>
      )}

      <BriefSection number="06" title="Case law" eyebrow="Where precedent fits in">
        <Paragraphs
          text={
            brief.case_law_note ||
            'Fuller case law analysis is included in the joint brief once the other party engages.'
          }
        />
      </BriefSection>

      {brief.recommended_next_step && (
        <BriefSection number="07" title="Recommended next step" eyebrow="What to actually do">
          <Paragraphs text={brief.recommended_next_step} />
        </BriefSection>
      )}

      {/* What happens next */}
      <div
        data-print-hide="true"
        style={{
          marginTop: space[10],
          padding: `${space[6]} ${space[6]}`,
          backgroundColor: color.surfaceSunken,
          border: `1px dashed ${color.hairlineStrong}`,
          borderRadius: radius.lg,
        }}
      >
        <Eyebrow>What happens next</Eyebrow>
        <div style={{ ...t.h3, marginBottom: space[3] }}>
          Want the full picture? Invite the other side.
        </div>
        <p style={{ ...t.bodyMuted, marginBottom: space[5] }}>
          When the other party submits their version, we'll generate a joint brief for both of you —
          same text, same case law, same settlement band. That's where the real leverage comes from.
        </p>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: space[2],
            padding: `${space[2]} ${space[4]}`,
            backgroundColor: color.surface,
            border: `1px solid ${color.hairline}`,
            borderRadius: radius.pill,
            ...t.caption,
            color: color.inkMuted,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: color.accent }} />
          Invite link · arriving in Phase 2
        </div>
      </div>

      {/* Document foot */}
      <div
        style={{
          marginTop: space[10],
          paddingTop: space[6],
          borderTop: `1px solid ${color.hairline}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: space[4],
        }}
      >
        <p style={{ ...t.caption, maxWidth: '46ch' }}>
          Courtless is not legal advice. This brief is an informational audit. For binding advice,
          consult a qualified solicitor.
        </p>
        <Button variant="secondary" size="sm" onClick={() => window.print()}>
          Save brief as PDF
        </Button>
      </div>
    </article>
  );
};

// ===== Section + helpers =====

const BriefSection = ({ number, title, eyebrow, children }) => (
  <section
    style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr)',
      marginBottom: space[10],
    }}
  >
    <header
      style={{
        display: 'grid',
        gridTemplateColumns: '60px 1fr',
        alignItems: 'baseline',
        gap: space[5],
        marginBottom: space[5],
        paddingBottom: space[3],
        borderBottom: `1px solid ${color.hairline}`,
      }}
    >
      <div
        style={{
          fontFamily: font.display,
          fontSize: '24px',
          fontWeight: 300,
          color: color.accent,
          letterSpacing: '-0.5px',
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1,
        }}
      >
        {number}
      </div>
      <div>
        <div style={{ ...t.eyebrow, marginBottom: space[1] }}>{eyebrow}</div>
        <h2 style={{ ...t.h2, fontSize: 'clamp(22px, 2.4vw, 28px)' }}>{title}</h2>
      </div>
    </header>
    <div style={{ paddingLeft: 'clamp(0px, 4vw, 80px)' }}>{children}</div>
  </section>
);

const Paragraphs = ({ text }) => {
  const blocks = String(text || '').split(/\n\s*\n/).filter(Boolean);
  if (blocks.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space[3], maxWidth: '64ch' }}>
      {blocks.map((b, i) => (
        <p key={i} style={{ ...t.prose, color: color.ink }}>
          {b.split('\n').map((line, j, arr) => (
            <React.Fragment key={j}>
              {line}
              {j < arr.length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      ))}
    </div>
  );
};

const PointList = ({ items, keyA, keyB, tone = 'info' }) => {
  const tones = {
    positive: { bar: color.positive, label: color.positive },
    caution: { bar: color.caution, label: color.caution },
    info: { bar: color.info, label: color.info },
    accent: { bar: color.accent, label: color.accent },
  };
  const tt = tones[tone] || tones.info;
  return (
    <ol
      style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: space[4],
      }}
    >
      {items.map((it, i) => (
        <li
          key={i}
          style={{
            display: 'grid',
            gridTemplateColumns: '36px 1fr',
            gap: space[4],
            paddingBottom: space[4],
            borderBottom: i === items.length - 1 ? 'none' : `1px solid ${color.hairline}`,
          }}
        >
          <div
            style={{
              fontFamily: font.display,
              fontSize: '20px',
              fontWeight: 400,
              color: tt.label,
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1.2,
            }}
          >
            {String(i + 1).padStart(2, '0')}
          </div>
          <div>
            <div
              style={{
                ...t.body,
                fontWeight: 600,
                color: color.ink,
                marginBottom: space[2],
                lineHeight: 1.45,
              }}
            >
              {it[keyA]}
            </div>
            <div style={{ ...t.bodyMuted, fontSize: '15px' }}>
              {it[keyB]}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
};

// ===== States =====

const LoadingState = () => (
  <div
    role="status"
    aria-live="polite"
    style={{
      backgroundColor: color.surface,
      border: `1px solid ${color.hairline}`,
      borderRadius: radius.lg,
      padding: `${space[10]} ${space[6]}`,
      textAlign: 'center',
    }}
  >
    <div
      style={{
        width: 28,
        height: 28,
        border: `2px solid ${color.hairlineStrong}`,
        borderTopColor: color.accent,
        borderRadius: '50%',
        margin: `0 auto ${space[4]}`,
        animation: 'spin 0.9s linear infinite',
      }}
      aria-hidden="true"
    />
    <div style={{ ...t.body, color: color.inkMuted }}>Loading your brief…</div>
  </div>
);

const ErrorState = ({ message }) => (
  <Note tone="danger" title="Couldn't load this brief">
    {message || 'Not found.'}
  </Note>
);

const PendingState = ({ status }) => (
  <div
    style={{
      backgroundColor: color.surface,
      border: `1px solid ${color.hairline}`,
      borderRadius: radius.lg,
      padding: `${space[10]} ${space[6]}`,
      textAlign: 'center',
    }}
  >
    <div style={{ ...t.h2, marginBottom: space[3] }}>Still analysing…</div>
    <div style={{ ...t.bodyMuted }}>Status: {status}. Refresh in a moment.</div>
  </div>
);

export default BriefPage;
