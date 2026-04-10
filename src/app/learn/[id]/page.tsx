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
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
                    {/* Breadcrumbs */}
                    <nav className="flex flex-wrap gap-2 mb-6 md:mb-8 items-center text-sm">
                        <Link href="/" className="text-text-muted hover:text-primary transition-colors">
                            ראשי
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
                        className="flex flex-col gap-4 md:gap-6 mb-8 md:mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-4xl md:text-5xl font-black text-primary">{module.id}</span>
                            <div>
                                <h1 className="text-2xl md:text-4xl font-black leading-tight tracking-tight">
                                    {module.title}
                                </h1>
                                <p className="text-text-muted text-base md:text-lg" dir="ltr">{module.subtitle}</p>
                            </div>
                        </div>

                        {/* Learning Objectives */}
                        {module.learningObjectives && (
                            <div className="bg-surface-dark/50 border border-border-dark rounded-xl p-4 md:p-6">
                                <h3 className="text-base md:text-lg font-bold mb-3 text-primary">🎯 מטרות הלמידה</h3>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {module.learningObjectives.map((obj, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-slate-300 text-sm md:text-base">
                                            <span className="text-primary mt-0.5">✓</span>
                                            <span>{obj}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Section Navigation Tabs */}
                        <div className="flex flex-wrap gap-2 border-b border-border-dark pb-4">
                            {theorySections.map((section, idx) => (
                                <button
                                    key={section.id}
                                    onClick={() => { setActiveSection(idx); setShowSummary(false); }}
                                    className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${!showSummary && activeSection === idx
                                            ? 'bg-primary text-background-dark'
                                            : 'bg-surface-dark text-text-muted hover:bg-border-dark'
                                        }`}
                                >
                                    {section.title}
                                </button>
                            ))}
                            <button
                                onClick={() => setShowSummary(true)}
                                className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all flex items-center gap-1.5 ${showSummary
                                        ? 'bg-primary text-background-dark'
                                        : 'bg-surface-dark text-text-muted hover:bg-border-dark'
                                    }`}
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
                            className="mb-8 md:mb-12"
                        >
                            <div className="bg-surface-dark/30 rounded-xl p-4 md:p-6 border border-primary/30">
                                <h2 className="text-xl md:text-2xl font-bold mb-4 text-white flex items-center gap-3">
                                    <span className="text-primary text-xs md:text-sm bg-primary/20 px-2 py-1 rounded">🎬</span>
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
                                <p className="mt-3 text-sm text-text-muted">
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
                                className={`theory-section-content bg-surface-dark/30 rounded-xl p-4 md:p-6 border-r-4 ${activeSection === idx ? 'border-primary' : 'border-border-dark'
                                    }`}
                            >
                                <h2 className="text-xl md:text-2xl font-bold mb-4 text-white flex items-center gap-3">
                                    <span className="text-primary text-xs md:text-sm bg-primary/20 px-2 py-1 rounded">
                                        {section.id}
                                    </span>
                                    {section.title}
                                </h2>
                                {/* Render HTML content with proper RTL/LTR handling */}
                                <div
                                    className="prose prose-invert prose-sm md:prose-lg max-w-none
                                        prose-headings:text-white prose-headings:font-bold
                                        prose-p:text-slate-300 prose-p:leading-relaxed
                                        prose-code:bg-primary/20 prose-code:text-primary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm
                                        prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-border-dark prose-pre:rounded-xl prose-pre:overflow-x-auto
                                        prose-strong:text-white
                                        prose-ul:space-y-2 prose-li:text-slate-300
                                        prose-table:border-collapse prose-th:bg-surface-dark prose-th:p-2 prose-th:border prose-th:border-border-dark prose-th:text-sm
                                        prose-td:p-2 prose-td:border prose-td:border-border-dark prose-td:text-slate-300 prose-td:text-sm
                                        [&_pre]:!dir-ltr [&_code]:!dir-ltr [&_.python]:!text-left"
                                    dangerouslySetInnerHTML={{ __html: section.content_html }}
                                />
                            </motion.div>
                        ))}
                    </div>

                    {/* Interactive Code Example - Collapsible */}
                    {interactiveCode && (
                        <motion.div
                            className="mt-8 md:mt-12"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            {/* Toggle Button */}
                            <button
                                onClick={() => setShowSimulator(!showSimulator)}
                                className={`w-full p-4 rounded-xl border transition-all flex items-center justify-between ${showSimulator
                                        ? 'bg-primary/20 border-primary text-primary'
                                        : 'bg-surface-dark border-border-dark hover:border-primary/50'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">🔬</span>
                                    <div className="text-right">
                                        <h3 className="font-bold text-lg">{interactiveCode.title}</h3>
                                        <p className="text-sm text-text-muted">{interactiveCode.description}</p>
                                    </div>
                                </div>
                                <motion.div
                                    animate={{ rotate: showSimulator ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                                            {/* Memory Grid */}
                                            <div className="order-1 lg:order-2 bg-surface-dark rounded-xl border border-border-dark p-4 min-h-[300px]">
                                                <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                                                    <span>🧠</span> זיכרון (RAM)
                                                </h4>
                                                <MemoryGrid slots={memorySlots} highlightedLine={highlightedLine} heapObjects={heapObjects} />
                                            </div>
                                        </div>

                                        {/* Concepts used badges */}
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <span className="text-xs text-text-muted">קונספטים:</span>
                                            {interactiveCode.concepts_used.map((concept, idx) => (
                                                <span key={idx} className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full" dir="ltr">
                                                    {concept}
                                                </span>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {/* Practice Questions Preview */}
                    {practiceQuestions.length > 0 && (
                        <motion.div
                            className="mt-8 md:mt-12 bg-gradient-to-r from-primary/10 to-transparent rounded-xl p-4 md:p-6 border border-primary/30"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <h3 className="text-lg md:text-xl font-bold text-primary">📝 שאלות תרגול</h3>
                                    <p className="text-text-muted text-sm md:text-base">{practiceQuestions.length} שאלות בנושא זה</p>
                                </div>
                                <Link
                                    href={`/exam?module=${module.id}`}
                                    className="bg-primary text-background-dark px-4 md:px-6 py-2 md:py-3 rounded-xl font-bold hover:opacity-90 transition-opacity text-center text-sm md:text-base"
                                >
                                    התחל תרגול →
                                </Link>
                            </div>
                        </motion.div>
                    )}

                    {/* Navigation */}
                    <div className="mt-8 md:mt-12 flex flex-col sm:flex-row justify-between gap-4 border-t border-border-dark pt-6 md:pt-8">
                        {prevModule ? (
                            <Link
                                href={`/learn/${prevModule.id}`}
                                className="flex items-center gap-3 text-text-muted hover:text-primary transition-colors group"
                            >
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <div className="text-right">
                                    <span className="text-xs block">הקודם</span>
                                    <span className="font-medium">{prevModule.title}</span>
                                </div>
                            </Link>
                        ) : <div />}

                        {nextModule ? (
                            <Link
                                href={`/learn/${nextModule.id}`}
                                className="flex items-center gap-3 text-text-muted hover:text-primary transition-colors group sm:text-left"
                            >
                                <div className="text-right sm:text-left">
                                    <span className="text-xs block">הבא</span>
                                    <span className="font-medium">{nextModule.title}</span>
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
                                    <span className="text-xs block">סיימת!</span>
                                    <span className="font-bold">עבור למבחן מסכם 🎯</span>
                                </div>
                            </Link>
                        )}
                    </div>

                    {/* Module Navigation Pills */}
                    <div className="mt-6 md:mt-8 pb-8">
                        <p className="text-xs text-text-muted mb-3">כל המודולים:</p>
                        <div className="flex flex-wrap gap-2">
                            {allModules.map((m) => (
                                <Link
                                    key={m.id}
                                    href={`/learn/${m.id}`}
                                    className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all ${m.id === module.id
                                            ? 'bg-primary text-background-dark'
                                            : 'bg-surface-dark text-text-muted hover:bg-border-dark'
                                        }`}
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
