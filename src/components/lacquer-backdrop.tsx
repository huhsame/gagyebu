"use client";

import { useEffect, useRef } from "react";

/** 자개 광택 덩어리 — 위치·색·주기 모두 고정값이라 SSR/CSR이 어긋나지 않는다. */
const BLOBS = [
  { top: "-16%", left: "-10%", size: "48rem", dur: "34s", c: "rgba(88,140,255,0.85)" },
  { top: "2%", left: "56%", size: "40rem", dur: "27s", c: "rgba(226,104,196,0.72)" },
  { top: "44%", left: "-16%", size: "44rem", dur: "31s", c: "rgba(58,224,175,0.68)" },
  { top: "58%", left: "50%", size: "46rem", dur: "38s", c: "rgba(255,196,86,0.75)" },
  { top: "24%", left: "22%", size: "32rem", dur: "23s", c: "rgba(255,96,60,0.55)" },
  { top: "78%", left: "18%", size: "34rem", dur: "29s", c: "rgba(160,120,255,0.6)" },
];

export default function LacquerBackdrop() {
  const glowRef = useRef<HTMLDivElement>(null);

  // 커서를 따라다니는 금빛 — 렌더가 아니라 스타일 직접 조작이라 리렌더가 없다.
  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      el.style.setProperty("--mx", `${e.clientX}px`);
      el.style.setProperty("--my", `${e.clientY}px`);
      el.style.opacity = "1";
    };
    const onLeave = () => {
      el.style.opacity = "0";
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    // isolate: blob의 screen 블렌드가 위쪽 카드까지 덮지 않도록 여기서 가둔다.
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-60 [isolation:isolate] sm:opacity-100"
    >
      {/* 옻칠 아래에서 도는 자개빛 */}
      {BLOBS.map((b, i) => (
        <span
          key={i}
          className="nacre-blob"
          style={{
            top: b.top,
            left: b.left,
            width: b.size,
            height: b.size,
            background: `radial-gradient(circle at 40% 40%, ${b.c}, transparent 68%)`,
            ["--dur" as string]: b.dur,
            animationDelay: `${i * -4.5}s`,
          }}
        />
      ))}

      {/* 자개 조각을 박아 넣은 격자 */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,240,210,0.9) 0.7px, transparent 0.8px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* 나전 상감선 — 비스듬한 금박 결 */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(114deg, rgba(255,226,170,0.9) 0 1px, transparent 1px 92px)",
        }}
      />

      {/* 마우스 금빛 */}
      <div
        ref={glowRef}
        className="absolute inset-0 opacity-0 transition-opacity duration-700"
        style={{
          background:
            "radial-gradient(22rem 22rem at var(--mx, 50%) var(--my, 50%), rgba(255,226,170,0.10), transparent 70%)",
        }}
      />
    </div>
  );
}
