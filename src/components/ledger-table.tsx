"use client";

import { dayLabel, type Tx, won } from "@/lib/ledger";

type Props = {
  items: Tx[];
  onDelete: (id: string) => void;
};

export default function LedgerTable({ items, onDelete }: Props) {
  return (
    <section
      className="anim-rise flex min-h-[26rem] flex-col"
      style={{ animationDelay: "220ms" }}
    >
      <div className="flex items-baseline justify-between border-b border-ink/70 pb-2">
        <h2 className="font-display text-xl tracking-[0.14em]">장 부</h2>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-soft">
          {items.length} entries
        </span>
      </div>

      {items.length === 0 ? (
        <p className="flex flex-1 items-center justify-center py-16 text-center font-display text-sm leading-relaxed tracking-wide text-ink-soft">
          이 달엔 아직 아무것도 적히지 않았다.
          <br />
          왼쪽에서 한 줄 적어보자.
        </p>
      ) : (
        <ul>
          {items.map((t, i) => {
            const { md, weekday } = dayLabel(t.date);
            const expense = t.kind === "expense";
            return (
              <li
                key={t.id}
                className="anim-slip group relative flex items-center gap-3 border-b border-rule py-3 transition-colors duration-150 hover:bg-[rgba(255,253,246,0.65)] sm:gap-4"
                style={{ animationDelay: `${Math.min(i, 12) * 28}ms` }}
              >
                {/* 날짜 */}
                <div className="w-14 shrink-0 text-center sm:w-16">
                  <div className="font-mono text-sm tabular-nums leading-none">
                    {md}
                  </div>
                  <div className="mt-1 font-display text-[10px] text-ink-soft">
                    {weekday}
                  </div>
                </div>

                {/* 세로 괘선 */}
                <span
                  aria-hidden
                  className={`h-8 w-px shrink-0 ${expense ? "bg-vermilion/45" : "bg-pine/45"}`}
                />

                {/* 카테고리 · 메모 */}
                <div className="min-w-0 flex-1">
                  <span className="font-display text-[15px] tracking-wide">
                    {t.category}
                  </span>
                  {t.memo && (
                    <span className="ml-2 truncate text-[13px] text-ink-soft">
                      {t.memo}
                    </span>
                  )}
                </div>

                {/* 금액 */}
                <div
                  className={`shrink-0 font-mono text-[15px] tabular-nums sm:text-base ${
                    expense ? "text-vermilion" : "text-pine"
                  }`}
                >
                  {expense ? "−" : "+"}
                  {won(t.amount)}
                </div>

                <button
                  type="button"
                  onClick={() => onDelete(t.id)}
                  aria-label={`${t.category} ${won(t.amount)}원 기록 지우기`}
                  className="-my-2 w-8 shrink-0 py-2 text-center font-mono text-sm text-ink-soft/35 transition-colors duration-150 hover:text-vermilion focus-visible:text-vermilion group-hover:text-ink-soft/75"
                >
                  ✕
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
