import React from 'react';
import { inputBox } from './inputBox.js';

/** Native select styled like TextInput. */
export function Select({ error, disabled, options = [], placeholder, style, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <select disabled={disabled} aria-invalid={error || undefined} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} defaultValue={rest.value === undefined ? '' : undefined} style={{ ...inputBox(focus, error, disabled), height: 'var(--input-h)', appearance: 'none', paddingRight: 44, cursor: disabled ? 'not-allowed' : 'pointer', ...style }} {...rest}>
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map(o => typeof o === 'string' ? <option key={o} value={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-2)', pointerEvents: 'none' }}><path d="m6 9 6 6 6-6" /></svg>
    </div>
  );
}
