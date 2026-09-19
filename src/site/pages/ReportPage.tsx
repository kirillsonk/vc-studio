'use client';

import React from 'react';
import { Button, Counter, Ledger, Stat } from '@/components';
import { Container } from '../Chrome';
import { REPORT_MODELS, REPORT_STAGES } from '../data';
import { ROUTES } from '../constants';
import { useGo } from '../navigation';

export function ReportPage() {
  const go = useGo();
  const ai = REPORT_STAGES.reduce((a, r) => a + r[1], 0);
  const team = REPORT_STAGES.reduce((a, r) => a + r[2], 0);
  const [detail, setDetail] = React.useState(false);
  const cell: React.CSSProperties = { padding: '16px 0', borderBottom: '1px solid var(--line)', font: 'var(--type-body)', textAlign: 'left' };
  const num: React.CSSProperties = { ...cell, textAlign: 'right', fontFeatureSettings: 'var(--num-features)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' };
  const th: React.CSSProperties = { ...cell, padding: '0 0 12px', font: 'var(--type-caption)', color: 'var(--text-3)', borderBottom: '1px solid var(--text)' };
  return (
    <main>
      <Container style={{ paddingTop: 64, display: 'flex', flexDirection: 'column', gap: 40 }}>
        <Button variant="tertiary" size="sm" onClick={() => go(ROUTES.case)} style={{ alignSelf: 'flex-start' }}>К кейсу</Button>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,7fr) minmax(0,5fr)', gap: 'var(--grid-gutter)', alignItems: 'end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <span data-num style={{ font: 'var(--type-index)', color: 'var(--text-3)', letterSpacing: '.04em' }}>FINAL REPORT · ДЕМО-ПРОЕКТ 01 · 14.09.2026</span>
            <h1 style={{ margin: 0, font: 'var(--type-h1)', letterSpacing: 'var(--track-h1)' }}>Из чего сложилась стоимость</h1>
          </div>
          <p className="pretty" style={{ margin: 0, font: 'var(--type-body-lg)', color: 'var(--text-2)' }}>До старта клиенту не нужно разбираться в моделях, токенах и AI-инструментах. После запуска мы показываем production изнутри: что использовали, сколько это стоило и за какую работу отвечала команда</p>
        </div>
      </Container>
      <Container style={{ paddingTop: 64 }}>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,5fr) minmax(0,7fr)', gap: 'var(--grid-gutter)', alignItems: 'start', paddingTop: 32, borderTop: '1px solid var(--text)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Counter value={ai + team} from={0} size="xl" suffix=" ₽" />
              <span style={{ font: 'var(--type-body)', color: 'var(--text-2)' }}>Итоговый бюджет</span>
            </div>
            <div className="grid3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 'var(--grid-gutter)' }}>
              <Stat value={8421388} label="токенов" size="sm" />
              <Stat value={143} label="сборок" size="sm" />
              <Stat value={9} suffix=" дней" label="production" size="sm" />
            </div>
          </div>
          <Ledger
            rows={[
              { label: 'AI-инфраструктура', sub: 'Claude · GPT · агентские сессии — по фактическому расходу', value: ai },
              { label: 'Production-команда', sub: 'архитектура, управление AI, review, QA, интеграции, деплой — зафиксировано до старта', value: team },
              { label: 'Поддержка 3 месяца', sub: 'до 14.12.2026', value: 'включено', tone: 'positive' },
            ]}
            total={ai + team}
            totalLabel="Итоговый бюджет"
          />
        </div>
      </Container>
      <Container style={{ paddingTop: 96 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 24, flexWrap: 'wrap', paddingBottom: 24 }}>
          <h2 style={{ margin: 0, font: 'var(--type-h3)', letterSpacing: 'var(--track-h3)' }}>По этапам</h2>
          <Button variant="tertiary" size="sm" onClick={() => setDetail(!detail)}>{detail ? 'Скрыть детализацию по моделям' : 'Показать детализацию по моделям'}</Button>
        </div>
        <div className="table-scroll">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr><th style={th}>Этап</th><th style={{ ...th, textAlign: 'right' }}>AI-расход</th><th style={{ ...th, textAlign: 'right' }}>Работа команды</th><th style={{ ...th, textAlign: 'right' }}>Итого</th></tr>
          </thead>
          <tbody>
            {REPORT_STAGES.map(r => (
              <tr key={r[0]}>
                <td style={cell}>{r[0]}</td>
                <td style={{ ...num, color: 'var(--text-2)' }}>{r[1].toLocaleString('ru-RU')} ₽</td>
                <td style={{ ...num, color: 'var(--text-2)' }}>{r[2].toLocaleString('ru-RU')} ₽</td>
                <td style={num}>{(r[1] + r[2]).toLocaleString('ru-RU')} ₽</td>
              </tr>
            ))}
            <tr>
              <td style={{ ...cell, borderBottom: 'none', font: 'var(--type-label)' }}>Итого</td>
              <td style={{ ...num, borderBottom: 'none' }}>{ai.toLocaleString('ru-RU')} ₽</td>
              <td style={{ ...num, borderBottom: 'none' }}>{team.toLocaleString('ru-RU')} ₽</td>
              <td style={{ ...num, borderBottom: 'none', font: 'var(--type-label)' }}>{(ai + team).toLocaleString('ru-RU')} ₽</td>
            </tr>
          </tbody>
        </table>
        </div>
        {detail && (
          <div className="table-scroll" style={{ marginTop: 48 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><th style={th}>Модель</th><th style={{ ...th, textAlign: 'right' }}>Input tokens</th><th style={{ ...th, textAlign: 'right' }}>Output tokens</th><th style={{ ...th, textAlign: 'right' }}>Cached</th><th style={{ ...th, textAlign: 'right' }}>Стоимость</th></tr>
            </thead>
            <tbody>
              {REPORT_MODELS.map(r => (
                <tr key={r[0]}>
                  <td style={cell}>{r[0]}</td>
                  {r.slice(1).map((v, i) => <td key={i} style={{ ...num, color: i === 3 ? 'var(--text)' : 'var(--text-2)' }}>{(v as number).toLocaleString('ru-RU')}{i === 3 ? ' ₽' : ''}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
        <p style={{ margin: '16px 0 0', font: 'var(--type-caption)', color: 'var(--text-3)' }}>Демонстрационные данные. Ставки моделей различаются; стоимость показана по фактическим тарифам провайдеров без наценки</p>
      </Container>
      <Container style={{ paddingTop: 96 }}>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,7fr) minmax(0,5fr)', gap: 'var(--grid-gutter)', alignItems: 'center', padding: '32px 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ font: 'var(--type-h4)', letterSpacing: 'var(--track-h4)' }}>3 месяца поддержки включены</span>
            <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-2)' }}>До 14.12.2026 — <span data-num style={{ color: 'var(--positive)' }}>0 ₽</span>. После от 5 000 ₽ в месяц</span>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <Button onClick={() => go(ROUTES.intake)} variant="secondary">Запустить похожий проект</Button>
            <Button>Скачать отчет</Button>
          </div>
        </div>
      </Container>
    </main>
  );
}
