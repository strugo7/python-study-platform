"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, use } from "react";
import Header from "@/components/Header";
import MemoryGrid from "@/components/visualizers/MemoryGrid";
import PyTutorStepper from "@/components/visualizers/PyTutorStepper";
import type { StepState } from "@/components/visualizers/PyTutorStepper";
import type { ComplexValue } from "@/data/curriculum.types";
import { getModuleByStringId, getNextModule, getPreviousModule, getAllModules } from "@/data/curriculumLoader";

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
    const [showSimulator, setShowSimulator] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [heapObjects, setHeapObjects] = useState<ComplexValue[]>([]);
    const [memorySlots, setMemorySlots] = useState<{
        name?: string;
        value?: string | number;
        address: string;
        type?: string;
        isActive?: boolean;
        isNew?: boolean;
        isChanged?: boolean;
        hasPointer?: boolean;
        pointerTo?: string;
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

    // Fallback if module not found
    if (!module) {
        return (
            <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="font-display text-3xl font-bold mb-4 text-on-surface">מודול לא נמצא</h1>
                        <Link href="/" className="text-primary hover:opacity-80 transition-opacity">
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

    // Callback to update memory grid when PyTutor step changes
    const handleStepChange = useCallback((step: StepState, stepIndex: number) => {
        setHighlightedLine(step.lineNumber);

        // Build variable slots
        const varSlots = step.variables.map((variable) => ({
            name: variable.name,
            value: variable.value === null ? 'None' : String(variable.value),
            address: variable.address,
            type: variable.type,
            isActive: true,
            isNew: variable.isNew || false,
            isChanged: variable.changed || false,
            hasPointer: !!variable.pointsTo,
            pointerTo: variable.pointsTo,
        }));

        // Fill remaining empty slots
        const emptyCount = Math.max(0, 8 - varSlots.length);
        const emptySlots = Array.from({ length: emptyCount }, (_, i) => ({
            address: `0x${(0x4F00 + varSlots.length + i).toString(16).toUpperCase()}`,
        }));

        setMemorySlots([...varSlots, ...emptySlots]);
        setHeapObjects(step.heapObjects || []);
    }, []);

    return (
        <div className="flex min-h-screen flex-col">
            <Header />

            <main className="flex-1">
                {/* Full Width Content Area */}
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14">
                    {/* Breadcrumbs */}
                    <nav className="flex flex-wrap gap-2 mb-8 md:mb-10 items-center text-sm">
                        <Link href="/" className="text-on-surface-variant hover:text-primary transition-colors">
                            ראשי
                        </Link>
                        <svg className="w-4 h-4 text-on-surface-variant/40 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-on-surface-variant">מודול {module.id}</span>
                        <svg className="w-4 h-4 text-on-surface-variant/40 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="font-semibold text-on-surface">{module.title}</span>
                    </nav>

                    {/* Header Section */}
                    <motion.div
                        className="flex flex-col gap-6 md:gap-8 mb-10 md:mb-14"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center gap-5">
                            <span className="font-display text-4xl md:text-5xl font-black gradient-cta-text">{module.id}</span>
                            <div>
                                <h1 className="font-display text-2xl md:text-4xl font-black leading-tight tracking-tight text-on-surface">
                                    {module.title}
                                </h1>
                                <p className="text-on-surface-variant text-base md:text-lg mt-1" dir="ltr">{module.subtitle}</p>
                            </div>
                        </div>

                        {/* Learning Objectives — tonal surface, no border */}
                        {module.learningObjectives && (
                            <div className="rounded-2xl p-5 md:p-7" style={{ background: 'var(--surface-container)' }}>
                                <h3 className="text-base md:text-lg font-bold mb-4 text-primary font-display">🎯 מטרות הלמידה</h3>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                    {module.learningObjectives.map((obj, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-on-surface-variant text-sm md:text-base">
                                            <span className="text-primary mt-0.5 shrink-0">✓</span>
                                            <span>{obj}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Section Navigation Tabs — ghost buttons, tonal active */}
                        <div className="flex flex-wrap gap-2 pb-4" style={{ borderBottom: '1px solid rgba(59,75,60,0.2)' }}>
                            {theorySections.map((section, idx) => (
                                <button
                                    key={section.id}
                                    onClick={() => { setActiveSection(idx); setShowSummary(false); }}
                                    className={`px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition-all ${!showSummary && activeSection === idx
                                            ? 'gradient-cta text-background-dark shadow-[0_2px_8px_rgba(0,247,123,0.15)]'
                                            : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                                        }`}
                                    style={!(!showSummary && activeSection === idx) ? { background: 'var(--surface-container-highest)' } : {}}
                                >
                                    {section.title}
                                </button>
                            ))}
                            <button
                                onClick={() => setShowSummary(true)}
                                className={`px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition-all flex items-center gap-1.5 ${showSummary
                                        ? 'gradient-cta text-background-dark shadow-[0_2px_8px_rgba(0,247,123,0.15)]'
                                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                                    }`}
                                style={!showSummary ? { background: 'var(--surface-container-highest)' } : {}}
                            >
                                <span>🎬</span> סיכום וידאו
                            </button>
                        </div>
                    </motion.div>

                    {/* Summary Video Panel */}
                    {showSummary && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-10 md:mb-14"
                        >
                            <div className="rounded-2xl p-5 md:p-7" style={{ background: 'var(--surface-container-high)', border: '1px solid rgba(0,247,123,0.15)' }}>
                                <h2 className="text-xl md:text-2xl font-bold mb-5 text-on-surface flex items-center gap-3 font-display">
                                    <span className="text-xs md:text-sm px-2.5 py-1 rounded-lg text-primary" style={{ background: 'rgba(0,247,123,0.1)' }}>🎬</span>
                                    סיכום וידאו — {module.title}
                                </h2>
                                <div className="rounded-xl overflow-hidden bg-black aspect-video">
                                    <video
                                        key={module.id}
                                        className="w-full h-full"
                                        controls
                                        src={`/videos/module-${module.id}.mp4`}
                                    >
                                        הדפדפן שלך לא תומך בתגית video.
                                    </video>
                                </div>
                                <p className="mt-4 text-sm text-on-surface-variant">
                                    סרטון סיכום בעברית המכסה את כל נושאי המודול — מיוצר באמצעות NotebookLM
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* Theory Content - Full Width */}
                    <div className="space-y-6 md:space-y-8" style={{ display: showSummary ? 'none' : undefined }}>
                        {theorySections.map((section, idx) => (
                            <motion.div
                                key={section.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                    opacity: activeSection === idx ? 1 : 0.3,
                                    y: 0,
                                    display: activeSection === idx ? 'block' : 'none'
                                }}
                                transition={{ delay: idx * 0.05 }}
                                className="theory-section-content rounded-2xl p-5 md:p-7 relative overflow-hidden"
                                style={{
                                    background: 'var(--surface-container-high)',
                                }}
                            >
                                {/* Left accent bar instead of border-r */}
                                {activeSection === idx && (
                                    <div className="absolute top-0 right-0 w-1 h-full gradient-cta" />
                                )}
                                <h2 className="text-xl md:text-2xl font-bold mb-5 text-on-surface flex items-center gap-3 font-display">
                                    <span className="text-xs md:text-sm px-2.5 py-1 rounded-lg text-primary" style={{ background: 'rgba(0,247,123,0.1)' }}>
                                        {section.id}
                                    </span>
                                    {section.title}
                                </h2>
                                {/* Render HTML content with proper RTL/LTR handling */}
                                <div
                                    className="prose prose-invert prose-sm md:prose-lg max-w-none
                                        prose-headings:text-on-surface prose-headings:font-bold prose-headings:font-display
                                        prose-p:text-on-surface-variant prose-p:leading-relaxed
                                        prose-code:bg-primary/15 prose-code:text-primary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm
                                        prose-pre:rounded-xl prose-pre:overflow-x-auto prose-pre:relative
                                        prose-strong:text-on-surface
                                        prose-ul:space-y-2 prose-li:text-on-surface-variant
                                        prose-table:border-collapse prose-table:rounded-xl prose-table:overflow-hidden
                                        prose-th:p-3 prose-th:text-sm prose-th:text-on-surface prose-th:font-bold
                                        prose-td:p-3 prose-td:text-on-surface-variant prose-td:text-sm
                                        [&_pre]:!dir-ltr [&_code]:!dir-ltr [&_.python]:!text-left"
                                    style={{
                                        // @ts-expect-error CSS custom properties
                                        '--tw-prose-pre-bg': 'var(--surface-container-lowest)',
                                        '--tw-prose-th-bg': 'var(--surface-container)',
                                        '--tw-prose-td-border-color': 'rgba(59,75,60,0.2)',
                                        '--tw-prose-th-border-color': 'rgba(59,75,60,0.2)',
                                    }}
                                    dangerouslySetInnerHTML={{ __html: section.content_html }}
                                />
                            </motion.div>
                        ))}
                    </div>

                    {/* Interactive Code Example - Collapsible */}
                    {interactiveCode && (
                        <motion.div
                            className="mt-10 md:mt-14"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            {/* Toggle Button — tonal surface, no border in resting state */}
                            <button
                                onClick={() => setShowSimulator(!showSimulator)}
                                className={`w-full p-5 rounded-2xl transition-all flex items-center justify-between ${showSimulator
                                        ? 'text-primary'
                                        : 'text-on-surface'
                                    }`}
                                style={{
                                    background: showSimulator ? 'rgba(0,247,123,0.08)' : 'var(--surface-container-high)',
                                    border: showSimulator ? '1px solid rgba(0,247,123,0.2)' : '1px solid transparent',
                                }}
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl">🔬</span>
                                    <div className="text-right">
                                        <h3 className="font-display font-bold text-lg">{interactiveCode.title}</h3>
                                        <p className="text-sm text-on-surface-variant">{interactiveCode.description}</p>
                                    </div>
                                </div>
                                <motion.div
                                    animate={{ rotate: showSimulator ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <svg className="w-6 h-6 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </motion.div>
                            </button>

                            {/* Simulator Panel */}
                            <AnimatePresence>
                                {showSimulator && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            {/* Code Stepper */}
                                            <div className="order-2 lg:order-1">
                                                <PyTutorStepper
                                                    code={interactiveCode.code}
                                                    steps={interactiveCode.steps}
                                                    title="סימולטור"
                                                    onStepChange={handleStepChange}
                                                />
                                            </div>

                                            {/* Memory Grid — tonal surface, no border */}
                                            <div
                                                className="order-1 lg:order-2 rounded-2xl p-5 min-h-[300px]"
                                                style={{ background: 'var(--surface-container)' }}
                                            >
                                                <h4 className="text-sm font-bold mb-4 flex items-center gap-2 text-on-surface font-display">
                                                    <span>🧠</span> זיכרון (RAM)
                                                </h4>
                                                <MemoryGrid slots={memorySlots} highlightedLine={highlightedLine} heapObjects={heapObjects} />
                                            </div>
                                        </div>

                                        {/* Concepts used badges */}
                                        <div className="mt-5 flex flex-wrap gap-2">
                                            <span className="text-xs text-on-surface-variant">קונספטים:</span>
                                            {interactiveCode.concepts_used.map((concept, idx) => (
                                                <span key={idx} className="text-xs text-primary px-2.5 py-1 rounded-full" dir="ltr" style={{ background: 'rgba(0,247,123,0.1)' }}>
                                                    {concept}
                                                </span>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {/* Practice Questions Preview — gradient tonal panel */}
                    {practiceQuestions.length > 0 && (
                        <motion.div
                            className="mt-10 md:mt-14 rounded-2xl p-5 md:p-7"
                            style={{
                                background: 'linear-gradient(135deg, rgba(0,247,123,0.08) 0%, transparent 70%)',
                                border: '1px solid rgba(0,247,123,0.15)',
                            }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <h3 className="text-lg md:text-xl font-bold text-primary font-display">שאלות תרגול</h3>
                                    <p className="text-on-surface-variant text-sm md:text-base mt-1">{practiceQuestions.length} שאלות בנושא זה</p>
                                </div>
                                <Link
                                    href={`/exam?module=${module.id}`}
                                    className="gradient-cta text-background-dark px-5 md:px-7 py-2.5 md:py-3 rounded-xl font-bold hover:opacity-90 transition-all text-center text-sm md:text-base shadow-[0_4px_16px_rgba(0,247,123,0.2)]"
                                >
                                    התחל תרגול →
                                </Link>
                            </div>
                        </motion.div>
                    )}

                    {/* Navigation — editorial spacing */}
                    <div className="mt-10 md:mt-14 flex flex-col sm:flex-row justify-between gap-5 pt-8 md:pt-10" style={{ borderTop: '1px solid rgba(59,75,60,0.2)' }}>
                        {prevModule ? (
                            <Link
                                href={`/learn/${prevModule.id}`}
                                className="flex items-center gap-3 text-on-surface-variant hover:text-primary transition-colors group"
                            >
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <div className="text-right">
                                    <span className="text-xs block text-on-surface-variant/60">הקודם</span>
                                    <span className="font-medium text-on-surface">{prevModule.title}</span>
                                </div>
                            </Link>
                        ) : <div />}

                        {nextModule ? (
                            <Link
                                href={`/learn/${nextModule.id}`}
                                className="flex items-center gap-3 text-on-surface-variant hover:text-primary transition-colors group sm:text-left"
                            >
                                <div className="text-right sm:text-left">
                                    <span className="text-xs block text-on-surface-variant/60">הבא</span>
                                    <span className="font-medium text-on-surface">{nextModule.title}</span>
                                </div>
                                <svg className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        ) : (
                            <Link
                                href="/exam/advanced"
                                className="flex items-center gap-3 text-primary hover:opacity-80 transition-opacity group"
                            >
                                <div className="text-right sm:text-left">
                                    <span className="text-xs block text-on-surface-variant/60">סיימת!</span>
                                    <span className="font-bold">עבור למבחן מסכם 🎯</span>
                                </div>
                            </Link>
                        )}
                    </div>

                    {/* Module Navigation Pills */}
                    <div className="mt-8 md:mt-10 pb-10">
                        <p className="text-xs text-on-surface-variant mb-3 tracking-widest uppercase">כל המודולים:</p>
                        <div className="flex flex-wrap gap-2">
                            {allModules.map((m) => (
                                <Link
                                    key={m.id}
                                    href={`/learn/${m.id}`}
                                    className={`px-3.5 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all ${m.id === module.id
                                            ? 'gradient-cta text-background-dark shadow-[0_2px_8px_rgba(0,247,123,0.15)]'
                                            : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                                        }`}
                                    style={m.id !== module.id ? { background: 'var(--surface-container-highest)' } : {}}
                                >
                                    {m.id}. {m.title}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
