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
                        className="max-w-lg w-full bg-surface-dark rounded-2xl p-8 text-center border border-border-dark"
                    >
                        <div className="text-7xl mb-6">
                            {percentage >= 90 ? '🏆' : percentage >= 70 ? '🎉' : percentage >= 55 ? '👍' : '📚'}
                        </div>
                        <h1 className="text-3xl font-black mb-2">{grade}</h1>
                        <p className="text-text-muted text-lg mb-6">
                            מבחן מסכם #{examNumber}
                        </p>

                        <div className="bg-background-dark rounded-xl p-6 mb-6">
                            <div className={`text-6xl font-black mb-2 ${percentage >= 55 ? 'text-primary' : 'text-red-400'}`}>
                                {percentage}%
                            </div>
                            <p className="text-text-muted text-lg">
                                {score} מתוך {examQuestions.length} תשובות נכונות
                            </p>
                        </div>

                        {/* Category breakdown */}
                        <div className="text-right mb-6 bg-background-dark/50 rounded-xl p-4">
                            <h3 className="font-bold mb-3 text-sm">פירוט לפי קטגוריות:</h3>
                            {categories.map(cat => {
                                const catQuestions = examQuestions.filter(q => q.category === cat);
                                const catCorrect = catQuestions.filter((q, idx) =>
                                    answers[examQuestions.indexOf(q)] === q.correctAnswer
                                ).length;
                                if (catQuestions.length === 0) return null;
                                return (
                                    <div key={cat} className="flex justify-between items-center text-sm py-1">
                                        <span className="text-text-muted">{cat}</span>
                                        <span className={catCorrect === catQuestions.length ? 'text-green-400' : 'text-white'}>
                                            {catCorrect}/{catQuestions.length}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={startNewExam}
                                className="w-full bg-primary text-background-dark py-4 rounded-xl font-bold hover:opacity-90 transition-opacity text-lg"
                            >
                                🎯 התחל מבחן חדש
                            </button>
                            <button
                                onClick={restartExam}
                                className="w-full border border-border-dark py-3 rounded-xl font-medium hover:bg-surface-dark transition-colors"
                            >
                                🔄 נסה את המבחן הזה שוב
                            </button>
                            <Link
                                href="/"
                                className="w-full border border-border-dark py-3 rounded-xl font-medium hover:bg-surface-dark transition-colors inline-block"
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

            {/* Exam Info Bar */}
            <div className="bg-surface-dark border-b border-border-dark py-3 px-6">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-lg font-bold">מבחן מסכם #{examNumber}</span>
                        <span className="text-text-muted text-sm">
                            20 שאלות • {currentQuestion.difficulty === 'easy' ? '⭐' : currentQuestion.difficulty === 'medium' ? '⭐⭐' : '⭐⭐⭐'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full">
                            {currentQuestion.category}
                        </span>
                        {currentQuestion.trapProfile && (
                            <span className="text-xs bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full">
                                ⚠️ {currentQuestion.trapProfile}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-border-dark">
                <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestionIndex + 1) / examQuestions.length) * 100}%` }}
                />
            </div>

            {/* Main content */}
            <main className="flex-1 p-6">
                <div className="max-w-4xl mx-auto">
                    {/* Question header */}
                    <div className="flex items-center justify-between mb-6">
                        <span className="text-text-muted">
                            שאלה {currentQuestionIndex + 1} מתוך {examQuestions.length}
                        </span>
                        <span className="text-text-muted text-sm">
                            ✅ {score} נכונות
                        </span>
                    </div>

                    {/* Question text */}
                    <motion.div
                        key={currentQuestionIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h2 className="text-xl font-bold mb-4">{currentQuestion.question}</h2>

                        {/* Code block */}
                        <div className="bg-[#0a150e] rounded-xl border border-primary/20 p-4 mb-6 overflow-x-auto" dir="ltr">
                            <pre className="text-sm font-mono">
                                {currentQuestion.code.split('\n').map((line, idx) => (
                                    <div key={idx} className="flex">
                                        <span className="text-primary/30 w-8 select-none text-right mr-4">{idx + 1}</span>
                                        <span className="text-white">{line}</span>
                                    </div>
                                ))}
                            </pre>
                        </div>

                        {/* Options */}
                        <div className="space-y-3 mb-6">
                            {currentQuestion.options.map((option, idx) => {
                                let bgClass = "bg-surface-dark hover:bg-border-dark/50";
                                let borderClass = "border-border-dark";

                                if (showResult) {
                                    if (idx === currentQuestion.correctAnswer) {
                                        bgClass = "bg-green-500/20";
                                        borderClass = "border-green-500";
                                    } else if (idx === selectedAnswer && idx !== currentQuestion.correctAnswer) {
                                        bgClass = "bg-red-500/20";
                                        borderClass = "border-red-500";
                                    }
                                } else if (idx === selectedAnswer) {
                                    bgClass = "bg-primary/20";
                                    borderClass = "border-primary";
                                }

                                return (
                                    <motion.button
                                        key={idx}
                                        onClick={() => handleSelectAnswer(idx)}
                                        disabled={showResult}
                                        className={`w-full p-4 rounded-xl border ${borderClass} ${bgClass} text-right transition-all`}
                                        whileHover={!showResult ? { scale: 1.01 } : {}}
                                        whileTap={!showResult ? { scale: 0.99 } : {}}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${showResult && idx === currentQuestion.correctAnswer
                                                    ? 'bg-green-500 text-white'
                                                    : showResult && idx === selectedAnswer
                                                        ? 'bg-red-500 text-white'
                                                        : idx === selectedAnswer
                                                            ? 'bg-primary text-background-dark'
                                                            : 'bg-border-dark'
                                                }`}>
                                                {String.fromCharCode(65 + idx)}
                                            </span>
                                            <div className="font-mono flex flex-col">
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
                                    className={`p-4 rounded-xl mb-6 ${isCorrect ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl">{isCorrect ? '✅' : '❌'}</span>
                                        <div>
                                            <p className={`font-bold mb-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                                {isCorrect ? 'נכון!' : 'לא נכון'}
                                            </p>
                                            <p className="text-text-muted">{currentQuestion.explanation}</p>
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
                                className="px-6 py-3 rounded-xl border border-border-dark font-medium hover:bg-surface-dark transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                ← הקודם
                            </button>
                            <button
                                onClick={handleSubmitAnswer}
                                disabled={selectedAnswer === null}
                                className={`flex-1 py-3 rounded-xl font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed ${showResult
                                        ? 'bg-primary text-background-dark hover:opacity-90'
                                        : 'bg-primary text-background-dark hover:opacity-90'
                                    }`}
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
                        <h1 className="text-2xl font-bold mb-2">טוען מבחן מסכם...</h1>
                    </div>
                </main>
            </div>
        }>
            <AdvancedExamContent />
        </Suspense>
    );
}
