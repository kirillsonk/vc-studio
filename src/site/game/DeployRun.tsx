'use client';

import React from 'react';

/**
 * Deploy Run — the studio's own demonstration project, not a client case.
 *
 * Thirty seconds, one rule: hit the deploy window while it is under the marker.
 * Every hit narrows the window and speeds the marker up, so the run gets harder
 * the better it goes. The playfield is a real canvas; the HUD stays in the DOM so
 * the numbers keep the site's tabular figures and typography.
 */

const DURATION = 30;
const ZONE_START = 0.22;
const ZONE_MIN = 0.055;
const ZONE_MISS_RELIEF = 0.03;
const SPEED_START = 0.5;
const SPEED_MAX = 1.9;
const TRACK_PAD = 0.06;
const STORE_KEY = 'vc-deploy-run-scores';

type Phase = 'countdown' | 'playing' | 'over';

interface Palette { ink: string; line: string; brand: string; positive: string; error: string; muted: string }

function readPalette(): Palette {
  const s = getComputedStyle(document.documentElement);
  const v = (n: string, fallback: string) => s.getPropertyValue(n).trim() || fallback;
  return {
    ink: v('--contrast-ink', '#F5F5F2'),
    line: v('--contrast-line', '#2A2C30'),
    brand: v('--vermilion', '#D9451A'),
    positive: v('--green', '#0FAF7A'),
    error: v('--red', '#B3213C'),
    muted: v('--contrast-ink-2', '#A3A6AC'),
  };
}

function loadScores(): number[] {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(n => typeof n === 'number').slice(0, 3) : [];
  } catch { return []; }
}

function saveScore(score: number): number[] {
  const next = [...loadScores(), score].sort((a, b) => b - a).slice(0, 3);
  try { localStorage.setItem(STORE_KEY, JSON.stringify(next)); } catch { /* private mode */ }
  return next;
}

/** Deterministic, so the same run always shows the same code */
const promoCode = (score: number) => 'VC-' + score.toString(36).toUpperCase().padStart(4, '0');

export function DeployRun() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = React.useState<Phase>('countdown');
  const [count, setCount] = React.useState(3);
  const [score, setScore] = React.useState(0);
  const [combo, setCombo] = React.useState(1);
  const [left, setLeft] = React.useState(DURATION);
  const [best, setBest] = React.useState<number[]>([]);
  const [shipped, setShipped] = React.useState(0);

  // Everything the animation loop touches lives in a ref: state would re-render 60x a second
  const run = React.useRef({
    pos: 0, dir: 1, speed: SPEED_START, zone: ZONE_START, center: 0.5,
    score: 0, combo: 1, shipped: 0, flash: 0, flashOk: true, endsAt: 0, phase: 'countdown' as Phase,
  });

  React.useEffect(() => { setBest(loadScores()); canvasRef.current?.focus({ preventScroll: true }); }, []);

  React.useEffect(() => {
    if (phase !== 'countdown') return;
    if (count === 0) {
      const r = run.current;
      r.phase = 'playing';
      r.endsAt = performance.now() + DURATION * 1000;
      setPhase('playing');
      return;
    }
    const t = setTimeout(() => setCount(c => c - 1), 700);
    return () => clearTimeout(t);
  }, [phase, count]);

  const hit = React.useCallback(() => {
    const r = run.current;
    if (r.phase !== 'playing') return;
    const ok = Math.abs(r.pos - r.center) <= r.zone / 2;
    r.flash = 1;
    r.flashOk = ok;
    if (ok) {
      const gain = 100 * r.combo;
      r.score += gain;
      r.combo += 1;
      r.shipped += 1;
      r.zone = Math.max(ZONE_MIN, r.zone * 0.9);
      r.speed = Math.min(SPEED_MAX, r.speed * 1.06);
      setScore(r.score);
      setCombo(r.combo);
      setShipped(r.shipped);
    } else {
      r.combo = 1;
      r.zone = Math.min(ZONE_START, r.zone + ZONE_MISS_RELIEF);
      setCombo(1);
    }
    // Move the window somewhere new, never so close to the marker that it is a free hit
    let next = 0;
    do { next = TRACK_PAD + Math.random() * (1 - TRACK_PAD * 2); } while (Math.abs(next - r.pos) < r.zone);
    r.center = next;
  }, []);



  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const palette = readPalette();

    let w = 0, h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;
    let prev = performance.now();
    const draw = (now: number) => {
      const dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;
      const r = run.current;

      if (r.phase === 'playing') {
        r.pos += r.dir * r.speed * dt;
        if (r.pos > 1 - TRACK_PAD) { r.pos = 1 - TRACK_PAD; r.dir = -1; }
        if (r.pos < TRACK_PAD) { r.pos = TRACK_PAD; r.dir = 1; }
        const remaining = Math.max(0, (r.endsAt - now) / 1000);
        setLeft(Math.ceil(remaining));
        if (remaining <= 0) {
          r.phase = 'over';
          setPhase('over');
          setBest(saveScore(r.score));
        }
      }
      r.flash = Math.max(0, r.flash - dt * 3);

      const x0 = w * TRACK_PAD, x1 = w * (1 - TRACK_PAD), span = x1 - x0;
      const midY = h * 0.44;
      const shipY = h * 0.8;
      const barH = Math.min(72, h * 0.34);

      ctx.clearRect(0, 0, w, h);

      // Track: the brand's production trace, laid flat
      ctx.strokeStyle = palette.line;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x0, midY);
      ctx.lineTo(x1, midY);
      ctx.stroke();

      // Ticks give the sweep a sense of distance
      ctx.globalAlpha = 0.5;
      for (let i = 0; i <= 24; i++) {
        const tx = x0 + (span / 24) * i;
        const tall = i % 6 === 0;
        ctx.fillStyle = palette.line;
        ctx.fillRect(tx, midY + barH / 2 + 14, 1, tall ? 10 : 5);
      }
      ctx.globalAlpha = 1;

      // Every shipped deploy adds a node to the trace below — the run's own timeline
      ctx.strokeStyle = palette.line;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x0, shipY);
      ctx.lineTo(x1, shipY);
      ctx.stroke();
      const nodes = Math.min(r.shipped, 24);
      if (nodes > 0) {
        const step = span / 24;
        ctx.strokeStyle = palette.positive;
        ctx.beginPath();
        ctx.moveTo(x0, shipY);
        ctx.lineTo(x0 + step * nodes, shipY);
        ctx.stroke();
        for (let i = 1; i <= nodes; i++) {
          ctx.fillStyle = palette.positive;
          ctx.beginPath();
          ctx.arc(x0 + step * i, shipY, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Deploy window
      const zw = span * r.zone;
      const zx = x0 + span * r.center - zw / 2;
      ctx.fillStyle = palette.brand;
      ctx.globalAlpha = 0.18;
      ctx.fillRect(zx, midY - barH / 2, zw, barH);
      ctx.globalAlpha = 1;
      ctx.fillRect(zx, midY - barH / 2, zw, 2);
      ctx.fillRect(zx, midY + barH / 2 - 2, zw, 2);

      // Marker, green while it is inside the window
      const mx = x0 + span * r.pos;
      const inside = Math.abs(r.pos - r.center) <= r.zone / 2;
      ctx.fillStyle = inside ? palette.positive : palette.ink;
      ctx.fillRect(mx - 1, midY - barH / 2 - 10, 2, barH + 20);

      // Hit or miss feedback, fading out
      if (r.flash > 0) {
        ctx.globalAlpha = r.flash * 0.5;
        ctx.strokeStyle = r.flashOk ? palette.positive : palette.error;
        ctx.lineWidth = 2;
        ctx.strokeRect(zx - 6, midY - barH / 2 - 6, zw + 12, barH + 12);
        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  const restart = () => {
    run.current = { pos: 0, dir: 1, speed: SPEED_START, zone: ZONE_START, center: 0.5, score: 0, combo: 1, shipped: 0, flash: 0, flashOk: true, endsAt: 0, phase: 'countdown' };
    setScore(0); setCombo(1); setShipped(0); setLeft(DURATION); setCount(3); setPhase('countdown');
  };

  const hud = { font: 'var(--type-caption)', color: 'var(--contrast-ink-2)' } as const;
  const num = { font: 'var(--type-num-sm)', letterSpacing: 'var(--track-num)', fontFeatureSettings: 'var(--num-features)', color: 'var(--contrast-ink)' } as const;

  return (
    <div className="deploy-game" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24, padding: '20px 24px', borderBottom: '1px solid var(--contrast-line)' }}>
        <div style={{ display: 'flex', gap: 32 }}>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><span data-num style={num}>{score.toLocaleString('ru-RU')}</span><span style={hud}>счет</span></span>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><span data-num style={{ ...num, color: combo > 1 ? 'var(--positive)' : 'var(--contrast-ink)' }}>x{combo}</span><span style={hud}>серия</span></span>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><span data-num style={num}>{shipped}</span><span style={hud}>деплоев</span></span>
        </div>
        <span style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}><span data-num style={{ ...num, color: left <= 5 ? 'var(--brand)' : 'var(--contrast-ink)' }}>{left}</span><span style={hud}>секунд</span></span>
      </div>

      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
        <canvas
          ref={canvasRef}
          tabIndex={0}
          role="button"
          aria-label="Поле Deploy Run. Нажмите пробел или Enter, когда маркер находится в окне деплоя"
          onKeyDown={e => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); hit(); } }}
          onPointerDown={e => { e.preventDefault(); e.currentTarget.focus(); hit(); }}
          style={{ width: '100%', height: '100%', display: 'block', cursor: phase === 'playing' ? 'pointer' : 'default', touchAction: 'manipulation' }}
        />

        {phase === 'countdown' && (
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(17,18,20,.72)' }}>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span data-num style={{ font: 'var(--type-num-xl)', letterSpacing: 'var(--track-num)', color: 'var(--contrast-ink)' }}>{count === 0 ? 'GO' : count}</span>
              <span style={{ font: 'var(--type-body-sm)', color: 'var(--contrast-ink-2)', maxWidth: 320 }}>Жмите, когда маркер внутри окна. Каждое попадание сужает окно и ускоряет маркер</span>
            </div>
          </div>
        )}

        {phase === 'over' && (
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(17,18,20,.86)', padding: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center', textAlign: 'center', maxWidth: 420 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span data-num style={{ font: 'var(--type-num-lg)', letterSpacing: 'var(--track-num)', color: 'var(--contrast-ink)', fontFeatureSettings: 'var(--num-features)' }}>{score.toLocaleString('ru-RU')}</span>
                <span style={{ font: 'var(--type-body-sm)', color: 'var(--contrast-ink-2)' }}>{shipped} успешных деплоев за 30 секунд</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
                <span style={{ font: 'var(--type-caption)', color: 'var(--contrast-ink-2)', textTransform: 'uppercase', letterSpacing: '.04em' }}>Демонстрационный код</span>
                <span data-num style={{ font: 'var(--type-h4)', letterSpacing: '.08em', color: 'var(--positive)', border: '1px solid var(--contrast-line)', borderRadius: 'var(--radius-md)', padding: '12px 16px' }}>{promoCode(score)}</span>
              </div>
              {best.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
                  <span style={{ font: 'var(--type-caption)', color: 'var(--contrast-ink-2)', textTransform: 'uppercase', letterSpacing: '.04em' }}>Рекорды на этом устройстве</span>
                  {best.map((b, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: i < best.length - 1 ? '1px solid var(--contrast-line)' : 'none' }}>
                      <span data-num style={{ font: 'var(--type-body-sm)', color: 'var(--contrast-ink-2)' }}>{String(i + 1).padStart(2, '0')}</span>
                      <span data-num style={{ font: 'var(--type-body-sm)', color: b === score ? 'var(--positive)' : 'var(--contrast-ink)', fontFeatureSettings: 'var(--num-features)' }}>{b.toLocaleString('ru-RU')}</span>
                    </div>
                  ))}
                </div>
              )}
              <button type="button" onClick={restart} style={{ height: 'var(--control-h-md)', padding: '0 22px', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--brand)', color: '#fff', font: 'var(--type-label)', fontFamily: 'var(--font-sans)', cursor: 'pointer' }}>Сыграть еще раз</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
