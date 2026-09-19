import React from 'react';

/** Label above, hint or error below. Labels are plain, no floating. */
export function Field({ label, hint, error, required, htmlFor, children, style }) {
  return (
    <label htmlFor={htmlFor} style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }}>
      {label && <span style={{ font: 'var(--type-label-sm)', color: 'var(--text-2)' }}>{label}{required && <span style={{ color: 'var(--brand)' }}> *</span>}</span>}
      {children}
      {(error || hint) && <span style={{ font: 'var(--type-caption)', color: error ? 'var(--error)' : 'var(--text-3)' }}>{error || hint}</span>}
    </label>
  );
}
