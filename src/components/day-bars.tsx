"use client";

import { useEffect, useState } from "react";
import { byDay, won, type Tx } from "@/lib/ledger";

export default function DayBars({
  items,
  month,
  today,
}: {
  items: Tx[];
  month: string;
  today: string;
}) {
  const rows = byDay(items, month);
  const [drawn, setDrawn] = useState(false);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // 월세 한 건이 나머지를 다 눌러버리므로 상위 10%는 잘라내고 눈금을 잡는다.
  const vals = rows
    .flatMap((r) => [r.income, r.expense])
    .filter((v) => v > 0)
    .sort((a, b) => a - b);
  const peak = Math.max(1, vals[Math.floor(vals.length * 0.88)] ?? 1);
  const todayDay = today.startsWith(month) ? Number(today.slice(8, 10)) : -1;
  const active = hover != null ? rows[hover] : null;

  return (
    <section
      className="lacquer-card gilt-corners anim-rise px-5 py-6 sm:px-6"
      style={{ animationDelay: "380ms" }}
    >
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-lg font-bold tracking-[0.2em]">
          <span className="gilt">날마다</span>
        </h2>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-nacre-dim">
          {active
            ? `${active.day}일 · +${won(active.income)} / −${won(active.expense)}`
            : "daily flow"}
        </span>
      </div>

      <div className="mt-5 flex h-32 items-center gap-[2px]">
        {rows.map((r, i) => {
          const inH = Math.min(1, Math.sqrt(r.income / peak)) * 56;
          const exH = Math.min(1, Math.sqrt(r.expense / peak)) * 56;
          const isToday = r.day === todayDay;
          return (
            <div
              key={r.day}
              onPointerEnter={() => setHover(i)}
              onPointerLeave={() => setHover(null)}
              className="group relative flex h-full min-w-0 flex-1 flex-col justify-center"
            >
              {/* 수입 — 중앙선 위로 */}
              <div className="flex h-14 items-end justify-center">
                <span
                  className="w-full max-w-[9px] rounded-t-[1px] transition-all duration-[600ms] ease-out"
                  style={{
                    height: drawn ? `${Math.max(inH, r.income ? 3 : 0)}px` : 0,
                    background: "linear-gradient(180deg,#7ff0cb,#2e9d7c)",
                    boxShadow: r.income ? "0 0 9px rgba(79,212,171,0.55)" : "none",
                    transitionDelay: `${i * 14}ms`,
                  }}
                />
              </div>

              {/* 중앙 괘선 */}
              <span
                className={`h-px w-full ${isToday ? "bg-gold" : "bg-[rgba(255,235,200,0.13)]"}`}
              />

              {/* 지출 — 아래로 */}
              <div className="flex h-14 items-start justify-center">
                <span
                  className="w-full max-w-[9px] rounded-b-[1px] transition-all duration-[600ms] ease-out"
                  style={{
                    height: drawn ? `${Math.max(exH, r.expense ? 3 : 0)}px` : 0,
                    background: "linear-gradient(0deg,#ff8f6a,#c93d24)",
                    boxShadow: r.expense ? "0 0 9px rgba(239,106,74,0.5)" : "none",
                    transitionDelay: `${i * 14}ms`,
                  }}
                />
              </div>

              {/* 오늘 표시 */}
              {isToday && (
                <span className="anim-glow pointer-events-none absolute inset-x-0 top-1/2 h-8 -translate-y-1/2 bg-[radial-gradient(circle,rgba(224,179,84,0.4),transparent_70%)]" />
              )}

              {/* 호버 기둥 */}
              <span className="pointer-events-none absolute inset-y-0 left-1/2 w-[18px] -translate-x-1/2 bg-[rgba(255,235,200,0.06)] opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex justify-between font-mono text-[9px] uppercase tracking-[0.25em] text-nacre-dim">
        <span>1</span>
        <span className="text-jade">수입 ↑</span>
        <span className="text-cinnabar">↓ 지출</span>
        <span>{rows.length}</span>
      </div>
    </section>
  );
}
