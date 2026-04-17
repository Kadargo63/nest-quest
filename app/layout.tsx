import './globals.css';
import Link from 'next/link';
import React from 'react';

export const metadata = {
  title: 'NestQuest',
  description: 'Collaborative housing and homestead planning',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col">
          <header className="border-b border-slate-200 bg-white">
            <div className="flex items-center justify-between px-4 py-4">
              <Link href="/" className="text-xl font-semibold">
                NestQuest
              </Link>
              <nav className="flex gap-4 text-sm text-slate-600">
                <Link href="/">Home</Link>
                <Link href="/quests">Quests</Link>
              </nav>
            </div>
          </header>
          <main className="flex-1 px-4 py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
