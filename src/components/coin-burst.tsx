"use client";

import { useEffect, useRef } from "react";

type Coin = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  spin: number;
  angle: number;
  life: number;
  hue: string;
};

let emit: ((x: number, y: number, tone: "gold" | "jade") => void) | null = null;

/** 화면 어디서든 엽전을 터뜨린다. 캔버스가 아직 없으면 조용히 무시. */
export function fireCoins(x: number, y: number, tone: "gold" | "jade" = "gold") {
  emit?.(x, y, tone);
}

const PALETTE = {
  gold: ["#ffe6a8", "#e0b354", "#b98c33"],
  jade: ["#a8ffd8", "#4fd4ab", "#2e9d7c"],
};

export default function CoinBurst() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const coins: Coin[] = [];
    let raf = 0;
    let running = false;

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = coins.length - 1; i >= 0; i--) {
        const c = coins[i];
        c.vy += 0.42; // 중력
        c.vx *= 0.992;
        c.x += c.vx;
        c.y += c.vy;
        c.angle += c.spin;
        c.life -= 0.011;

        if (c.life <= 0 || c.y > window.innerHeight + 60) {
          coins.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.angle);
        // 회전하는 동전이 옆으로 누워 보이도록 가로폭을 눌러준다
        ctx.scale(Math.max(0.15, Math.abs(Math.cos(c.angle * 1.7))), 1);
        ctx.globalAlpha = Math.min(1, c.life);
        ctx.shadowColor = c.hue;
        ctx.shadowBlur = 12;

        ctx.beginPath();
        ctx.arc(0, 0, c.r, 0, Math.PI * 2);
        ctx.fillStyle = c.hue;
        ctx.fill();

        // 엽전 네모 구멍
        ctx.globalCompositeOperation = "destination-out";
        ctx.shadowBlur = 0;
        ctx.fillRect(-c.r * 0.26, -c.r * 0.26, c.r * 0.52, c.r * 0.52);
        ctx.restore();
      }

      if (coins.length) {
        raf = requestAnimationFrame(draw);
      } else {
        running = false;
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };

    emit = (x, y, tone) => {
      const colors = PALETTE[tone];
      const n = 26;
      for (let i = 0; i < n; i++) {
        const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.1;
        const speed = 5 + Math.random() * 10;
        coins.push({
          x,
          y,
          vx: Math.cos(a) * speed * 1.15,
          vy: Math.sin(a) * speed,
          r: 4 + Math.random() * 6,
          spin: (Math.random() - 0.5) * 0.34,
          angle: Math.random() * Math.PI,
          life: 1 + Math.random() * 0.5,
          hue: colors[(Math.random() * colors.length) | 0],
        });
      }
      if (!running) {
        running = true;
        raf = requestAnimationFrame(draw);
      }
    };

    return () => {
      emit = null;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40"
    />
  );
}
