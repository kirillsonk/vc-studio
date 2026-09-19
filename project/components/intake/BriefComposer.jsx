import React from 'react';

/** Free-text answer field for the brief: white, 1px, blue send. Enter sends, Shift+Enter breaks. */
export function BriefComposer({ placeholder = 'Или напишите своими словами', value, onChange, onSend, disabled, style }) {
  const [inner, setInner] = React.useState(''); const [focus, setFocus] = React.useState(false);
  const text = value !== undefined ? value : inner;
  const set = v => { if (value === undefined) setInner(v); onChange && onChange(v); };
  const send = () => { if (!text.trim() || disabled) return; onSend && onSend(text.trim()); set(''); };
  const can = !!text.trim() && !disabled;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, padding: 6, background: 'var(--surface)', border: `1px solid ${focus ? 'var(--brand)' : 'var(--line-strong)'}`, borderRadius: 'var(--radius-md)', boxShadow: focus ? '0 0 0 3px var(--brand-soft)' : 'none', transition: 'all var(--dur-micro)', ...style }}>
      <textarea rows={1} value={text} disabled={disabled} placeholder={placeholder} onChange={e => set(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
        style={{ flex: 1, minHeight: 44, maxHeight: 160, padding: '12px 10px', resize: 'none', background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', font: 'var(--type-body)', fontFamily: 'var(--font-sans)', lineHeight: 1.3 }} />
      <button type="button" aria-label="Отправить ответ" onClick={send} disabled={!can} style={{ width: 44, height: 44, flex: 'none', borderRadius: 'var(--radius-sm)', border: 'none', cursor: can ? 'pointer' : 'not-allowed', background: can ? 'var(--brand)' : 'var(--disabled-bg)', color: can ? '#fff' : 'var(--disabled-text)', display: 'grid', placeItems: 'center', transition: 'background var(--dur-micro)' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5" /><path d="m5 12 7-7 7 7" /></svg></button>
    </div>
  );
}
