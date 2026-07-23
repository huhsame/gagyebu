"use client";

import { useEffect, useRef, useState } from "react";
import { won } from "@/lib/ledger";

/** 값이 바뀔 때마다 이전 값에서 새 값으로 굴러가는 숫자. */
export default function CountUp({
  value,
  duration = 900,
  className = "",
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const [shown, setShown] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef(0);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) return;

    // 숨은 탭에서는 rAF가 멈춘다. 굴릴 수 없으면 그냥 값만 얹는다.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || document.hidden) {
      fromRef.current = to;
      const t = setTimeout(() => setShown(to), 0);
      return () => clearTimeout(t);
    }

    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 4); // easeOutQuart
      setShown(Math.round(from + (to - from) * eased));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
      else fromRef.current = to;
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  return (
    <span className={`tabular-nums ${className}`}>
      {shown < 0 && "−"}
      {won(Math.abs(shown))}
    </span>
  );
}
