"use client";

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function Navbar() {
  return (
    <nav className="w-full fixed top-0 left-0 z-10 bg-background border-b border-black/10 dark:border-white/10 px-4 sm:px-8 h-16 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Link href="/" className="font-semibold text-lg tracking-tight">
          EcoCoin Space
        </Link>
        <Link href="/token" className="text-sm hover:underline">
          Token
        </Link>
        <Link href="/challenges" className="text-sm hover:underline">
          Challenges
        </Link>
        <Link href="/leaderboard" className="text-sm hover:underline">
          Leaderboard
        </Link>
        <Link href="/chat" className="text-sm hover:underline">
          Chat
        </Link>
      </div>
      <ConnectButton />
    </nav>
  );
} 