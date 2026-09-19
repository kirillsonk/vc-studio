import React from 'react';

const sizes = { sm: ['var(--control-h-sm)', 16, 'var(--type-label-sm)'], md: ['var(--control-h-md)', 22, 'var(--type-label)'], lg: ['var(--control-h-lg)', 28, '500 17px/1 var(--font-sans)'] };

/** Primary (blue) / secondary (1px border) / tertiary (text with animated baseline). Labels are verbs, no trailing arrows. */
export function Button({ variant = 'primary', size = 'md', disabled, loading, icon, iconRight, full, children, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const [h, px, font] = sizes[size] || sizes.md;
  const off = disabled || loading;
  const base = { display: full ? 'flex' : 'inline-flex', width: full ? '100%' : undefined, alignItems: 'center', justifyContent: 'center', gap: 10, height: variant === 'tertiary' ? 'auto' : h, padding: variant === 'tertiary' ? '4px 0' : `0 ${px}px`, font, fontFamily: 'var(--font-sans)', borderRadius: variant === 'tertiary' ? 0 : 'var(--radius-md)', border: '1px solid transparent', cursor: off ? 'not-allowed' : 'pointer', transition: 'background var(--dur-micro) var(--ease), color var(--dur-micro) var(--ease), border-color var(--dur-micro) var(--ease), transform var(--dur-micro) var(--ease)', transform: press && !off ? 'translateY(1px)' : 'none', whiteSpace: 'nowrap', boxSizing: 'border-box', textDecoration: 'none', position: 'relative' };
  let look;
  if (off) look = variant === 'primary' ? { background: 'var(--disabled-bg)', color: 'var(--disabled-text)' } : { background: 'transparent', color: 'var(--disabled-text)', borderColor: variant === 'secondary' ? 'var(--line)' : 'transparent' };
  else if (variant === 'primary') look = { background: press ? 'var(--brand-press)' : hover ? 'var(--brand-hover)' : 'var(--brand)', color: 'var(--text-on-brand)' };
  else if (variant === 'secondary') look = { background: hover ? 'var(--surface)' : 'transparent', color: 'var(--text)', borderColor: hover ? 'var(--text)' : 'var(--line-strong)' };
  else look = { background: 'transparent', color: hover ? 'var(--brand)' : 'var(--text)' };
  return (
    <button type="button" disabled={off} aria-busy={loading || undefined} style={{ ...base, ...look, ...style }} onMouseEnter={() => setHover(true)} onMouseLeave={() => { setHover(false); setPress(false); }} onMouseDown={() => setPress(true)} onMouseUp={() => setPress(false)} {...rest}>
      {loading ? <span aria-hidden style={{ width: 14, height: 14, borderRadius: '50%', border: '1.5px solid currentColor', borderRightColor: 'transparent', animation: 'vc-spin .8s linear infinite' }}><style>{`@keyframes vc-spin{to{transform:rotate(360deg)}}`}</style></span> : icon}
      <span>{children}</span>
      {!loading && iconRight}
      {variant === 'tertiary' && !off && <span aria-hidden style={{ position: 'absolute', left: 0, bottom: 0, height: 1, width: '100%', background: 'currentColor', transform: hover ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: hover ? 'left' : 'right', transition: 'transform var(--dur-ui) var(--ease)' }} />}
    </button>
  );
}
