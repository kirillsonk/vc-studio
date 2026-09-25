"use client";
import React from "react";
import type { BottleOptions } from "./bottle-scene";

import { COLORS, type BottleSelection } from "./order-model";
const SIZES = [
  { id: "500", name: "500 мл", price: 1990 },
  { id: "750", name: "750 мл", price: 2390 },
] as const;
const CAPS = [
  { id: "classic", name: "Классическая", price: 0 },
  { id: "sport", name: "Спортивная", price: 300 },
] as const;

const money = (v: number) => new Intl.NumberFormat("ru-RU").format(Math.round(v)) + " ₽";

/** Eases a displayed number toward its target, so the price visibly recalculates */
function useTween(target: number) {
  const [shown, setShown] = React.useState(target);
  const from = React.useRef(target);
  React.useEffect(() => {
    const start = from.current;
    if (start === target) return;
    let frame = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 500);
      const v = start + (target - start) * (1 - Math.pow(1 - p, 3));
      setShown(v);
      from.current = v;
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);
  return shown;
}

export function Configurator({selection,onChange,onAdd}:{selection:BottleSelection;onChange:(value:BottleSelection)=>void;onAdd:()=>void}) {
  const host = React.useRef<HTMLDivElement>(null);
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const scene = React.useRef<{ update: (o: BottleOptions) => void; dispose: () => void } | null>(null);
  const color = COLORS.find(c=>c.id===selection.color)!;
  const size = SIZES.find(s=>s.id===selection.size)!;
  const cap = CAPS.find(c=>c.id===selection.cap)!;
  const [ready, setReady] = React.useState(false);

  const options: BottleOptions = { color: color.value, size: size.id, cap: cap.id };
  const optionsRef = React.useRef(options);
  optionsRef.current = options;

  React.useEffect(() => {
    let cancelled = false;
    import("./bottle-scene")
      .then(({ createBottleScene }) => {
        if (cancelled || !host.current || !canvas.current) return;
        try {
          scene.current = createBottleScene(host.current, canvas.current, optionsRef.current);
          setReady(true);
        } catch {
          /* WebGL unavailable: the options and price still work */
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      scene.current?.dispose();
      scene.current = null;
    };
  }, []);

  React.useEffect(() => {
    scene.current?.update(options);
  }, [options.color, options.size, options.cap]); // eslint-disable-line react-hooks/exhaustive-deps

  const price = useTween(size.price + cap.price);

  return (
    <div className="configurator">
      <div className="configurator-stage" ref={host} data-ready={ready}>
        <canvas ref={canvas} aria-label={`Бутылка, цвет ${color.name}, ${size.name}, крышка ${cap.name.toLowerCase()}`} role="img" />
        <span className="configurator-hint">Потяните, чтобы повернуть</span>
      </div>
      <div className="configurator-panel">
        <h3>Термобутылка</h3>
        <fieldset>
          <legend>
            Цвет <span>{color.name}</span>
          </legend>
          <div className="swatches">
            {COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                className="swatch"
                style={{ "--swatch": c.value } as React.CSSProperties}
                aria-label={c.name}
                aria-pressed={c.id === color.id}
                onClick={() => onChange({...selection,color:c.id})}
              />
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>Объем</legend>
          <div className="segmented">
            {SIZES.map((s) => (
              <button key={s.id} type="button" aria-pressed={s.id === size.id} onClick={() => onChange({...selection,size:s.id})}>
                {s.name}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>Крышка</legend>
          <div className="segmented">
            {CAPS.map((c) => (
              <button key={c.id} type="button" aria-pressed={c.id === cap.id} onClick={() => onChange({...selection,cap:c.id})}>
                {c.name}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="configurator-price">
          <strong data-num>{money(price)}</strong>
          <span>Цена пересчитывается сразу</span>
          <button type="button" className="order-primary" onClick={onAdd}>В корзину <span aria-hidden="true">↗</span></button>
        </div>
      </div>
    </div>
  );
}
