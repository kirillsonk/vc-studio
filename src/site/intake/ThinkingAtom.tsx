/** Small version of the hero atom: three orbits with running trails and a copper nucleus */
export function ThinkingAtom({ size = 30 }: { size?: number }) {
  return (
    <svg className="thinking-atom" width={size} height={size} viewBox="-20 -20 40 40" aria-hidden="true">
      <defs>
        <radialGradient id="thinking-core" cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#F6C3A1" />
          <stop offset="0.5" stopColor="var(--brand)" />
          <stop offset="1" stopColor="#7A2A14" />
        </radialGradient>
      </defs>
      {[0, 60, 120].map((r, i) => (
        <g key={r} transform={`rotate(${r})`}>
          <ellipse className="thinking-orbit" rx="17" ry="6.2" />
          <ellipse className={`thinking-trail thinking-trail-${i}`} rx="17" ry="6.2" pathLength={100} />
        </g>
      ))}
      <circle className="thinking-core" r="3.6" fill="url(#thinking-core)" />
    </svg>
  );
}
