"use client";

import Link from "next/link";
import Image from "next/image";

export default function Header() {
    return (
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-dark px-6 lg:px-10 py-3 bg-white/5 backdrop-blur-md sticky top-0 z-50">
            <div className="flex items-center gap-3">
                <Image
                    src="/python-logo.png"
                    alt="Python Logo"
                    width={36}
                    height={36}
                    className="drop-shadow-lg"
                />
                <h2 className="text-white text-xl font-bold leading-tight tracking-tight">
                    הכנה למבחן בפייתון
                </h2>
            </div>

            <nav className="hidden md:flex items-center gap-8">
                <Link
                    href="/"
                    className="text-white/70 hover:text-primary transition-colors text-sm font-medium"
                >
                    ראשי
                </Link>
                <Link
                    href="/learn/1"
                    className="text-white/70 hover:text-primary transition-colors text-sm font-medium"
                >
                    שיעורים
                </Link>
                <Link
                    href="/exam"
                    className="text-white/70 hover:text-primary transition-colors text-sm font-medium"
                >
                    תרגול
                </Link>
                <Link
                    href="/exam/advanced"
                    className="text-primary font-bold text-sm"
                >
                    🎯 מבחן מסכם
                </Link>
            </nav>

            <div className="flex items-center gap-3">
                <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                </button>
                <div
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/50 border-2 border-primary/30 flex items-center justify-center text-background-dark font-bold"
                >
                    ש
                </div>
            </div>
        </header>
    );
}
