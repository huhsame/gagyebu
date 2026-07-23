"use client";

import { won } from "@/lib/ledger";

type Props = { income: number; expense: number };

export default function SummaryBand({ income, expense }: Props) {
  const balance = income - expense;

  const cells = [
    { label: "수입", en: "income", value: income, tone: "text-pine" },
    { label: "지출", en: "expense", value: expense, tone: "text-vermilion" },
    {
      label: "남은 돈",
      en: "balance",
      value: balance,
      tone: balance < 0 ? "text-vermilion" : "text-ink",
    },
  ];

  return (
    <section className="anim-rise mt-8 grid grid-cols-2 border-y border-ink/25 sm:grid-cols-3">
      {cells.map((c, i) => (
        <div
          key={c.en}
          className={[
            "min-w-0 px-4 py-5 sm:px-6",
            i === 1 ? "border-l border-rule" : "",
            i === 2
              ? "col-span-2 border-t border-rule bg-[rgba(255,253,246,0.5)] sm:col-span-1 sm:border-t-0 sm:border-l"
              : "",
          ].join(" ")}
          style={{ animationDelay: `${180 + i * 70}ms` }}
        >
          <div className="flex items-baseline gap-2">
            <span className="font-display text-sm tracking-[0.2em] text-ink-soft">
              {c.label}
            </span>
            <span className="hidden font-mono text-[9px] uppercase tracking-[0.25em] text-ink-soft/60 sm:inline">
              {c.en}
            </span>
          </div>
          <p
            className={`mt-2 truncate font-mono text-lg tabular-nums sm:text-xl lg:text-3xl ${c.tone}`}
          >
            {c.value < 0 && "−"}
            {won(Math.abs(c.value))}
            <span className="ml-1 font-display text-sm text-ink-soft">원</span>
          </p>
        </div>
      ))}
    </section>
  );
}
