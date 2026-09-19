import type { CSSProperties } from 'react';

/** Shared box styling for TextInput / Textarea / Select. */
export const inputBox = (focus: boolean, error?: boolean, disabled?: boolean): CSSProperties => ({
  width: '100%',
  boxSizing: 'border-box',
  background: disabled ? 'var(--disabled-bg)' : 'var(--surface)',
  color: disabled ? 'var(--disabled-text)' : 'var(--text)',
  border: `1px solid ${error ? 'var(--error)' : focus ? 'var(--brand)' : 'var(--line-strong)'}`,
  borderRadius: 'var(--radius-md)',
  font: 'var(--type-body)',
  fontFamily: 'var(--font-sans)',
  padding: '0 16px',
  outline: 'none',
  boxShadow: focus && !error ? '0 0 0 3px var(--brand-soft)' : 'none',
  transition: 'border-color var(--dur-micro) var(--ease), box-shadow var(--dur-micro) var(--ease)',
});
