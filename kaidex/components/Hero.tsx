'use client';
import { useEffect, useRef } from 'react';
export default function Hero() {
  const kaiRef = useRef<HTMLSpanElement>(null);
  const dexRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const run = async () => {
      const kai = kaiRef.current; const dex = dexRef.current;
      if (!kai || !dex) return;
      kai.style.fontFamily = "'Bebas Neue'"; kai.textContent = '';
      dex.style.opacity = '0';
      for (const c of ['K','A','I']) { kai.textContent += c; await new Promise(r => setTimeout(r, 80)); }
      await new Promise(r => setTimeout(r, 700));
      for (let i=3; i>=0; i--) { kai.textContent = 'KAI'.slice(0,i); await new Promise(r => setTimeout(r, 60)); }
      kai.style.fontFamily = "'Noto Serif JP'"; kai.style.fontWeight = '900';
      for (const c of ['カ','イ']) { kai.textContent += c; await new Promise(r => setTimeout(r, 120)); }
      dex.style.opacity = '1'; dex.style.transition = 'opacity 0.35s';
    };
    run();
  }, []);
  return ( <section className="h-screen flex flex-col items-center justify-center"><div className="text-[clamp(72px,14vw,160px)] leading-[0.85] font-bebas"><span ref={kaiRef}></span><span ref={dexRef} className="opacity-0">DEX</span></div><div className="mt-8 text-[13px] tracking-[7px] text-white/35">Build · Scale · Automate</div><div className="mt-8 rounded-full border border-white/60 p-px"><div className="rounded-full bg-white px-8 py-2 text-black">Start a Project</div></div><div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] tracking-[6px] text-white/35 animate-bounce-slow">↓ SCROLL</div></section> );
}
