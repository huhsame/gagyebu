"use client";

import { useEffect, useMemo, useState } from "react";
import EntryForm from "@/components/entry-form";
import LedgerTable from "@/components/ledger-table";
import SummaryBand from "@/components/summary-band";
import {
  loadTxs,
  monthLabel,
  saveTxs,
  shiftMonth,
  toDateStr,
  type Tx,
} from "@/lib/ledger";

export default function Home() {
  const [txs, setTxs] = useState<Tx[]>([]);
  const [month, setMonth] = useState(""); // YYYY-MM
  const [today, setToday] = useState("");
  const [ready, setReady] = useState(false);

  // 저장된 장부와 "오늘"은 서버에 없다. 마운트 직후 한 번만 읽어 초기화한다.
  useEffect(() => {
    const now = toDateStr(new Date());
    // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR 경계: 클라이언트 전용 값의 1회 주입
    setToday(now);
    setMonth(now.slice(0, 7));
    setTxs(loadTxs());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveTxs(txs);
  }, [txs, ready]);

  const monthTxs = useMemo(
    () =>
      txs
        .filter((t) => t.date.startsWith(month))
        .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)),
    [txs, month],
  );

  const income = monthTxs
    .filter((t) => t.kind === "income")
    .reduce((s, t) => s + t.amount, 0);
  const expense = monthTxs
    .filter((t) => t.kind === "expense")
    .reduce((s, t) => s + t.amount, 0);

  const isThisMonth = month === today.slice(0, 7);

  return (
    <main
      className="mx-auto w-full max-w-5xl px-5 py-10 transition-opacity duration-500 sm:px-8 md:py-16"
      style={{ opacity: ready ? 1 : 0 }}
    >
      {/* 표제 */}
      <header className="anim-rise flex flex-wrap items-end justify-between gap-y-6">
        <div className="relative">
          <p className="font-display text-[11px] tracking-[0.55em] text-ink-soft">
            家計簿
          </p>
          <h1 className="mt-1 font-display text-5xl leading-none tracking-[0.08em] sm:text-6xl">
            가계부
          </h1>
          <span
            aria-hidden
            className="anim-stamp absolute -right-11 -top-3 hidden h-11 w-11 rotate-[-9deg] items-center justify-center rounded-full border-2 border-vermilion font-display text-lg text-vermilion opacity-90 sm:flex"
            style={{ animationDelay: "560ms" }}
          >
            記
          </span>
        </div>

        {/* 달 넘기기 */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setMonth((m) => shiftMonth(m, -1))}
            aria-label="이전 달"
            className="px-2 pb-1 font-display text-2xl text-ink-soft transition-colors hover:text-ink"
          >
            ‹
          </button>
          <div className="min-w-[7.5rem] text-center">
            <div className="font-display text-xl tracking-[0.1em]">
              {monthLabel(month) || " "}
            </div>
            {ready && !isThisMonth && (
              <button
                type="button"
                onClick={() => setMonth(today.slice(0, 7))}
                className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft underline decoration-rule underline-offset-4 transition-colors hover:text-vermilion"
              >
                this month
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setMonth((m) => shiftMonth(m, 1))}
            aria-label="다음 달"
            className="px-2 pb-1 font-display text-2xl text-ink-soft transition-colors hover:text-ink"
          >
            ›
          </button>
        </div>
      </header>

      <SummaryBand income={income} expense={expense} />

      <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-10 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-12">
        <EntryForm
          today={today}
          onAdd={(tx) =>
            setTxs((prev) => [{ ...tx, id: crypto.randomUUID() }, ...prev])
          }
        />
        <LedgerTable
          items={monthTxs}
          onDelete={(id) => setTxs((prev) => prev.filter((t) => t.id !== id))}
        />
      </div>

      <footer className="mt-16 border-t border-rule pt-5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft/70">
        기록은 이 브라우저에만 남습니다 · localStorage
      </footer>
    </main>
  );
}
