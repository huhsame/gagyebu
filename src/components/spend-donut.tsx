"use client";

import { useEffect, useState } from "react";
import { byCategory, won, type Tx } from "@/lib/ledger";

const NACRE = [
  "#6f9dff",
  "#4fd4ab",
  "#e07ac0",
  "#e0b354",
  "#ef6a4a",
  "#9fe9ff",
  "#b6a6ff",
  "#8fd46a",
  "#ff9f6a",
];

const R = 54;
const C = 2 * Math.PI * R;

export default function SpendDonut({ items }: { items: Tx[] }) {
  const { total, slices } = byCategory(items, "expense");
  const [hover, setHover] = useState<number | null>(null);
  const [drawn, setDrawn] = useState(false);

  // 마운트 다음 프레임에 호를 그린다 — dashoffset 트랜지션이 먹도록.
  useEffect(() => {
    const id = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const active = hover != null ? slices[hover] : null;

  // 각 호가 시작하는 지점 — 앞 조각들의 길이 합
  const starts = slices.map((_, i) =>
    slices.slice(0, i).reduce((a, s) => a + s.ratio * C, 0),
  );

  return (
    <section
      className="lacquer-card gilt-corners anim-rise flex flex-col px-5 py-6 sm:px-6"
      style={{ animationDelay: "300ms" }}
    >
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-lg font-bold tracking-[0.2em]">
          <span className="gilt">지출 갈래</span>
        </h2>
        <span className="font-seal text-xs tracking-[0.35em] text-nacre-dim">支出</span>
      </div>

      {total === 0 ? (
        <p className="flex flex-1 items-center justify-center py-12 text-center font-display text-sm text-nacre-dim">
          아직 쓴 게 없다.
        </p>
      ) : (
        <div className="mt-4 flex flex-col items-center gap-5 sm:flex-row sm:gap-6">
          <div className="relative shrink-0">
            <svg viewBox="0 0 140 140" className="h-[9.5rem] w-[9.5rem] -rotate-90">
              <defs>
                <filter id="donut-glow" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="3.2" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* 바탕 고리 */}
              <circle
                cx="70"
                cy="70"
                r={R}
                fill="none"
                stroke="rgba(255,235,200,0.07)"
                strokeWidth="15"
              />

              {slices.map((s, i) => {
                const len = s.ratio * C;
                const offset = -starts[i];
                const on = hover === i;
                return (
                  <circle
                    key={s.category}
                    cx="70"
                    cy="70"
                    r={R}
                    fill="none"
                    stroke={NACRE[i % NACRE.length]}
                    strokeWidth={on ? 21 : 15}
                    strokeLinecap="butt"
                    strokeDasharray={`${drawn ? Math.max(len - 2, 0) : 0} ${C}`}
                    strokeDashoffset={offset}
                    filter={on ? "url(#donut-glow)" : undefined}
                    opacity={hover == null || on ? 1 : 0.28}
                    onPointerEnter={() => setHover(i)}
                    onPointerLeave={() => setHover(null)}
                    className="cursor-pointer transition-all duration-500 ease-out"
                    style={{ transitionDelay: drawn ? "0ms" : `${i * 90}ms` }}
                  />
                );
              })}
            </svg>

            {/* 고리 한가운데 */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-seal text-[10px] tracking-[0.3em] text-nacre-dim">
                {active ? active.category : "합"}
              </span>
              <span className="mt-1 font-mono text-base tabular-nums text-nacre">
                {won(active ? active.amount : total)}
              </span>
              {active && (
                <span className="mt-0.5 font-mono text-[10px] text-gold">
                  {(active.ratio * 100).toFixed(1)}%
                </span>
              )}
            </div>
          </div>

          {/* 범례 */}
          <ul className="w-full min-w-0 space-y-1.5">
            {slices.slice(0, 6).map((s, i) => (
              <li
                key={s.category}
                onPointerEnter={() => setHover(i)}
                onPointerLeave={() => setHover(null)}
                className={`anim-slip flex cursor-default items-center gap-2.5 text-[13px] transition-opacity ${
                  hover != null && hover !== i ? "opacity-35" : "opacity-100"
                }`}
                style={{ animationDelay: `${380 + i * 55}ms` }}
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rotate-45"
                  style={{
                    background: NACRE[i % NACRE.length],
                    boxShadow: `0 0 10px ${NACRE[i % NACRE.length]}`,
                  }}
                />
                <span className="min-w-0 flex-1 truncate font-display tracking-wide">
                  {s.category}
                </span>
                <span className="font-mono text-[11px] tabular-nums text-nacre-soft">
                  {(s.ratio * 100).toFixed(0)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
