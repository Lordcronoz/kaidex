"use client";

import { useEffect, useRef, useCallback } from "react";

// Curated Japanese words with verified translations
const KANA_WORDS = [
  "接続",  // setsuzoku — connect
  "未来",  // mirai — future
  "革新",  // kakushin — innovation
  "分散",  // bunsan — distributed
  "計算",  // keisan — compute
  "自律",  // jiritsu — autonomous
  "実行",  // jikkou — execute
  "安全",  // anzen — security
  "信頼",  // shinrai — trust
  "速度",  // sokudo — speed
  "知能",  // chinou — intelligence
  "連携",  // renkei — coordination
];

// Individual katakana for filler columns
const KATAKANA =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

interface Column {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  opacity: number;
  fontSize: number;
}

function createColumn(canvasWidth: number, canvasHeight: number): Column {
  const isWord = Math.random() > 0.6;
  const word = KANA_WORDS[Math.floor(Math.random() * KANA_WORDS.length)];
  const chars = isWord
    ? word.split("")
    : Array.from(
        { length: Math.floor(Math.random() * 8) + 4 },
        () => KATAKANA[Math.floor(Math.random() * KATAKANA.length)]
      );

  return {
    x: Math.random() * canvasWidth,
    y: -(Math.random() * canvasHeight * 0.5),
    speed: 0.15 + Math.random() * 0.45,
    chars,
    opacity: 0.03 + Math.random() * 0.05, // 3–8% opacity — subtle
    fontSize: 10 + Math.floor(Math.random() * 4),
  };
}

export function KanaRain({
  className = "",
}: {
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const columnsRef = useRef<Column[]>([]);
  const rafRef = useRef<number>(0);
  const reducedMotionRef = useRef(false);

  const initColumns = useCallback((width: number, height: number) => {
    // Fewer columns on mobile for performance
    const density = width < 768 ? 0.02 : 0.035;
    const count = Math.floor(width * density);
    columnsRef.current = Array.from({ length: count }, () =>
      createColumn(width, height)
    );
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = mql.matches;

    const handleMotionChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
    };
    mql.addEventListener("change", handleMotionChange);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      initColumns(rect.width, rect.height);
    };

    resize();
    window.addEventListener("resize", resize);

    // For reduced-motion: render a single static frame
    const renderStatic = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      columnsRef.current.forEach((col) => {
        // Place columns at random Y positions for the static snapshot
        const staticY = Math.random() * rect.height;
        col.chars.forEach((char, i) => {
          ctx.font = `${col.fontSize}px "JetBrains Mono", monospace`;
          ctx.fillStyle = `rgba(255, 255, 255, ${col.opacity})`;
          ctx.fillText(char, col.x, staticY + i * (col.fontSize + 4));
        });
      });
    };

    // Animation loop
    const animate = () => {
      if (reducedMotionRef.current) {
        renderStatic();
        return; // No loop — single frame
      }

      const rect = canvas.getBoundingClientRect();
      // Fade the previous frame instead of clearing — gives a trailing effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
      ctx.fillRect(0, 0, rect.width, rect.height);

      columnsRef.current.forEach((col) => {
        col.y += col.speed;

        col.chars.forEach((char, i) => {
          const charY = col.y + i * (col.fontSize + 4);
          if (charY < -50 || charY > rect.height + 50) return;

          ctx.font = `${col.fontSize}px "JetBrains Mono", monospace`;
          ctx.fillStyle = `rgba(255, 255, 255, ${col.opacity})`;
          ctx.fillText(char, col.x, charY);
        });

        // Reset column when it drifts off screen
        const lastCharY =
          col.y + col.chars.length * (col.fontSize + 4);
        if (col.y > rect.height + 50 && lastCharY > rect.height + 50) {
          Object.assign(col, createColumn(rect.width, rect.height));
          col.y = -(Math.random() * rect.height * 0.3 + 50);
        }
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    if (reducedMotionRef.current) {
      renderStatic();
    } else {
      rafRef.current = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      mql.removeEventListener("change", handleMotionChange);
    };
  }, [initColumns]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
