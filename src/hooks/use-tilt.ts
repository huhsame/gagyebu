"use client";

import { useCallback } from "react";

/**
 * 요소 위 마우스 위치를 기울기(--rx/--ry)와 광원 위치(--gx/--gy)로 바꿔 붙인다.
 * 이벤트의 currentTarget만 만지므로 ref도, 리렌더도 없다.
 */
export function useTilt<T extends HTMLElement = HTMLDivElement>(max = 7) {
  const onPointerMove = useCallback(
    (e: React.PointerEvent<T>) => {
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty("--ry", `${px * max * 2}deg`);
      el.style.setProperty("--rx", `${-py * max * 2}deg`);
      el.style.setProperty("--gx", `${(px + 0.5) * 100}%`);
      el.style.setProperty("--gy", `${(py + 0.5) * 100}%`);
    },
    [max],
  );

  const onPointerLeave = useCallback((e: React.PointerEvent<T>) => {
    e.currentTarget.style.setProperty("--ry", "0deg");
    e.currentTarget.style.setProperty("--rx", "0deg");
  }, []);

  return { onPointerMove, onPointerLeave };
}
