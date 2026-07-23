"use client";

import { dayLabel, type Tx, won } from "@/lib/ledger";

type Props = {
  items: Tx[];
  onDelete: (id: string) => void;
};

export default function LedgerTable({ items, onDelete }: Props) {
  return (
    <section
      className="lacquer-card gilt-corners anim-rise flex min-h-[30rem] flex-col px-5 py-6 sm:px-6"
      style={{ animationDelay: "260ms" }}
    >
      <div className="flex items-baseline justify-between border-b border-rule pb-3">
        <h2 className="font-display text-xl font-extrabold tracking-[0.22em]">
          <span className="gilt">장 부</span>
        </h2>
        <span className="flex items-center gap-2">
          <span className="font-seal text-xs tracking-[0.35em] text-nacre-dim">帳簿</span>
          <span className="border border-rule px-2 py-0.5 font-mono text-[10px] tabular-nums text-gold">
            {items.length}
          </span>
        </span>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
          <span
            aria-hidden
            className="anim-glow font-seal text-6xl text-[rgba(255,235,200,0.12)]"
          >
            空
          </span>
          <p className="font-display text-sm leading-relaxed tracking-wide text-nacre-dim">
            이 달엔 아직 아무것도 적히지 않았다.
            <br />
            왼쪽에서 한 줄 적어보자.
          </p>
        </div>
      ) : (
        <ul className="mt-1 max-h-[34rem] overflow-y-auto pr-1">
          {items.map((t, i) => {
            const { md, weekday } = dayLabel(t.date);
            const expense = t.kind === "expense";
            return (
              <li
                key={t.id}
                className="anim-slip row-sweep group relative flex items-center gap-3 border-b border-[rgba(255,235,200,0.07)] py-3 sm:gap-4"
                style={{ animationDelay: `${Math.min(i, 14) * 32}ms` }}
              >
                {/* 왼쪽 색 기둥 */}
                <span
                  aria-hidden
                  className={`absolute left-0 top-1/2 h-0 w-[2px] -translate-y-1/2 transition-all duration-300 group-hover:h-[70%] ${
                    expense
                      ? "bg-cinnabar shadow-[0_0_12px_#ef6a4a]"
                      : "bg-jade shadow-[0_0_12px_#4fd4ab]"
                  }`}
                />

                {/* 날짜 */}
                <div className="w-14 shrink-0 pl-1.5 text-center sm:w-16">
                  <div className="font-mono text-sm leading-none tabular-nums text-nacre">
                    {md}
                  </div>
                  <div className="mt-1 font-display text-[10px] text-nacre-dim">
                    {weekday}
                  </div>
                </div>

                {/* 마름모 표식 */}
                <span
                  aria-hidden
                  className={`h-1.5 w-1.5 shrink-0 rotate-45 transition-transform duration-300 group-hover:scale-150 ${
                    expense ? "bg-cinnabar" : "bg-jade"
                  }`}
                />

                {/* 갈래 · 메모 */}
                <div className="min-w-0 flex-1">
                  <span className="font-display text-[15px] tracking-wide text-nacre">
                    {t.category}
                  </span>
                  {t.memo && (
                    <span className="ml-2 truncate text-[13px] text-nacre-dim">
                      {t.memo}
                    </span>
                  )}
                </div>

                {/* 금액 */}
                <div
                  className={`shrink-0 font-mono text-[15px] tabular-nums transition-all duration-300 sm:text-base ${
                    expense
                      ? "text-cinnabar group-hover:drop-shadow-[0_0_8px_rgba(239,106,74,0.7)]"
                      : "text-jade group-hover:drop-shadow-[0_0_8px_rgba(79,212,171,0.7)]"
                  }`}
                >
                  {expense ? "−" : "+"}
                  {won(t.amount)}
                </div>

                <button
                  type="button"
                  onClick={() => onDelete(t.id)}
                  aria-label={`${t.category} ${won(t.amount)}원 기록 지우기`}
                  className="-my-2 w-8 shrink-0 py-2 text-center font-mono text-sm text-transparent transition-colors duration-200 hover:!text-cinnabar focus-visible:text-cinnabar group-hover:text-nacre-dim"
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
