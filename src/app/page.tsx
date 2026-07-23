"use client";

import { useEffect, useMemo, useState } from "react";
import CoinBurst from "@/components/coin-burst";
import DayBars from "@/components/day-bars";
import EntryForm from "@/components/entry-form";
import LacquerBackdrop from "@/components/lacquer-backdrop";
import LedgerTable from "@/components/ledger-table";
import SpendDonut from "@/components/spend-donut";
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
    <>
      <LacquerBackdrop />
      <CoinBurst />

      {/* 화면 맨 위를 가로지르는 금박 실선 */}
      <div
        aria-hidden
        className="fixed inset-x-0 top-0 z-30 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(224,179,84,0.25) 18%, rgba(255,230,168,0.9) 50%, rgba(224,179,84,0.25) 82%, transparent)",
        }}
      />

      <main
        className="relative z-10 mx-auto w-full max-w-6xl px-5 py-10 transition-opacity duration-700 sm:px-8 md:py-16"
        style={{ opacity: ready ? 1 : 0 }}
      >
        {/* 표제 뒤에 크게 깔리는 재물 財 */}
        <span
          aria-hidden
          className="anim-glow pointer-events-none absolute -top-16 left-0 select-none font-seal text-[22rem] leading-none text-[rgba(255,235,200,0.055)]"
        >
          財
        </span>

        {/* ── 표제 ─────────────────────────────────────────── */}
        <header className="anim-rise relative flex flex-wrap items-end justify-between gap-y-8">
          <div className="relative">
            <p className="font-seal text-[11px] tracking-[0.6em] text-nacre-dim">
              螺鈿帳簿
            </p>
            <h1 className="anim-ink mt-1.5 font-display text-6xl font-extrabold leading-none tracking-[0.06em] sm:text-7xl">
              <span className="gilt">가계부</span>
            </h1>
            <p className="mt-3 max-w-xs font-display text-[13px] leading-relaxed text-nacre-dim">
              쓰고, 남기고, 들여다보는 —{" "}
              <span className="iridescent font-bold">자개 한 겹</span> 두른 장부
            </p>

            {/* 낙관(落款) */}
            <span
              aria-hidden
              className="anim-stamp absolute -right-14 -top-4 hidden h-14 w-14 rotate-[-9deg] items-center justify-center rounded-[3px] border-2 border-cinnabar font-seal text-2xl text-cinnabar shadow-[0_0_28px_-6px_rgba(239,106,74,0.9)] sm:flex"
              style={{ animationDelay: "700ms" }}
            >
              記
              <span className="anim-glow absolute inset-0 rounded-[3px] bg-[radial-gradient(circle,rgba(239,106,74,0.35),transparent_70%)]" />
            </span>
          </div>

          {/* ── 달 넘기기 ─────────────────────────────────── */}
          <div className="lacquer-card flex items-center gap-3 px-4 py-2.5">
            <button
              type="button"
              onClick={() => setMonth((m) => shiftMonth(m, -1))}
              aria-label="이전 달"
              className="px-2 pb-1 font-display text-2xl text-nacre-dim transition-all duration-200 hover:text-gold hover:drop-shadow-[0_0_10px_#e0b354]"
            >
              ‹
            </button>
            <div className="min-w-[8rem] text-center">
              <div className="font-display text-lg font-bold tracking-[0.1em] text-nacre">
                {monthLabel(month) || " "}
              </div>
              {ready && !isThisMonth && (
                <button
                  type="button"
                  onClick={() => setMonth(today.slice(0, 7))}
                  className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.25em] text-nacre-dim underline decoration-rule underline-offset-4 transition-colors hover:text-gold"
                >
                  this month
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setMonth((m) => shiftMonth(m, 1))}
              aria-label="다음 달"
              className="px-2 pb-1 font-display text-2xl text-nacre-dim transition-all duration-200 hover:text-gold hover:drop-shadow-[0_0_10px_#e0b354]"
            >
              ›
            </button>
          </div>
        </header>

        <SummaryBand income={income} expense={expense} />

        <div className="mt-3 grid grid-cols-[minmax(0,1fr)] gap-3 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
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

        <div className="mt-3 grid grid-cols-[minmax(0,1fr)] gap-3 lg:grid-cols-2">
          {/* key: 달이 바뀌면 새로 마운트돼서 원호와 막대가 다시 자란다 */}
          <SpendDonut key={`donut-${month}`} items={monthTxs} />
          <DayBars key={`bars-${month}`} items={monthTxs} month={month} today={today} />
        </div>

        <footer className="mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-5 font-mono text-[10px] uppercase tracking-[0.25em] text-nacre-dim">
          <span>기록은 이 브라우저에만 남습니다 · localStorage</span>
          <span className="font-seal tracking-[0.4em]">螺 鈿</span>
        </footer>
      </main>
    </>
  );
}
