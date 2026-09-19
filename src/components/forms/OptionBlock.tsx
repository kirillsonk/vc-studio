'use client';

import React from 'react';

export interface OptionBlockProps {
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  /** right-aligned small text, e.g. a range */
  meta?: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

/** Rectangular option for single/multi choice (intake brief, project type). Selected = brand border + soft fill. Not a pill. */
export function OptionBlock({ selected, disabled, onClick, children, meta, style }: OptionBlockProps) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={!!selected}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, minHeight: 52, padding: '0 16px', textAlign: 'left', borderRadius: 'var(--radius-md)', font: 'var(--type-body-sm)', fontFamily: 'var(--font-sans)', cursor: disabled ? 'not-allowed' : 'pointer', boxSizing: 'border-box',
        border: `1px solid ${selected ? 'var(--brand)' : hover && !disabled ? 'var(--text)' : 'var(--line-strong)'}`, background: selected ? 'var(--brand-soft)' : 'var(--surface)', color: disabled ? 'var(--disabled-text)' : selected ? 'var(--brand)' : 'var(--text)', transition: 'all var(--dur-micro) var(--ease)', ...style,
      }}
    >
      <span>{children}</span>{meta && <span data-num style={{ font: 'var(--type-caption)', color: selected ? 'var(--brand)' : 'var(--text-3)' }}>{meta}</span>}
    </button>
  );
}
