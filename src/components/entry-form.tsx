"use client";

import { useState } from "react";
import { CATEGORIES, type Kind, type Tx, won } from "@/lib/ledger";

type Props = {
  today: string;
  onAdd: (tx: Omit<Tx, "id">) => void;
};

const onlyDigits = (s: string) => s.replace(/[^\d]/g, "").slice(0, 12);

export default function EntryForm({ today, onAdd }: Props) {
  const [kind, setKind] = useState<Kind>("expense");
  const [picked, setPicked] = useState(""); // 사용자가 직접 고른 날짜
  const [category, setCategory] = useState(CATEGORIES.expense[0]);
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");

  // 손대지 않았으면 오늘. today는 클라이언트에서만 채워진다 (SSR 불일치 방지)
  const date = picked || today;

  function switchKind(next: Kind) {
    setKind(next);
    setCategory(CATEGORIES[next][0]);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(onlyDigits(amount));
    if (!value || !date) return;
    onAdd({ date, kind, category, amount: value, memo: memo.trim() });
    setAmount("");
    setMemo("");
  }

  const accent = kind === "expense" ? "text-vermilion" : "text-pine";

  return (
    <form
      onSubmit={submit}
      className="receipt-edge anim-rise bg-[rgba(255,253,246,0.72)] px-6 pt-6 pb-8 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset,0_10px_28px_-18px_rgba(60,45,20,0.55)]"
      style={{ animationDelay: "120ms" }}
    >
      <div className="flex items-baseline justify-between border-b border-dashed border-rule pb-3">
        <h2 className="font-display text-xl tracking-[0.14em]">기 입</h2>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-soft">
          new entry
        </span>
      </div>

      {/* 수입 / 지출 */}
      <div className="mt-5 grid grid-cols-2 gap-2">
        {(["expense", "income"] as const).map((k) => {
          const on = kind === k;
          return (
            <button
              key={k}
              type="button"
              onClick={() => switchKind(k)}
              aria-pressed={on}
              className={`border py-2.5 text-sm tracking-[0.2em] transition-all duration-200 ${
                on
                  ? k === "expense"
                    ? "border-vermilion bg-vermilion text-paper shadow-[0_6px_16px_-10px_rgba(176,58,43,0.9)]"
                    : "border-pine bg-pine text-paper shadow-[0_6px_16px_-10px_rgba(31,93,80,0.9)]"
                  : "border-rule text-ink-soft hover:border-ink hover:text-ink"
              }`}
            >
              {k === "expense" ? "지출" : "수입"}
            </button>
          );
        })}
      </div>

      {/* 금액 */}
      <label className="mt-7 block">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-soft">
          amount
        </span>
        <div className="mt-1 flex items-end gap-2 border-b border-rule focus-within:border-ink">
          <span className={`font-display text-2xl leading-none pb-2 ${accent}`}>
            {kind === "expense" ? "−" : "+"}
          </span>
          <input
            value={amount ? won(Number(onlyDigits(amount))) : ""}
            onChange={(e) => setAmount(onlyDigits(e.target.value))}
            inputMode="numeric"
            placeholder="0"
            required
            aria-label="금액"
            className="min-w-0 flex-1 border-0 bg-transparent pb-1.5 text-right font-mono text-3xl tabular-nums outline-none placeholder:text-rule"
          />
          <span className="pb-2 font-display text-lg text-ink-soft">원</span>
        </div>
      </label>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-x-5">
        <label className="block min-w-0">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-soft">
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
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-soft">
            category
          </span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="field"
          >
            {CATEGORIES[kind].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-5 block">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-soft">
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

      <button
        type="submit"
        className="group mt-8 w-full border border-ink bg-ink py-3 font-display text-base tracking-[0.35em] text-paper transition-all duration-200 hover:bg-transparent hover:text-ink active:translate-y-px"
      >
        장부에 적기
      </button>
    </form>
  );
}
