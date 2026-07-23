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

const KEY = "ggb.ledger.v1";

export function loadTxs(): Tx[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Tx[]) : [];
  } catch {
    return [];
  }
}

export function saveTxs(txs: Tx[]) {
  localStorage.setItem(KEY, JSON.stringify(txs));
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

export function dayLabel(date: string) {
  const [, m, d] = date.split("-");
  const weekday = ["일", "월", "화", "수", "목", "금", "토"][
    new Date(date + "T00:00:00").getDay()
  ];
  return { md: `${Number(m)}.${Number(d)}`, weekday };
}
