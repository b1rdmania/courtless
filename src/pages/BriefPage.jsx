import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const fontFamily = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const serif = 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif';

const shellStyle = {
  backgroundColor: '#0F0F10',
  color: '#EBEBF5',
  fontFamily,
  WebkitFontSmoothing: 'antialiased',
  minHeight: '100vh',
  width: '100vw',
};

const containerStyle = {
  maxWidth: '860px',
  margin: '0 auto',
  padding: '32px 28px 80px',
};

const panelStyle = {
  backgroundColor: '#1A1A1C',
  border: '1px solid rgba(235, 235, 245, 0.06)',
  borderRadius: '14px',
  padding: '28px 30px',
  marginBottom: '20px',
};

const sectionEyebrow = {
  fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.8px',
  color: 'rgba(235, 235, 245, 0.4)', fontWeight: 600, marginBottom: '12px',
};

const sectionTitle = {
  fontFamily: serif, fontSize: '24px', fontWeight: 500,
  letterSpacing: '-0.4px', color: '#EBEBF5', marginBottom: '18px',
  lineHeight: 1.25,
};

const paragraph = {
  fontSize: '15px', color: 'rgba(235, 235, 245, 0.78)',
  lineHeight: 1.75, marginBottom: '14px',
};

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
    let mounted = true;
    const load = async () => {
      try {
        const endpoint = isDemo ? `/api/demo/${id}` : `/api/disputes/${id}`;
        const res = await fetch(endpoint);
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
    };
    load();
    return () => { mounted = false; };
  }, [id, isDemo]);

  if (loading) {
    return (
      <div style={shellStyle}>
        <TopBar onExit={() => navigate('/')} />
        <div style={containerStyle}>
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(235, 235, 245, 0.6)' }}>
            Loading your brief…
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={shellStyle}>
        <TopBar onExit={() => navigate('/')} />
        <div style={containerStyle}>
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#FF6B5C' }}>
            Couldn't load this brief — {error || 'not found'}.
          </div>
        </div>
      </div>
    );
  }

  const brief = data.brief || {};
  const title = data.title || 'Your dispute';
  const status = data.status;

  // Still analysing?
  if (status !== 'brief_ready' || !brief) {
    return (
      <div style={shellStyle}>
        <TopBar onExit={() => navigate('/')} />
        <div style={containerStyle}>
          <div style={{ ...panelStyle, textAlign: 'center', padding: '64px 32px' }}>
            <div style={{ fontFamily: serif, fontSize: '24px', marginBottom: '10px' }}>
              Still analysing…
            </div>
            <div style={{ color: 'rgba(235, 235, 245, 0.6)', fontSize: '14px' }}>
              Status: {status}. Refresh in a moment.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={shellStyle}>
      <TopBar onExit={() => navigate('/')} onPrint={() => window.print()} />

      <div style={containerStyle}>
        {isDemo && <DemoBanner onStart={() => navigate('/start')} />}

        {/* Header block */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{
            fontSize: '11px', letterSpacing: '1.8px', textTransform: 'uppercase',
            fontWeight: 700, color: '#0A84FF', marginBottom: '14px',
          }}>
            {isDemo ? 'Example Brief' : 'Private Brief'}
          </div>
          <h1 style={{
            fontFamily: serif, fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 500, letterSpacing: '-0.8px', color: '#EBEBF5',
            lineHeight: 1.15, marginBottom: '10px',
          }}>
            {title}
          </h1>
          <div style={{ fontSize: '13px', color: 'rgba(235, 235, 245, 0.5)' }}>
            Generated {formatDate(data.generated_at || data.updated_at)} ·
            Not legal advice — an informational audit.
          </div>
        </div>

        {/* Honest take — standout */}
        {brief.honest_take && (
          <div style={{
            ...panelStyle,
            backgroundColor: 'rgba(10, 132, 255, 0.06)',
            borderColor: 'rgba(10, 132, 255, 0.25)',
          }}>
            <div style={{ ...sectionEyebrow, color: '#0A84FF' }}>The honest take</div>
            <div style={{
              fontFamily: serif, fontSize: '20px', fontWeight: 500,
              letterSpacing: '-0.2px', color: '#EBEBF5', lineHeight: 1.4,
            }}>
              {brief.honest_take}
            </div>
          </div>
        )}

        {/* Summary */}
        {brief.summary && (
          <Section eyebrow="Summary" title="What this dispute looks like from the outside">
            <Paragraphs text={brief.summary} />
          </Section>
        )}

        {/* Strongest points */}
        {Array.isArray(brief.strongest_points) && brief.strongest_points.length > 0 && (
          <Section eyebrow="Your strongest points" title="Where you're on solid ground">
            <PointList items={brief.strongest_points} keyA="point" keyB="reasoning" accent="#32D74B" />
          </Section>
        )}

        {/* Weakest points */}
        {Array.isArray(brief.weakest_points) && brief.weakest_points.length > 0 && (
          <Section eyebrow="Your weakest points" title="Where you're exposed">
            <PointList items={brief.weakest_points} keyA="point" keyB="reasoning" accent="#FF9F0A" />
          </Section>
        )}

        {/* Evidence gaps */}
        {Array.isArray(brief.evidence_gaps) && brief.evidence_gaps.length > 0 && (
          <Section eyebrow="Evidence gaps" title="What you said, but couldn't show">
            <PointList items={brief.evidence_gaps} keyA="claim" keyB="gap" accent="#BF5AF2" />
          </Section>
        )}

        {/* Opposing argument */}
        {brief.opposing_argument && (
          <Section eyebrow="What they'd likely argue" title="The other side's steelman">
            <Paragraphs text={brief.opposing_argument} />
          </Section>
        )}

        {/* Case law */}
        <Section eyebrow="Case law" title="Where precedent fits in">
          <div style={paragraph}>
            {brief.case_law_note ||
              'Fuller case law analysis available in the joint brief once the other party engages.'}
          </div>
        </Section>

        {/* Recommended next step */}
        {brief.recommended_next_step && (
          <Section eyebrow="Recommended next step" title="What to actually do">
            <Paragraphs text={brief.recommended_next_step} />
          </Section>
        )}

        {/* What happens next — V2 placeholder */}
        <div style={{
          ...panelStyle,
          backgroundColor: '#141416',
          borderStyle: 'dashed',
        }}>
          <div style={sectionEyebrow}>What happens next</div>
          <div style={sectionTitle}>
            Want the full picture? Invite the other side.
          </div>
          <div style={{ ...paragraph, marginBottom: '18px' }}>
            When the other party submits their version, we'll generate a joint brief for both of you —
            same text, same case law, same settlement band. That's where the real leverage comes from.
          </div>
          <div style={{
            display: 'inline-block', padding: '10px 16px',
            backgroundColor: 'rgba(235, 235, 245, 0.06)',
            border: '1px solid rgba(235, 235, 245, 0.12)',
            borderRadius: '8px', fontSize: '12px',
            color: 'rgba(235, 235, 245, 0.6)', fontWeight: 500,
          }}>
            Invite link · coming in Phase 2
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '40px', padding: '20px 0',
          borderTop: '1px solid rgba(235, 235, 245, 0.06)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '16px',
        }}>
          <div style={{ fontSize: '12px', color: 'rgba(235, 235, 245, 0.45)', maxWidth: '520px', lineHeight: 1.6 }}>
            Courtless is not legal advice. This brief is an informational audit. For binding advice,
            consult a qualified solicitor.
          </div>
          <button
            onClick={() => window.print()}
            style={{
              padding: '10px 18px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(235, 235, 245, 0.15)',
              color: '#EBEBF5',
              borderRadius: '8px', fontSize: '13px', fontWeight: 500,
              cursor: 'pointer', fontFamily,
            }}
          >
            Save brief as PDF
          </button>
        </div>
      </div>
    </div>
  );
};

// ---- helpers ----

const DemoBanner = ({ onStart }) => (
  <div style={{
    backgroundColor: 'rgba(255, 159, 10, 0.08)',
    border: '1px solid rgba(255, 159, 10, 0.35)',
    borderLeft: '3px solid #FF9F0A',
    borderRadius: '10px',
    padding: '16px 20px',
    marginBottom: '28px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    gap: '20px', flexWrap: 'wrap',
  }}>
    <div style={{ fontSize: '13px', color: '#EBEBF5', lineHeight: 1.55, maxWidth: '600px' }}>
      <strong style={{ color: '#FFB340' }}>This is an example brief</strong> — based on a
      fictional dispute used to demonstrate Courtless. Your real audit will be based on
      your own documents.
    </div>
    <button
      onClick={onStart}
      style={{
        padding: '9px 16px', borderRadius: '6px',
        backgroundColor: '#0A84FF', color: 'white', border: 'none',
        fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily,
        whiteSpace: 'nowrap',
      }}
    >
      Start my audit →
    </button>
  </div>
);

const Section = ({ eyebrow, title, children }) => (
  <div style={panelStyle}>
    <div style={sectionEyebrow}>{eyebrow}</div>
    <div style={sectionTitle}>{title}</div>
    {children}
  </div>
);

const Paragraphs = ({ text }) => {
  const blocks = (text || '').split(/\n\s*\n/).filter(Boolean);
  if (blocks.length === 0) return null;
  return (
    <>
      {blocks.map((b, i) => (
        <div key={i} style={paragraph}>
          {b.split('\n').map((line, j) => (
            <React.Fragment key={j}>
              {line}
              {j < b.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
      ))}
    </>
  );
};

const PointList = ({ items, keyA, keyB, accent }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
    {items.map((it, i) => (
      <div
        key={i}
        style={{
          padding: '14px 16px',
          backgroundColor: '#141416',
          border: '1px solid rgba(235, 235, 245, 0.05)',
          borderRadius: '10px',
          position: 'relative',
          paddingLeft: '22px',
        }}
      >
        <div style={{
          position: 'absolute', left: '8px', top: '18px', bottom: '18px',
          width: '3px', backgroundColor: accent, borderRadius: '2px',
        }} />
        <div style={{ fontSize: '14px', color: '#EBEBF5', fontWeight: 600, marginBottom: '6px', lineHeight: 1.45 }}>
          {it[keyA]}
        </div>
        <div style={{ fontSize: '13px', color: 'rgba(235, 235, 245, 0.68)', lineHeight: 1.6 }}>
          {it[keyB]}
        </div>
      </div>
    ))}
  </div>
);

const TopBar = ({ onExit, onPrint }) => (
  <div style={{
    position: 'sticky', top: 0, zIndex: 20,
    backgroundColor: 'rgba(15, 15, 16, 0.9)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(235, 235, 245, 0.06)',
    padding: '14px 28px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  }}>
    <div style={{ fontWeight: 700, fontSize: '14px', letterSpacing: '-0.3px' }}>
      COURTLESS{' '}
      <span style={{ color: 'rgba(235, 235, 245, 0.5)', fontWeight: 400 }}>
        Disputes Without Courts
      </span>
    </div>
    <div style={{ display: 'flex', gap: '12px' }}>
      {onPrint && (
        <button
          onClick={onPrint}
          style={{
            fontSize: '12px', color: 'rgba(235, 235, 245, 0.75)',
            background: 'none', border: '1px solid rgba(235, 235, 245, 0.15)',
            padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontFamily,
          }}
        >
          Save as PDF
        </button>
      )}
      <button
        onClick={onExit}
        style={{
          fontSize: '12px', color: 'rgba(235, 235, 245, 0.55)',
          background: 'none', border: 'none', cursor: 'pointer', fontFamily,
        }}
      >
        Home
      </button>
    </div>
  </div>
);

export default BriefPage;
