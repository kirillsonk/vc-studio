'use client';

import React from 'react';
import { inputBox } from './inputBox';

export interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  error?: boolean;
  disabled?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

/** Single-line field, 56px, white, 1px line; focus = brand border + soft ring. Numeric inputs get tabular figures. */
export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(function TextInput({ error, disabled, prefix, suffix, type = 'text', style, ...rest }, ref) {
  const [focus, setFocus] = React.useState(false);
  const numeric = type === 'number' || rest.inputMode === 'numeric' || rest.inputMode === 'decimal';
  const el = (
    <input
      ref={ref}
      type={type}
      disabled={disabled}
      aria-invalid={error || undefined}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={{ ...inputBox(focus, error, disabled), height: 'var(--input-h)', fontFeatureSettings: numeric ? 'var(--num-features)' : undefined, paddingLeft: prefix ? 40 : 16, paddingRight: suffix ? 44 : 16, ...style }}
      {...rest}
    />
  );
  if (!prefix && !suffix) return el;
  const side: React.CSSProperties = { position: 'absolute', top: 0, bottom: 0, display: 'flex', alignItems: 'center', color: 'var(--text-3)', font: 'var(--type-body)', pointerEvents: 'none' };
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {prefix && <span style={{ ...side, left: 14 }}>{prefix}</span>}
      {el}
      {suffix && <span style={{ ...side, right: 14 }}>{suffix}</span>}
    </div>
  );
});
