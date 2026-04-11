"use client";

import { useState, useMemo, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import { questionBank, generateExam, getCategories, type ExamQuestion } from "@/data/examQuestions";
import { fixCodeDirection } from "@/utils/bidi";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

function AdvancedExamContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const examNumber = parseInt(searchParams.get('exam') || '1');

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [examComplete, setExamComplete] = useState(false);

    // Generate exam questions based on exam number (seed)
    const examQuestions = useMemo(() => {
        // Use exam number as seed for reproducible but different exams
        const shuffled = [...questionBank];
        const rng = (seed: number) => {
            let x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        };

        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(rng(examNumber * 1000 + i) * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return shuffled.slice(0, 20); // 20 questions per exam
    }, [examNumber]);

    const currentQuestion = examQuestions[currentQuestionIndex];
    const categories = getCategories();

    // Calculate score
    const score = useMemo(() => {
        return Object.entries(answers).filter(
            ([qIdx, ans]) => examQuestions[parseInt(qIdx)]?.correctAnswer === ans
        ).length;
    }, [answers, examQuestions]);

    const handleSelectAnswer = useCallback((optionIndex: number) => {
        if (showResult) return;
        setSelectedAnswer(optionIndex);
    }, [showResult]);

    const handleSubmitAnswer = useCallback(() => {
        if (selectedAnswer === null) return;

        if (!showResult) {
            // Show result
            setShowResult(true);
            setAnswers(prev => ({ ...prev, [currentQuestionIndex]: selectedAnswer }));
        } else {
            // Move to next question
            if (currentQuestionIndex < examQuestions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setSelectedAnswer(null);
                setShowResult(false);
            } else {
                setExamComplete(true);
            }
        }
    }, [selectedAnswer, showResult, currentQuestionIndex, examQuestions.length]);

    const handlePrevQuestion = useCallback(() => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
            const prevAnswer = answers[currentQuestionIndex - 1];
            setSelectedAnswer(prevAnswer ?? null);
            setShowResult(prevAnswer !== undefined);
        }
    }, [currentQuestionIndex, answers]);

    const startNewExam = useCallback(() => {
        router.push(`/exam/advanced?exam=${examNumber + 1}`);
    }, [router, examNumber]);

    const restartExam = useCallback(() => {
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setAnswers({});
        setExamComplete(false);
    }, []);

    if (examComplete) {
        const percentage = Math.round((score / examQuestions.length) * 100);
        const grade = percentage >= 90 ? 'מצוין!' : percentage >= 70 ? 'טוב מאוד!' : percentage >= 55 ? 'עובר' : 'צריך לתרגל עוד';

        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center p-6">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="max-w-lg w-full rounded-2xl p-8 text-center"
                        style={{ background: 'var(--surface-container-high)' }}
                    >
                        <div className="text-7xl mb-6">
                            {percentage >= 90 ? '🏆' : percentage >= 70 ? '🎉' : percentage >= 55 ? '👍' : '📚'}
                        </div>
                        <h1 className="font-display text-3xl font-black mb-2 text-on-surface">{grade}</h1>
                        <p className="text-on-surface-variant text-lg mb-6">
                            מבחן מסכם #{examNumber}
                        </p>

                        <div className="rounded-xl p-6 mb-6" style={{ background: 'var(--surface-container-lowest)' }}>
                            <div className={`font-display text-6xl font-black mb-2 ${percentage >= 55 ? '' : 'text-red-400'}`}
                                 style={percentage >= 55 ? { background: 'linear-gradient(135deg, #00f77b, #63ff93)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } : {}}>
                                {percentage}%
                            </div>
                            <p className="text-on-surface-variant text-lg">
                                {score} מתוך {examQuestions.length} תשובות נכונות
                            </p>
                        </div>

                        {/* Category breakdown */}
                        <div className="text-right mb-6 rounded-xl p-4" style={{ background: 'var(--surface-container)' }}>
                            <h3 className="font-bold mb-3 text-sm text-on-surface font-display">פירוט לפי קטגוריות:</h3>
                            {categories.map(cat => {
                                const catQuestions = examQuestions.filter(q => q.category === cat);
                                const catCorrect = catQuestions.filter((q, idx) =>
                                    answers[examQuestions.indexOf(q)] === q.correctAnswer
                                ).length;
                                if (catQuestions.length === 0) return null;
                                return (
                                    <div key={cat} className="flex justify-between items-center text-sm py-1">
                                        <span className="text-on-surface-variant">{cat}</span>
                                        <span className={catCorrect === catQuestions.length ? 'text-green-400' : 'text-on-surface'}>
                                            {catCorrect}/{catQuestions.length}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={startNewExam}
                                className="w-full gradient-cta text-background-dark py-4 rounded-xl font-bold hover:opacity-90 transition-opacity text-lg shadow-[0_4px_16px_rgba(0,247,123,0.2)]"
                            >
                                🎯 התחל מבחן חדש
                            </button>
                            <button
                                onClick={restartExam}
                                className="w-full py-3 rounded-xl font-medium text-on-surface-variant hover:text-on-surface transition-colors"
                                style={{ border: '1px solid rgba(59,75,60,0.3)' }}
                            >
                                🔄 נסה את המבחן הזה שוב
                            </button>
                            <Link
                                href="/"
                                className="w-full py-3 rounded-xl font-medium text-on-surface-variant hover:text-on-surface transition-colors inline-block text-center"
                                style={{ border: '1px solid rgba(59,75,60,0.3)' }}
                            >
                                חזרה לדף הבית
                            </Link>
                        </div>
                    </motion.div>
                </main>
            </div>
        );
    }

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            {/* Exam Info Bar — glassmorphism */}
            <div className="glass py-3 px-6 sticky top-[56px] z-40" style={{ borderBottom: '1px solid rgba(59,75,60,0.15)' }}>
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="font-display text-lg font-bold text-on-surface">מבחן מסכם #{examNumber}</span>
                        <span className="text-on-surface-variant text-sm">
                            20 שאלות • {currentQuestion.difficulty === 'easy' ? '⭐' : currentQuestion.difficulty === 'medium' ? '⭐⭐' : '⭐⭐⭐'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs px-3 py-1 rounded-full text-primary" style={{ background: 'rgba(0,247,123,0.1)' }}>
                            {currentQuestion.category}
                        </span>
                        {currentQuestion.trapProfile && (
                            <span className="text-xs px-3 py-1 rounded-full text-orange-400" style={{ background: 'rgba(249,115,22,0.12)' }}>
                                ⚠️ {currentQuestion.trapProfile}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Progress bar — signature gradient */}
            <div className="h-1" style={{ background: 'var(--surface-container-highest)' }}>
                <motion.div
                    className="h-full gradient-cta progress-glow"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestionIndex + 1) / examQuestions.length) * 100}%` }}
                />
            </div>

            {/* Main content */}
            <main className="flex-1 p-6">
                <div className="max-w-4xl mx-auto">
                    {/* Question header */}
                    <div className="flex items-center justify-between mb-6">
                        <span className="text-on-surface-variant">
                            שאלה {currentQuestionIndex + 1} מתוך {examQuestions.length}
                        </span>
                        <span className="text-on-surface-variant text-sm">
                            ✅ {score} נכונות
                        </span>
                    </div>

                    {/* Question text */}
                    <motion.div
                        key={currentQuestionIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h2 className="text-xl font-bold mb-5 text-on-surface">{currentQuestion.question}</h2>

                        {/* Code block — tonal with accent bar */}
                        <div className="rounded-xl p-5 mb-6 overflow-x-auto relative" style={{ background: 'var(--surface-container-lowest)' }} dir="ltr">
                            <div className="absolute top-0 left-0 w-0.5 h-full gradient-cta" />
                            <pre className="text-sm font-mono">
                                {currentQuestion.code.split('\n').map((line, idx) => (
                                    <div key={idx} className="flex">
                                        <span className="text-primary/25 w-8 select-none text-right mr-4 shrink-0">{idx + 1}</span>
                                        <span className="text-on-surface">{line}</span>
                                    </div>
                                ))}
                            </pre>
                        </div>

                        {/* Options — tonal surfaces */}
                        <div className="space-y-3 mb-6">
                            {currentQuestion.options.map((option, idx) => {
                                let bgStyle: React.CSSProperties = { background: 'var(--surface-container-highest)' };
                                let extraClass = "ghost-border hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)]";

                                if (showResult) {
                                    if (idx === currentQuestion.correctAnswer) {
                                        bgStyle = { background: 'rgba(0,247,123,0.12)' };
                                        extraClass = "shadow-[0_0_16px_rgba(0,247,123,0.08)]";
                                    } else if (idx === selectedAnswer && idx !== currentQuestion.correctAnswer) {
                                        bgStyle = { background: 'rgba(255,180,171,0.1)' };
                                        extraClass = "";
                                    }
                                } else if (idx === selectedAnswer) {
                                    bgStyle = { background: 'rgba(0,247,123,0.1)' };
                                    extraClass = "";
                                }

                                return (
                                    <motion.button
                                        key={idx}
                                        onClick={() => handleSelectAnswer(idx)}
                                        disabled={showResult}
                                        className={`w-full p-4 rounded-xl text-right transition-all ${extraClass}`}
                                        style={bgStyle}
                                        whileHover={!showResult ? { scale: 1.01 } : {}}
                                        whileTap={!showResult ? { scale: 0.99 } : {}}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${showResult && idx === currentQuestion.correctAnswer
                                                    ? 'bg-primary text-background-dark'
                                                    : showResult && idx === selectedAnswer
                                                        ? 'bg-error/20 text-error'
                                                        : idx === selectedAnswer
                                                            ? 'gradient-cta text-background-dark'
                                                            : 'text-on-surface-variant'
                                                }`} style={!(showResult && idx === currentQuestion.correctAnswer) && !(showResult && idx === selectedAnswer) && idx !== selectedAnswer ? { background: 'var(--surface-container-low)' } : {}}>
                                                {String.fromCharCode(65 + idx)}
                                            </span>
                                            <div className="font-mono flex flex-col text-on-surface">
                                                {fixCodeDirection(option).split('\n').map((line, i) => (
                                                    <span key={i}>{line}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Explanation */}
                        <AnimatePresence>
                            {showResult && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="p-5 rounded-2xl mb-6"
                                    style={{
                                        background: isCorrect ? 'rgba(0,247,123,0.08)' : 'rgba(255,180,171,0.08)',
                                        border: `1px solid ${isCorrect ? 'rgba(0,247,123,0.2)' : 'rgba(255,180,171,0.2)'}`,
                                    }}
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl">{isCorrect ? '✅' : '❌'}</span>
                                        <div>
                                            <p className={`font-bold mb-2 ${isCorrect ? 'text-primary' : 'text-error'}`}>
                                                {isCorrect ? 'נכון!' : 'לא נכון'}
                                            </p>
                                            <p className="text-on-surface-variant">{currentQuestion.explanation}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Navigation */}
                        <div className="flex gap-3">
                            <button
                                onClick={handlePrevQuestion}
                                disabled={currentQuestionIndex === 0}
                                className="px-6 py-3 rounded-xl font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                style={{ border: '1px solid rgba(59,75,60,0.2)' }}
                            >
                                ← הקודם
                            </button>
                            <button
                                onClick={handleSubmitAnswer}
                                disabled={selectedAnswer === null}
                                className="flex-1 py-3 rounded-xl font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed gradient-cta text-background-dark hover:opacity-90 shadow-[0_4px_16px_rgba(0,247,123,0.2)]"
                            >
                                {showResult
                                    ? (currentQuestionIndex === examQuestions.length - 1 ? 'סיים מבחן' : 'הבא →')
                                    : 'בדוק תשובה'
                                }
                            </button>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}

export default function AdvancedExamPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-6xl mb-4">📝</div>
                        <h1 className="font-display text-2xl font-bold mb-2 text-on-surface">טוען מבחן מסכם...</h1>
                    </div>
                </main>
            </div>
        }>
            <AdvancedExamContent />
        </Suspense>
    );
}
