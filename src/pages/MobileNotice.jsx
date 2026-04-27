import React from 'react';
import { useNavigate } from 'react-router-dom';
import { color, font, space, t } from '../theme.js';
import { Button, Wordmark } from '../components/ui.jsx';

const MobileNotice = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: color.canvas,
        color: color.ink,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `${space[8]} ${space[6]}`,
        textAlign: 'center',
      }}
    >
      <div style={{ marginBottom: space[9] }}>
        <Wordmark size="lg" />
      </div>

      <div style={{ ...t.eyebrow, marginBottom: space[4] }}>Best viewed on desktop or tablet</div>
      <h1
        style={{
          ...t.h1,
          marginBottom: space[5],
          maxWidth: '14ch',
        }}
      >
        Courtless works best on a laptop or tablet.
      </h1>
      <p style={{ ...t.bodyMuted, maxWidth: '40ch', marginBottom: space[7] }}>
        The intake form and your private brief are designed for a bigger screen — it's worth the
        read. Send yourself this link, or open it again on a laptop or tablet in landscape.
      </p>
      <Button variant="primary" size="md" onClick={() => navigate('/')}>
        Back to overview
      </Button>
    </div>
  );
};

export default MobileNotice;
