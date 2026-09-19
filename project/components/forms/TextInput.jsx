import React from 'react';
import { inputBox } from './inputBox.js';

/** Single-line field, 56px, white, 1px line; focus = blue border + soft ring. Numeric inputs get tabular figures. */
export function TextInput({ error, disabled, prefix, suffix, type = 'text', style, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const numeric = type === 'number' || rest.inputMode === 'numeric' || rest.inputMode === 'decimal';
  const el = <input type={type} disabled={disabled} aria-invalid={error || undefined} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} style={{ ...inputBox(focus, error, disabled), height: 'var(--input-h)', fontFeatureSettings: numeric ? 'var(--num-features)' : undefined, paddingLeft: prefix ? 40 : 16, paddingRight: suffix ? 44 : 16, ...style }} {...rest} />;
  if (!prefix && !suffix) return el;
  const side = { position: 'absolute', top: 0, bottom: 0, display: 'flex', alignItems: 'center', color: 'var(--text-3)', font: 'var(--type-body)', pointerEvents: 'none' };
  return <div style={{ position: 'relative', width: '100%' }}>{prefix && <span style={{ ...side, left: 14 }}>{prefix}</span>}{el}{suffix && <span style={{ ...side, right: 14 }}>{suffix}</span>}</div>;
}
