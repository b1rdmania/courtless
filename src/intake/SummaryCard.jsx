import React from 'react';
import { color, font, radius, space, t } from '../theme.js';

const RESPONSIBILITY_LABELS = {
  none: 'Not at all',
  a_little: 'A little',
  partially: 'Partially',
};

export const SummaryCard = ({ form, evidence, includePrevious = false }) => {
  const rows = [
    ['Dispute', form.title || '—'],
    ['Amount', form.amount ? `£${Number(form.amount).toLocaleString()}` : '—'],
    ['Other party', form.other_party_name || 'Not named'],
    ['When it started', form.problem_started || '—'],
    ['Your side', `${(form.dispute_description || '').trim().length} characters`],
    ['Desired outcome', `${(form.desired_outcome || '').trim().length} characters`],
    ...(includePrevious
      ? [['Previous attempts', form.previous_attempts_radio === 'yes' ? 'Yes — described' : 'No']]
      : []),
    ['Own responsibility', RESPONSIBILITY_LABELS[form.own_responsibility] || '—'],
    [
      'Evidence',
      evidence.length === 0
        ? 'None uploaded'
        : `${evidence.length} file${evidence.length === 1 ? '' : 's'}`,
    ],
  ];

  return (
    <dl
      style={{
        backgroundColor: color.surface,
        border: `1px solid ${color.hairline}`,
        borderRadius: radius.lg,
        padding: `${space[5]} ${space[6]}`,
        margin: `0 0 ${space[6]}`,
      }}
    >
      {rows.map(([label, value], i) => (
        <div
          key={label}
          style={{
            display: 'grid',
            gridTemplateColumns: '170px 1fr',
            padding: `${space[3]} 0`,
            borderBottom: i === rows.length - 1 ? 'none' : `1px solid ${color.hairline}`,
            gap: space[3],
            alignItems: 'baseline',
          }}
        >
          <dt style={{ ...t.eyebrow, paddingTop: '2px' }}>{label}</dt>
          <dd
            style={{
              ...t.body,
              color: color.ink,
              fontFamily: font.body,
              fontSize: '14px',
              wordBreak: 'break-word',
              margin: 0,
            }}
          >
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
};
