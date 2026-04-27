import React, { useRef, useState } from 'react';
import { color, font, radius, space, t } from '../theme.js';
import { Input, Select } from './fields.jsx';

const ACCEPTED_EXTENSIONS = ['.pdf', '.docx', '.doc', '.jpg', '.jpeg', '.png', '.txt'];
const ACCEPTED_MIME =
  'application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,image/jpeg,image/png,text/plain';

export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const MAX_FILES = 10;

export const EVIDENCE_TYPES = [
  { value: 'contract', label: 'Contract' },
  { value: 'email', label: 'Email' },
  { value: 'invoice', label: 'Invoice' },
  { value: 'photo', label: 'Photo' },
  { value: 'message_thread', label: 'Message thread' },
  { value: 'bank_statement', label: 'Bank statement' },
  { value: 'other', label: 'Other' },
];

const validateAndAdd = (currentEvidence, fileList) => {
  const files = Array.from(fileList || []);
  const toAdd = [];
  const rejected = [];
  for (const f of files) {
    if (currentEvidence.length + toAdd.length >= MAX_FILES) {
      rejected.push({ name: f.name, reason: `Maximum ${MAX_FILES} files` });
      continue;
    }
    if (f.size > MAX_FILE_SIZE) {
      rejected.push({ name: f.name, reason: 'Over 10 MB' });
      continue;
    }
    const ext = '.' + (f.name.split('.').pop() || '').toLowerCase();
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      rejected.push({ name: f.name, reason: 'Unsupported type' });
      continue;
    }
    toAdd.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      file: f,
      upload_type: 'other',
      label: '',
    });
  }
  return { toAdd, rejected };
};

export const EvidenceUploader = ({ evidence, setEvidence, compact = false, labelPlaceholder }) => {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [rejectedNotice, setRejectedNotice] = useState(null);

  const onAdd = (fileList) => {
    const { toAdd, rejected } = validateAndAdd(evidence, fileList);
    if (toAdd.length) setEvidence([...evidence, ...toAdd]);
    if (rejected.length) {
      setRejectedNotice(rejected.map((r) => `${r.name} — ${r.reason}`).join(' · '));
      setTimeout(() => setRejectedNotice(null), 4000);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  const removeAt = (id) => setEvidence(evidence.filter((e) => e.id !== id));
  const updateAt = (id, patch) =>
    setEvidence(evidence.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload evidence files"
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          onAdd(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        onKeyDown={onKeyDown}
        style={{
          border: `1.5px dashed ${dragOver ? color.accent : color.hairlineStrong}`,
          borderRadius: radius.lg,
          padding: compact ? `${space[7]} ${space[5]}` : `${space[9]} ${space[5]}`,
          textAlign: 'center',
          backgroundColor: dragOver ? color.accentSoft : color.canvasAlt,
          cursor: 'pointer',
          transition: 'border-color 120ms ease, background-color 120ms ease',
        }}
      >
        <div
          style={{
            ...t.body,
            color: color.ink,
            fontWeight: 600,
            marginBottom: space[2],
          }}
        >
          Drop files here, or click to choose
        </div>
        <div style={t.caption}>
          PDF · DOCX · JPG · PNG · TXT · max 10 MB each · max {MAX_FILES} files
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_MIME}
          onChange={(e) => {
            onAdd(e.target.files);
            e.target.value = '';
          }}
          style={{ display: 'none' }}
        />
      </div>

      {rejectedNotice && (
        <div
          role="alert"
          style={{
            marginTop: space[3],
            padding: `${space[3]} ${space[4]}`,
            backgroundColor: color.dangerSoft,
            border: `1px solid ${color.dangerBorder}`,
            borderRadius: radius.md,
            ...t.small,
            color: color.danger,
          }}
        >
          Skipped: {rejectedNotice}
        </div>
      )}

      {evidence.length > 0 && (
        <ul
          style={{
            marginTop: space[5],
            listStyle: 'none',
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: space[3],
          }}
        >
          {evidence.map((ev) => (
            <li
              key={ev.id}
              style={{
                padding: `${space[4]} ${space[5]}`,
                backgroundColor: color.surface,
                border: `1px solid ${color.hairline}`,
                borderRadius: radius.md,
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) 160px auto',
                gap: space[3],
                alignItems: 'center',
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: color.ink,
                    marginBottom: space[2],
                    wordBreak: 'break-word',
                    fontFamily: font.body,
                  }}
                >
                  {ev.file.name}
                  <span style={{ ...t.caption, marginLeft: space[2], fontWeight: 400 }}>
                    {(ev.file.size / 1024).toFixed(0)} KB
                  </span>
                </div>
                <Input
                  type="text"
                  value={ev.label}
                  onChange={(e) => updateAt(ev.id, { label: e.target.value })}
                  placeholder={labelPlaceholder || "Label (optional) — e.g. 'signed contract'"}
                  aria-label={`Label for ${ev.file.name}`}
                  style={{ padding: `${space[2]} ${space[3]}`, fontSize: '13px' }}
                />
              </div>
              <Select
                value={ev.upload_type}
                onChange={(e) => updateAt(ev.id, { upload_type: e.target.value })}
                aria-label={`File type for ${ev.file.name}`}
                style={{ padding: `${space[2]} ${space[3]}`, fontSize: '13px' }}
              >
                {EVIDENCE_TYPES.map((tp) => (
                  <option key={tp.value} value={tp.value}>
                    {tp.label}
                  </option>
                ))}
              </Select>
              <button
                type="button"
                onClick={() => removeAt(ev.id)}
                aria-label={`Remove ${ev.file.name}`}
                style={{
                  ...t.small,
                  color: color.danger,
                  background: 'none',
                  border: `1px solid ${color.dangerBorder}`,
                  padding: `${space[2]} ${space[3]}`,
                  borderRadius: radius.md,
                  cursor: 'pointer',
                  fontFamily: font.body,
                  fontWeight: 600,
                }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
