'use client';

import React from 'react';

export interface DemoBlockProps {
  title?: string;
  meta?: string;
  poster?: React.ReactNode;
  ratio?: string;
  cta?: string;
  autoload?: boolean;
  loadingText?: string;
  /** dark contrast surface — at most one per page */
  dark?: boolean;
  children?: React.ReactNode;
  onStart?: () => void;
  style?: React.CSSProperties;
}

/** Frame for a live demo (WebGL, game, interactive). Idle poster with a run button; loading; then children mount. Light chrome; dark only when `dark`. */
export function DemoBlock({ title, meta, poster, ratio = '16/9', cta = 'Запустить демо', autoload = false, loadingText = 'Загружаем сцену', dark = false, children, onStart, style }: DemoBlockProps) {
  const [state, setState] = React.useState<'idle' | 'loading' | 'live'>(autoload ? 'loading' : 'idle');
  React.useEffect(() => { if (state === 'loading') { const t = setTimeout(() => setState('live'), 1100); return () => clearTimeout(t); } }, [state]);
  const start = () => { setState('loading'); onStart && onStart(); };
  const bg = dark ? 'var(--contrast)' : 'var(--surface)', fg2 = dark ? 'var(--contrast-ink-2)' : 'var(--text-2)', ln = dark ? 'var(--contrast-line)' : 'var(--line)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, ...style }}>
      <div style={{ position: 'relative', aspectRatio: ratio, borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: `1px solid ${state === 'live' ? 'var(--brand)' : ln}`, background: bg, transition: 'border-color var(--dur-ui)' }}>
        {state === 'live' ? children : (
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
            {poster}
            {state === 'idle' ? (
              <button type="button" onClick={start} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 10, height: 'var(--control-h-lg)', padding: '0 24px 0 18px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer', background: 'var(--brand)', color: '#fff', font: '500 17px/1 var(--font-sans)' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" />
              </svg>{cta}</button>
            ) : (
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12, font: 'var(--type-body-sm)', color: fg2 }}><span style={{ width: 14, height: 14, borderRadius: '50%', border: '1.5px solid var(--brand)', borderRightColor: 'transparent', animation: 'vc-spin .8s linear infinite' }} />{loadingText}</div>
            )}
          </div>
        )}
      </div>
      {(title || meta) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, paddingTop: 14 }}>
          <span style={{ font: 'var(--type-body-sm)', color: 'var(--text)' }}>{title}</span>
          <span data-num style={{ display: 'flex', alignItems: 'center', gap: 8, font: 'var(--type-caption)', color: state === 'live' ? 'var(--positive)' : 'var(--text-3)', fontFeatureSettings: 'var(--num-features)' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: state === 'live' ? 'var(--positive)' : 'var(--line-strong)' }} />{state === 'live' ? (meta || 'Live') : 'Превью'}</span>
        </div>
      )}
    </div>
  );
}
