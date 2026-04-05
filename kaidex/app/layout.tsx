import type { Metadata } from 'next';
import './styles/globals.css';
import { useLenis } from '@/hooks/useLenis';
import Cursor from '@/components/Cursor';

export const metadata: Metadata = { title: 'KAIDEX – AI + Dev + SaaS Agency', description: 'AI-native development studio. Build, scale, automate.' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Noto+Serif+JP:wght@700;900&family=DM+Sans:wght@300;400&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet" />
        <link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-black text-white"><LenisProvider /><Cursor />{children}</body>
    </html>
  );
}
function LenisProvider() { useLenis(); return null; }
