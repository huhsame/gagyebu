"use client";

import CountUp from "@/components/count-up";
import { useTilt } from "@/hooks/use-tilt";

type Props = { income: number; expense: number };

type Cell = {
  label: string;
  hanja: string;
  en: string;
  value: number;
  tone: string;
  glow: string;
  ring: string;
};

function StatCard({ cell, delay }: { cell: Cell; delay: number }) {
  const tilt = useTilt(6);

  return (
    <div
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
      className="lacquer-card tilt anim-rise group relative overflow-hidden px-5 py-6 sm:px-6 sm:py-7"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* 커서를 따라오는 카드 내부 광 */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(14rem 14rem at var(--gx,50%) var(--gy,50%), ${cell.glow}, transparent 70%)`,
        }}
      />

      {/* 배경 한자 — 크게 깔고 거의 안 보이게 */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-6 -right-2 font-seal text-[6.5rem] leading-none text-[rgba(255,235,200,0.045)] transition-transform duration-700 group-hover:scale-110"
      >
        {cell.hanja}
      </span>

      <div className="relative flex items-center gap-2">
        <span className={`h-1.5 w-1.5 rotate-45 ${cell.ring}`} />
        <span className="font-display text-[13px] font-bold tracking-[0.3em] text-nacre-soft">
          {cell.label}
        </span>
        <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.3em] text-nacre-dim">
          {cell.en}
        </span>
      </div>

      <p className="relative mt-3 flex items-baseline gap-1 truncate">
        <CountUp
          value={cell.value}
          className={`font-mono text-2xl sm:text-[1.75rem] lg:text-[2.1rem] ${cell.tone}`}
        />
        <span className="font-display text-sm text-nacre-dim">원</span>
      </p>
    </div>
  );
}

export default function SummaryBand({ income, expense }: Props) {
  const balance = income - expense;

  const cells: Cell[] = [
    {
      label: "수입",
      hanja: "收",
      en: "income",
      value: income,
      tone: "text-jade",
      glow: "rgba(79,212,171,0.16)",
      ring: "bg-jade shadow-[0_0_10px_#4fd4ab]",
    },
    {
      label: "지출",
      hanja: "支",
      en: "expense",
      value: expense,
      tone: "text-cinnabar",
      glow: "rgba(239,106,74,0.16)",
      ring: "bg-cinnabar shadow-[0_0_10px_#ef6a4a]",
    },
    {
      label: "남은 돈",
      hanja: "殘",
      en: "balance",
      value: balance,
      tone: balance < 0 ? "text-cinnabar" : "gilt",
      glow: "rgba(224,179,84,0.18)",
      ring: "bg-gold shadow-[0_0_10px_#e0b354]",
    },
  ];

  return (
    <section className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
      {cells.map((c, i) => (
        <StatCard key={c.en} cell={c} delay={180 + i * 90} />
      ))}
    </section>
  );
}
