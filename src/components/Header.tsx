"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            <header className="glass sticky top-0 z-50 px-6 lg:px-10 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <Image
                            src="/python-logo.png"
                            alt="Python Logo"
                            width={34}
                            height={34}
                            className="drop-shadow-lg"
                        />
                        <h2 className="font-display text-on-surface text-lg font-bold leading-tight tracking-tight">
                            הכנה למבחן בפייתון
                        </h2>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {[
                            { href: "/", label: "ראשי" },
                            { href: "/learn/1", label: "שיעורים" },
                            { href: "/guides/data-types", label: "טיפוסי נתונים" },
                            { href: "/guides/exceptions", label: "עץ חריגות" },
                            { href: "/exam", label: "תרגול לפי נושא" },
                        ].map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className="px-3 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high text-sm font-medium transition-all duration-200"
                            >
                                {label}
                            </Link>
                        ))}
                        <Link
                            href="/exam/final"
                            className="mr-2 px-4 py-1.5 gradient-cta rounded-lg text-background-dark text-sm font-bold transition-all hover:opacity-90 hover:shadow-[0_4px_16px_rgba(0,247,123,0.25)]"
                        >
                            מאגר מבחנים
                        </Link>
                    </nav>

                    {/* Right side */}
                    <div className="flex items-center gap-2">
                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-full gradient-cta flex items-center justify-center text-background-dark font-black text-sm">
                            ש
                        </div>
                        {/* Mobile hamburger */}
                        <button
                            className="md:hidden p-2 rounded-lg bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="תפריט"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Nav Panel */}
            {mobileOpen && (
                <div className="md:hidden glass-strong fixed top-[56px] inset-x-0 z-40 py-4 px-6 flex flex-col gap-2">
                    {[
                        { href: "/", label: "ראשי" },
                        { href: "/learn/1", label: "שיעורים" },
                        { href: "/guides/data-types", label: "טיפוסי נתונים" },
                        { href: "/guides/exceptions", label: "עץ חריגות" },
                        { href: "/exam", label: "תרגול לפי נושא" },
                        { href: "/exam/final", label: "מאגר מבחנים" },
                    ].map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setMobileOpen(false)}
                            className="px-4 py-3 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high text-sm font-medium transition-all"
                        >
                            {label}
                        </Link>
                    ))}
                </div>
            )}
        </>
    );
}
