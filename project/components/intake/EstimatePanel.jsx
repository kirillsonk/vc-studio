import React from 'react';

/** Live estimate that assembles beside the brief: scope rows append as answers arrive; term and budget range fill in. Empty state until the first answer. */
export function EstimatePanel({ scope = [], term, budget, status = 'empty', onConfirm, confirmLabel = 'Получить точную оценку', style }) {
  const row = { display: 'flex', justifyContent: 'space-between', gap: 16, padding: '14px 0', borderBottom: '1px solid var(--line)', alignItems: 'baseline' };
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--radius-md)', padding: 24, display: 'flex', flexDirection: 'column', minWidth: 0, ...style }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingBottom: 12, borderBottom: '1px solid var(--text)' }}><span style={{ font: 'var(--type-index)', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.04em' }}>Предварительный scope</span>{status === 'thinking' && <span style={{ font: 'var(--type-caption)', color: 'var(--brand)' }}>Собираем scope</span>}{status === 'ready' && <span style={{ font: 'var(--type-caption)', color: 'var(--positive)' }}>Готово</span>}</div>
      {status === 'empty' && scope.length === 0 ? (
        <div style={{ padding: '40px 0 24px', display: 'flex', flexDirection: 'column', gap: 6 }}><span style={{ font: 'var(--type-body)', color: 'var(--text)' }}>Здесь появится предварительная оценка</span><span style={{ font: 'var(--type-body-sm)', color: 'var(--text-3)' }}>Ответьте на несколько вопросов о проекте.</span></div>
      ) : (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '16px 0', borderBottom: '1px solid var(--line)' }}>{scope.map((s, i) => <span key={s} style={{ font: 'var(--type-body-sm)', color: 'var(--text)', padding: '6px 10px', border: '1px solid var(--line-strong)', borderRadius: 'var(--radius-sm)', animation: 'vc-in var(--dur-ui) var(--ease) both', animationDelay: `${i * 40}ms` }}>{s}</span>)}<style>{`@keyframes vc-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}`}</style></div>
          <div style={row}><span style={{ font: 'var(--type-body-sm)', color: 'var(--text-2)' }}>Оценка срока</span><span data-num style={{ font: 'var(--type-body)', color: term ? 'var(--text)' : 'var(--text-3)', fontFeatureSettings: 'var(--num-features)' }}>{term || '—'}</span></div>
          <div style={{ ...row, borderBottom: 'none' }}><span style={{ font: 'var(--type-body-sm)', color: 'var(--text-2)' }}>Предварительный бюджет</span><span data-num style={{ font: 'var(--type-num-md)', letterSpacing: 'var(--track-num)', color: budget ? 'var(--text)' : 'var(--text-3)', fontFeatureSettings: 'var(--num-features)' }}>{budget || '—'}</span></div>
          {status === 'ready' && <><span style={{ font: 'var(--type-caption)', color: 'var(--text-3)', paddingBottom: 16 }}>Это автоматическая оценка. Перед стартом инженер проверит scope и подтвердит стоимость.</span><button type="button" onClick={onConfirm} style={{ height: 'var(--control-h-md)', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--brand)', color: '#fff', font: 'var(--type-label)', fontFamily: 'var(--font-sans)', cursor: 'pointer' }}>{confirmLabel}</button></>}
        </>
      )}
    </div>
  );
}
