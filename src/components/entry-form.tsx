"use client";

import { useRef, useState } from "react";
import { fireCoins } from "@/components/coin-burst";
import { useTilt } from "@/hooks/use-tilt";
import { CATEGORIES, type Kind, type Tx, won } from "@/lib/ledger";

type Props = {
  today: string;
  onAdd: (tx: Omit<Tx, "id">) => void;
};

const onlyDigits = (s: string) => s.replace(/[^\d]/g, "").slice(0, 12);

// 금액 입력을 거들 빠른 버튼
const QUICK = [1000, 5000, 10000, 50000];

export default function EntryForm({ today, onAdd }: Props) {
  const [kind, setKind] = useState<Kind>("expense");
  const [picked, setPicked] = useState(""); // 사용자가 직접 고른 날짜
  const [category, setCategory] = useState(CATEGORIES.expense[0]);
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const btnRef = useRef<HTMLButtonElement>(null);
  const tilt = useTilt<HTMLFormElement>(4);

  // 손대지 않았으면 오늘. today는 클라이언트에서만 채워진다 (SSR 불일치 방지)
  const date = picked || today;
  const expense = kind === "expense";

  function switchKind(next: Kind) {
    setKind(next);
    setCategory(CATEGORIES[next][0]);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(onlyDigits(amount));
    if (!value || !date) return;
    onAdd({ date, kind, category, amount: value, memo: memo.trim() });

    // 버튼 자리에서 엽전이 튄다
    const r = btnRef.current?.getBoundingClientRect();
    if (r) {
      fireCoins(r.left + r.width / 2, r.top + r.height / 2, expense ? "gold" : "jade");
    }

    setAmount("");
    setMemo("");
  }

  return (
    <form
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
      onSubmit={submit}
      className="lacquer-card gilt-corners tilt anim-rise relative overflow-hidden px-6 pb-8 pt-6"
      style={{ animationDelay: "180ms" }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(224,179,84,0.14),transparent_70%)]"
      />

      <div className="relative flex items-baseline justify-between border-b border-rule pb-3">
        <h2 className="font-display text-xl font-extrabold tracking-[0.22em]">
          <span className="gilt">기 입</span>
        </h2>
        <span className="font-seal text-xs tracking-[0.35em] text-nacre-dim">記入</span>
      </div>

      {/* 수입 / 지출 — 금박 인디케이터가 미끄러진다 */}
      <div className="relative mt-6 grid grid-cols-2 rounded-[2px] border border-rule bg-[rgba(0,0,0,0.35)] p-1">
        <span
          aria-hidden
          className="absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-[1px] transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            transform: `translateX(${expense ? "0.25rem" : "calc(100% + 0.75rem)"})`,
            background: expense
              ? "linear-gradient(135deg,#ef6a4a,#a02d18)"
              : "linear-gradient(135deg,#4fd4ab,#1e7a5f)",
            boxShadow: expense
              ? "0 0 22px -4px rgba(239,106,74,0.7)"
              : "0 0 22px -4px rgba(79,212,171,0.7)",
          }}
        />
        {(["expense", "income"] as const).map((k) => {
          const on = kind === k;
          return (
            <button
              key={k}
              type="button"
              onClick={() => switchKind(k)}
              aria-pressed={on}
              className={`relative z-10 py-2.5 font-display text-sm tracking-[0.3em] transition-colors duration-300 ${
                on ? "text-lacquer" : "text-nacre-soft hover:text-nacre"
              }`}
            >
              {k === "expense" ? "지출" : "수입"}
            </button>
          );
        })}
      </div>

      {/* 금액 */}
      <label className="mt-7 block">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-nacre-dim">
          amount
        </span>
        <div className="mt-1 flex items-end gap-2 border-b border-rule pb-1 transition-colors focus-within:border-gold">
          <span
            className={`pb-1.5 font-display text-3xl leading-none ${
              expense ? "text-cinnabar" : "text-jade"
            }`}
          >
            {expense ? "−" : "+"}
          </span>
          <input
            value={amount ? won(Number(onlyDigits(amount))) : ""}
            onChange={(e) => setAmount(onlyDigits(e.target.value))}
            inputMode="numeric"
            placeholder="0"
            required
            aria-label="금액"
            className="min-w-0 flex-1 border-0 bg-transparent pb-0.5 text-right font-mono text-[2.4rem] leading-none tabular-nums text-nacre outline-none placeholder:text-nacre-dim/50"
          />
          <span className="pb-2 font-display text-lg text-nacre-dim">원</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {QUICK.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() =>
                setAmount((a) => String(Number(onlyDigits(a) || "0") + q))
              }
              className="border border-rule px-2 py-1 font-mono text-[10px] tabular-nums text-nacre-soft transition-all duration-200 hover:border-gold hover:text-gold hover:shadow-[0_0_14px_-6px_#e0b354]"
            >
              +{won(q)}
            </button>
          ))}
          {amount && (
            <button
              type="button"
              onClick={() => setAmount("")}
              className="ml-auto px-2 py-1 font-mono text-[10px] text-nacre-dim transition-colors hover:text-cinnabar"
            >
              지움
            </button>
          )}
        </div>
      </label>

      {/* 갈래 — 칩으로 고른다 */}
      <div className="mt-6">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-nacre-dim">
          category
        </span>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {CATEGORIES[kind].map((c) => {
            const on = category === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                aria-pressed={on}
                className={`border px-2.5 py-1.5 font-display text-[13px] tracking-wide transition-all duration-200 ${
                  on
                    ? "border-gold bg-[rgba(224,179,84,0.14)] text-gold-hi shadow-[0_0_18px_-8px_#e0b354]"
                    : "border-rule text-nacre-soft hover:border-nacre-dim hover:text-nacre"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-x-5">
        <label className="block min-w-0">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-nacre-dim">
            date
          </span>
          <input
            type="date"
            value={date}
            onChange={(e) => setPicked(e.target.value)}
            required
            className="field min-w-0 font-mono"
          />
        </label>

        <label className="block min-w-0">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-nacre-dim">
            memo
          </span>
          <input
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            maxLength={40}
            placeholder="무엇에 썼나"
            className="field"
          />
        </label>
      </div>

      <button
        ref={btnRef}
        type="submit"
        aria-label="장부에 적기"
        className="group relative mt-8 w-full overflow-hidden border border-gold-lo py-3.5 font-display text-base font-bold tracking-[0.4em] text-lacquer transition-transform duration-200 active:translate-y-px"
        style={{
          background: "linear-gradient(100deg,#8a672a,#e0b354 28%,#ffe6a8 46%,#e0b354 66%,#8a672a)",
          backgroundSize: "220% 100%",
          boxShadow: "0 14px 34px -20px rgba(224,179,84,0.9)",
        }}
      >
        <span className="relative z-10">장부에 적기</span>
        <span
          aria-hidden
          className="absolute inset-0 -translate-x-full bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.65),transparent)] transition-transform duration-700 group-hover:translate-x-full"
        />
      </button>
    </form>
  );
}
