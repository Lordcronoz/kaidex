'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const handleScroll = () => setScrolled(window.scrollY > 80); window.addEventListener('scroll', handleScroll); return () => window.removeEventListener('scroll', handleScroll); }, []);
  const links = ['Services', 'Work', 'About', 'Process', 'Contact'];
  return ( <nav className={\ixed top-0 w-full z-50 transition-all px-6 md:px-[120px] py-5 flex justify-between items-center \\}> <Link href="/" className="flex items-center"><span style={{ fontFamily: "'Noto Serif JP'", fontWeight: 900, fontSize: '22px' }}>カイ</span><span style={{ fontFamily: "'Bebas Neue'", letterSpacing: '4px', fontSize: '22px' }}>DEX</span></Link> <div className="hidden md:flex gap-8">{links.map(link => <Link key={link} href={\#\\} className="text-sm text-white hover:translate-x-1 transition">{link}</Link>)}</div> <div className="hidden md:block rounded-full border border-white/60 p-px"><div className="rounded-full bg-black px-8 py-2 text-sm text-white">Let's Talk</div></div> </nav> );
}
