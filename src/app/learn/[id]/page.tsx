"use client";

import { useState, use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import MemoryGrid from "@/components/visualizers/MemoryGrid";
import CodeBlock from "@/components/CodeBlock";
import PyTutorStepper from "@/components/visualizers/PyTutorStepper";
import type { StepState, Variable } from "@/components/visualizers/PyTutorStepper";
import { getModuleByStringId, getNextModule, getPreviousModule, getAllModules } from "@/data/curriculumLoader";
import { useCallback } from "react";

interface LearnPageProps {
    params: Promise<{ id: string }>;
}

export default function LearnPage({ params }: LearnPageProps) {
    const { id } = use(params);
    const module = getModuleByStringId(id);
    const allModules = getAllModules();
    const nextModule = module ? getNextModule(module.id) : undefined;
    const prevModule = module ? getPreviousModule(module.id) : undefined;

    const [highlightedLine, setHighlightedLine] = useState<number | undefined>(undefined);
    const [activeSection, setActiveSection] = useState(0);
    const [memorySlots, setMemorySlots] = useState<{
        name?: string;
        value?: string | number;
        address: string;
        isActive?: boolean;
    }[]>([
        { address: "0x4F00" },
        { address: "0x4F01" },
        { address: "0x4F02" },
        { address: "0x4F03" },
        { address: "0x4F04" },
        { address: "0x4F05" },
        { address: "0x4F06" },
        { address: "0x4F07" },
    ]);
    const [currentStepDescription, setCurrentStepDescription] = useState<string>('');

    // Fallback if module not found
    if (!module) {
        return (
            <div className="flex h-screen flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold mb-4">מודול לא נמצא</h1>
                        <Link href="/" className="text-primary hover:underline">
                            חזרה לדף הבית
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    const theorySections = module.theory_sections || [];
    const interactiveCode = module.interactive_code;
    const practiceQuestions = module.practice_questions || [];

    const handleLineHover = (lineIndex: number) => {
        setHighlightedLine(lineIndex + 1);
    };

    // Callback to update memory grid when PyTutor step changes
    const handleStepChange = useCallback((step: StepState, stepIndex: number) => {
        setHighlightedLine(step.lineNumber);
        setCurrentStepDescription(step.description || '');

        // Convert step variables to memory slots
        const baseSlots: {
            name?: string;
            value?: string | number;
            address: string;
            isActive?: boolean;
        }[] = [
                { address: "0x4F00" },
                { address: "0x4F01" },
                { address: "0x4F02" },
                { address: "0x4F03" },
                { address: "0x4F04" },
                { address: "0x4F05" },
                { address: "0x4F06" },
                { address: "0x4F07" },
            ];

        // Place variables in slots
        step.variables.forEach((variable, idx) => {
            if (idx < baseSlots.length) {
                baseSlots[idx] = {
                    name: variable.name,
                    value: variable.value === null ? 'None' : String(variable.value),
                    address: variable.address,
                    isActive: true,
                };
            }
        });

        setMemorySlots(baseSlots);
    }, []);

    return (
        <div className="flex h-screen flex-col">
            <Header />

            <main className="flex flex-1 overflow-hidden">
                {/* Left Sticky Visualization (RAM) */}
                <section className="hidden lg:flex w-1/2 border-l border-border-dark">
                    <MemoryGrid slots={memorySlots} highlightedLine={highlightedLine} />
                </section>

                {/* Right Scrollable Content */}
                <section className="flex-1 overflow-y-auto p-6 md:p-12">
                    <div className="max-w-3xl mx-auto">
                        {/* Breadcrumbs */}
                        <nav className="flex flex-wrap gap-2 mb-8 items-center text-sm">
                            <Link href="/" className="text-text-muted hover:text-primary transition-colors">
                                Python Master
                            </Link>
                            <svg className="w-4 h-4 text-text-muted rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="text-text-muted">מודול {module.id}</span>
                            <svg className="w-4 h-4 text-text-muted rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="font-semibold">{module.title}</span>
                        </nav>

                        {/* Header Section */}
                        <motion.div
                            className="flex flex-col gap-6 mb-12"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-5xl font-black text-primary">{module.id}</span>
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">
                                        {module.title}
                                    </h1>
                                    <p className="text-text-muted text-lg">{module.subtitle}</p>
                                </div>
                            </div>

                            {/* Learning Objectives */}
                            {module.learningObjectives && (
                                <div className="bg-surface-dark/50 border border-border-dark rounded-xl p-6">
                                    <h3 className="text-lg font-bold mb-3 text-primary">🎯 מטרות הלמידה</h3>
                                    <ul className="space-y-2">
                                        {module.learningObjectives.map((obj, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-slate-300">
                                                <span className="text-primary mt-1">✓</span>
                                                <span>{obj}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Section Navigation */}
                            <div className="flex flex-wrap gap-2">
                                {theorySections.map((section, idx) => (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(idx)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeSection === idx
                                            ? 'bg-primary text-background-dark'
                                            : 'bg-surface-dark text-text-muted hover:bg-border-dark'
                                            }`}
                                    >
                                        {section.title}
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Theory Content - Rendered HTML */}
                        <div className="space-y-8">
                            {theorySections.map((section, idx) => (
                                <motion.div
                                    key={section.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{
                                        opacity: activeSection === idx ? 1 : 0.3,
                                        y: 0,
                                        scale: activeSection === idx ? 1 : 0.98
                                    }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={`theory-section-content bg-surface-dark/30 rounded-xl p-6 border-r-4 ${activeSection === idx ? 'border-primary' : 'border-border-dark'
                                        }`}
                                    onClick={() => setActiveSection(idx)}
                                >
                                    <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-3">
                                        <span className="text-primary text-sm bg-primary/20 px-2 py-1 rounded">
                                            {section.id}
                                        </span>
                                        {section.title}
                                    </h2>
                                    {/* Render HTML content */}
                                    <div
                                        className="prose prose-invert prose-lg max-w-none
                                            prose-headings:text-white prose-headings:font-bold
                                            prose-p:text-slate-300 prose-p:leading-relaxed
                                            prose-code:bg-primary/20 prose-code:text-primary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm
                                            prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-border-dark prose-pre:rounded-xl
                                            prose-strong:text-white
                                            prose-ul:space-y-2 prose-li:text-slate-300
                                            prose-table:border-collapse prose-th:bg-surface-dark prose-th:p-2 prose-th:border prose-th:border-border-dark
                                            prose-td:p-2 prose-td:border prose-td:border-border-dark prose-td:text-slate-300"
                                        dangerouslySetInnerHTML={{ __html: section.content_html }}
                                    />
                                </motion.div>
                            ))}
                        </div>

                        {/* Interactive Code Example - PyTutor Style */}
                        {interactiveCode && (
                            <motion.div
                                className="mt-12"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <PyTutorStepper
                                    code={interactiveCode.code}
                                    title={interactiveCode.title}
                                    onStepChange={handleStepChange}
                                />
                                {/* Concepts used badges */}
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <span className="text-xs text-text-muted">קונספטים:</span>
                                    {interactiveCode.concepts_used.map((concept, idx) => (
                                        <span key={idx} className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                                            {concept}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Practice Questions Preview */}
                        {practiceQuestions.length > 0 && (
                            <motion.div
                                className="mt-12 bg-gradient-to-r from-primary/10 to-transparent rounded-xl p-6 border border-primary/30"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <span className="text-2xl">📝</span>
                                    שאלות תרגול ({practiceQuestions.length})
                                </h3>
                                <p className="text-text-muted mb-4">
                                    בדוק את ההבנה שלך עם {practiceQuestions.length} שאלות תרגול על החומר של המודול הזה.
                                </p>
                                <Link
                                    href={`/exam?module=${module.id}`}
                                    className="inline-flex items-center gap-2 bg-primary text-background-dark px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
                                >
                                    <span>התחל תרגול</span>
                                    <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </motion.div>
                        )}

                        {/* Bottom Nav */}
                        <div className="mt-16 flex items-center justify-between border-t border-border-dark pt-8">
                            {prevModule ? (
                                <Link
                                    href={`/learn/${prevModule.id}`}
                                    className="flex items-center gap-2 text-text-muted hover:text-primary font-medium"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                    <div className="text-right">
                                        <span className="block text-xs text-text-muted">מודול קודם</span>
                                        <span>{prevModule.title}</span>
                                    </div>
                                </Link>
                            ) : (
                                <Link href="/" className="flex items-center gap-2 text-text-muted hover:text-primary font-medium">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    <span>חזרה לדף הבית</span>
                                </Link>
                            )}

                            {nextModule ? (
                                <Link
                                    href={`/learn/${nextModule.id}`}
                                    className="flex items-center gap-2 bg-primary text-background-dark px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
                                >
                                    <div className="text-right">
                                        <span className="block text-xs opacity-80">מודול הבא</span>
                                        <span>{nextModule.title}</span>
                                    </div>
                                    <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            ) : (
                                <Link
                                    href="/exam"
                                    className="flex items-center gap-2 bg-primary text-background-dark px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
                                >
                                    <span>סיים ועבור לבחינה</span>
                                    <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            )}
                        </div>
                    </div>
                </section>

                {/* Module List Sidebar */}
                <aside className="w-64 border-r border-border-dark hidden xl:flex flex-col py-6 px-4 overflow-y-auto">
                    <h3 className="font-bold text-sm text-text-muted mb-4">כל המודולים</h3>
                    <div className="space-y-1">
                        {allModules.map((m) => (
                            <Link
                                key={m.id}
                                href={`/learn/${m.id}`}
                                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${m.id === module.id
                                    ? 'bg-primary/20 text-primary'
                                    : 'hover:bg-surface-dark text-text-muted hover:text-white'
                                    }`}
                            >
                                <span className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold ${m.id === module.id ? 'bg-primary text-background-dark' : 'bg-border-dark'
                                    }`}>
                                    {m.id}
                                </span>
                                <span className="text-sm truncate">{m.title}</span>
                            </Link>
                        ))}
                    </div>
                </aside>
            </main>
        </div>
    );
}
