'use client';

import React from 'react';

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  label?: React.ReactNode;
  style?: React.CSSProperties;
}

/** Checkbox with label; checked = brand vermilion. */
export function Checkbox({ checked, defaultChecked, onChange, disabled, label, style }: CheckboxProps) {
  const [inner, setInner] = React.useState(!!defaultChecked);
  const on = checked !== undefined ? checked : inner;
  const toggle = (e: React.ChangeEvent<HTMLInputElement>) => { if (disabled) return; if (checked === undefined) setInner(e.target.checked); onChange && onChange(e); };
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 12, cursor: disabled ? 'not-allowed' : 'pointer', color: disabled ? 'var(--disabled-text)' : 'var(--text)', font: 'var(--type-body-sm)', ...style }}>
      <span style={{ position: 'relative', width: 20, height: 20, flex: 'none' }}>
        <input type="checkbox" checked={on} onChange={toggle} disabled={disabled} style={{ position: 'absolute', inset: 0, opacity: 0, margin: 0, cursor: 'inherit' }} />
        <span aria-hidden style={{ position: 'absolute', inset: 0, borderRadius: 'var(--radius-sm)', border: `1px solid ${on ? 'var(--brand)' : 'var(--line-strong)'}`, background: disabled ? 'var(--disabled-bg)' : on ? 'var(--brand)' : 'var(--surface)', transition: 'all var(--dur-micro) var(--ease)', display: 'grid', placeItems: 'center' }}>
          {on && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
        </span>
      </span>
      {label && <span>{label}</span>}
    </label>
  );
}
