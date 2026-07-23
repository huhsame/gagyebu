import { supabase } from "@/lib/supabase";

export type Kind = "income" | "expense";

export type Tx = {
  id: string;
  date: string; // YYYY-MM-DD
  kind: Kind;
  category: string;
  amount: number;
  memo: string;
};

export const CATEGORIES: Record<Kind, string[]> = {
  income: ["급여", "부수입", "용돈", "환급", "기타"],
  expense: ["식비", "카페", "교통", "주거", "쇼핑", "문화", "의료", "경조사", "기타"],
};

const TABLE = "transactions";

export async function fetchTxs(): Promise<Tx[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("id, date, kind, category, amount, memo")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Tx[];
}

export async function insertTx(tx: Tx) {
  const { error } = await supabase.from(TABLE).insert(tx);
  if (error) throw error;
}

export async function deleteTx(id: string) {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
}

export const won = (n: number) => n.toLocaleString("ko-KR");

/** Date → "YYYY-MM-DD" (로컬 기준) */
export function toDateStr(d: Date) {
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/** "YYYY-MM" 을 n개월 이동 */
export function shiftMonth(month: string, delta: number) {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${`${d.getMonth() + 1}`.padStart(2, "0")}`;
}

export function monthLabel(month: string) {
  if (!month) return "";
  const [y, m] = month.split("-");
  return `${y}년 ${Number(m)}월`;
}

/** 카테고리별 합계 — 큰 것부터. 도넛 차트용. */
export function byCategory(txs: Tx[], kind: Kind) {
  const sums = new Map<string, number>();
  for (const t of txs) {
    if (t.kind !== kind) continue;
    sums.set(t.category, (sums.get(t.category) ?? 0) + t.amount);
  }
  const total = [...sums.values()].reduce((s, v) => s + v, 0);
  return {
    total,
    slices: [...sums.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([category, amount]) => ({
        category,
        amount,
        ratio: total ? amount / total : 0,
      })),
  };
}

/** 그 달 1일~말일 일별 수입·지출. 막대그래프용. */
export function byDay(txs: Tx[], month: string) {
  if (!month) return [];
  const [y, m] = month.split("-").map(Number);
  const days = new Date(y, m, 0).getDate();
  const rows = Array.from({ length: days }, (_, i) => ({
    day: i + 1,
    income: 0,
    expense: 0,
  }));
  for (const t of txs) {
    const d = Number(t.date.slice(8, 10));
    const row = rows[d - 1];
    if (!row) continue;
    row[t.kind] += t.amount;
  }
  return rows;
}

export function dayLabel(date: string) {
  const [, m, d] = date.split("-");
  const weekday = ["일", "월", "화", "수", "목", "금", "토"][
    new Date(date + "T00:00:00").getDay()
  ];
  return { md: `${Number(m)}.${Number(d)}`, weekday };
}
