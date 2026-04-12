"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import Link from "next/link";
import { timedExam, shuffleExamAnswers, EXAM_DURATION_MS } from "@/data/timedExam";
import { fixCodeDirection, renderNewlines } from "@/utils/bidi";

export default function TimedExamPage() {
    const [examStarted, setExamStarted] = useState(false);
    const [examFinished, setExamFinished] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
    const [shuffledQuestions, setShuffledQuestions] = useState(timedExam);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [timeRemaining, setTimeRemaining] = useState(EXAM_DURATION_MS);

    const handleSubmit = useCallback(() => {
        setExamFinished(true);
    }, []);

    useEffect(() => {
        if (!examStarted || examFinished || !startTime) return;

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, EXAM_DURATION_MS - elapsed);
            setTimeRemaining(remaining);
            if (remaining === 0) handleSubmit();
        }, 1000);

        return () => clearInterval(interval);
    }, [examStarted, examFinished, startTime, handleSubmit]);

    const handleStartExam = () => {
        const { questions } = shuffleExamAnswers(timedExam);
        setShuffledQuestions(questions);
        setStartTime(Date.now());
        setExamStarted(true);
    };

    const handleSelectAnswer = (questionId: number, optionIndex: number) => {
        setUserAnswers({ ...userAnswers, [questionId]: optionIndex });
    };

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const totalQuestions = shuffledQuestions.length;
    const answeredCount = Object.keys(userAnswers).length;
    const isWarning = timeRemaining < 600000; // < 10 min

    // ── Start Screen ──────────────────────────────────────
    if (!examStarted) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center p-6">
                    <div className="max-w-lg w-full rounded-2xl p-10 text-center" style={{ background: 'var(--surface-container-high)' }}>
                        <div className="text-6xl mb-6">⏱️</div>
                        <h1 className="font-display text-3xl font-black mb-3 text-on-surface">מבחן סיום מקיף</h1>
                        <p className="text-on-surface-variant mb-8">20 שאלות מאתגרות מכל החומר</p>

                        <div className="rounded-xl p-6 mb-6 text-right" style={{ background: 'var(--surface-container-lowest)' }}>
                            <h3 className="font-display font-bold mb-3 text-on-surface text-sm">הנחיות:</h3>
                            <ul className="text-sm text-on-surface-variant space-y-2">
                                <li>• משך המבחן: <span className="text-primary font-bold">שעתיים</span></li>
                                <li>• מספר שאלות: <span className="text-primary font-bold">20</span></li>
                                <li>• לא ניתן לראות תשובות במהלך המבחן</li>
                                <li>• הציון והתשובות יוצגו בסיום בלבד</li>
                                <li>• ניתן לדלג ולחזור לשאלות</li>
                            </ul>
                        </div>

                        <div className="rounded-xl p-4 mb-8" style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
                            <p className="text-orange-400 text-sm">
                                ⚠️ לאחר התחלת המבחן, הטיימר לא יעצור!
                            </p>
                        </div>

                        <button
                            onClick={handleStartExam}
                            className="w-full gradient-cta text-background-dark font-black py-4 rounded-xl text-lg hover:opacity-90 transition-all shadow-[0_8px_24px_rgba(0,247,123,0.25)]"
                        >
                            התחל מבחן
                        </button>

                        <Link href="/exam/final" className="block mt-5 text-on-surface-variant hover:text-primary text-sm transition-colors">
                            ← חזרה למאגר מבחנים
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    // ── Results Screen ──────────────────────────────────────
    if (examFinished) {
        let correctCount = 0;
        shuffledQuestions.forEach(q => {
            if (userAnswers[q.id] === q.correct) correctCount++;
        });
        const percentage = Math.round((correctCount / totalQuestions) * 100);

        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 p-5 md:p-8 overflow-auto">
                    <div className="max-w-3xl mx-auto">
                        {/* Score Card */}
                        <div className="rounded-2xl p-10 text-center mb-10" style={{ background: 'var(--surface-container-high)' }}>
                            <div
                                className="font-display text-7xl font-black mb-3"
                                style={percentage >= 60
                                    ? { background: 'linear-gradient(135deg, #00f77b, #63ff93)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }
                                    : { color: 'var(--error)' }}
                            >
                                {percentage}%
                            </div>
                            <p className="text-2xl mb-2 text-on-surface">{correctCount} מתוך {totalQuestions} תשובות נכונות</p>
                            <p className="text-on-surface-variant">
                                {percentage >= 90 ? '🏆 מצוין! מוכן למבחן!' :
                                    percentage >= 70 ? '👍 כל הכבוד! עוד קצת תרגול' :
                                        percentage >= 60 ? '✓ עברת! המשך לתרגל' :
                                            '📚 לא עברת, חזור על החומר'}
                            </p>
                        </div>

                        <h2 className="font-display text-2xl font-bold mb-5 text-on-surface">סקירת השאלות</h2>
                        <div className="space-y-4">
                            {shuffledQuestions.map((q, idx) => {
                                const userAnswer = userAnswers[q.id];
                                const isCorrect = userAnswer === q.correct;
                                const isUnanswered = userAnswer === undefined;

                                return (
                                    <div key={q.id} className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface-container)' }}>
                                        <div className="px-5 py-3 flex items-center justify-between" style={{
                                            background: isCorrect ? 'rgba(0,247,123,0.08)' : 'rgba(255,180,171,0.08)',
                                            borderBottom: '1px solid rgba(59,75,60,0.2)'
                                        }}>
                                            <span className="font-bold text-sm text-on-surface">שאלה {idx + 1}</span>
                                            <span className={isCorrect ? 'text-primary text-sm' : 'text-error text-sm'}>
                                                {isUnanswered ? '⚪ לא נענתה' : isCorrect ? '✓ נכון' : '✗ שגוי'}
                                            </span>
                                        </div>
                                        <div className="p-5">
                                            <p className="mb-3 text-sm text-on-surface">{q.question}</p>
                                            {q.code && (
                                                <pre className="rounded-xl p-3 mb-4 text-xs overflow-x-auto font-mono text-on-surface relative" style={{ background: 'var(--surface-container-lowest)' }} dir="ltr">
                                                    <div className="absolute top-0 left-0 w-0.5 h-full gradient-cta" />
                                                    {q.code.split('\n').map((line: string, idx: number) => (
                                                        <div key={idx} className="flex">
                                                            <span className="text-primary/25 w-6 select-none text-right mr-3 shrink-0">{idx + 1}</span>
                                                            <span>{line}</span>
                                                        </div>
                                                    ))}
                                                </pre>
                                            )}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                                                {q.options.map((opt, i) => (
                                                    <div
                                                        key={i}
                                                        className="p-3 rounded-xl text-sm flex items-start gap-2"
                                                        style={{
                                                            background: q.correct === i
                                                                ? 'rgba(0,247,123,0.1)'
                                                                : userAnswer === i
                                                                    ? 'rgba(255,180,171,0.08)'
                                                                    : 'var(--surface-container-high)',
                                                            border: q.correct === i
                                                                ? '1px solid rgba(0,247,123,0.2)'
                                                                : userAnswer === i
                                                                    ? '1px solid rgba(255,180,171,0.2)'
                                                                    : '1px solid transparent'
                                                        }}
                                                    >
                                                        <span className={`font-bold shrink-0 ${q.correct === i ? 'text-primary' : userAnswer === i ? 'text-error' : 'text-on-surface-variant'}`}>
                                                            {String.fromCharCode(1488 + i)}.
                                                        </span>
                                                        <span className={`flex flex-col ${q.correct === i ? 'text-primary' : userAnswer === i ? 'text-error' : 'text-on-surface-variant'}`}>
                                                            {renderNewlines(fixCodeDirection(opt)).split('\n').map((line, li) => (
                                                                <span key={li}>{line}</span>
                                                            ))}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="rounded-xl p-4" style={{ background: 'rgba(0,247,123,0.06)', border: '1px solid rgba(0,247,123,0.1)' }}>
                                                <p className="text-sm"><span className="text-primary font-bold">הסבר: </span><span className="text-on-surface-variant">{q.explanation}</span></p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-10 text-center">
                            <Link href="/exam/final" className="gradient-cta text-background-dark font-bold px-8 py-3 rounded-xl inline-block hover:opacity-90 transition-opacity shadow-[0_4px_16px_rgba(0,247,123,0.2)]">
                                חזרה למאגר מבחנים
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // ── Exam Screen ──────────────────────────────────────
    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            {/* Timer Bar — glass panel */}
            <div className="glass py-2.5 md:py-3 px-5 sticky top-[56px] z-40" style={{ borderBottom: '1px solid rgba(59,75,60,0.15)' }}>
                <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 md:gap-5">
                        <span className={`font-display text-lg md:text-2xl font-bold font-mono tabular-nums ${isWarning ? 'text-red-400 animate-pulse' : 'text-primary'}`}>
                            ⏱ {formatTime(timeRemaining)}
                        </span>
                        <span className="text-on-surface-variant text-xs md:text-sm">
                            {answeredCount}/{totalQuestions} נענו
                        </span>
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="px-4 md:px-6 py-2 text-white font-bold rounded-xl hover:opacity-90 text-xs md:text-sm transition-all"
                        style={{ background: 'rgba(239,68,68,0.8)', border: '1px solid rgba(239,68,68,0.4)' }}
                    >
                        סיים מבחן
                    </button>
                </div>
            </div>

            {/* Question Navigation */}
            <div className="py-2.5 px-5 overflow-x-auto" style={{ background: 'var(--surface-container-low)', borderBottom: '1px solid rgba(59,75,60,0.15)' }}>
                <div className="max-w-4xl mx-auto flex flex-wrap gap-1.5 md:gap-2 justify-center">
                    {shuffledQuestions.map((q, i) => (
                        <button
                            key={q.id}
                            onClick={() => setCurrentQuestionIndex(i)}
                            className={`w-8 h-8 md:w-9 md:h-9 rounded-lg font-bold text-xs transition-all ${
                                i === currentQuestionIndex
                                    ? 'gradient-cta text-background-dark shadow-[0_2px_8px_rgba(0,247,123,0.2)]'
                                    : userAnswers[q.id] !== undefined
                                        ? 'bg-primary/20 text-primary'
                                        : 'text-on-surface-variant hover:text-on-surface'
                            }`}
                            style={i !== currentQuestionIndex && userAnswers[q.id] === undefined ? { background: 'var(--surface-container-highest)' } : {}}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>

            {/* Question Content */}
            <main className="flex-1 p-4 md:p-7">
                <div className="max-w-3xl mx-auto">
                    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface-container-high)' }}>
                        <div className="px-5 py-3" style={{ background: 'rgba(0,247,123,0.04)', borderBottom: '1px solid rgba(59,75,60,0.2)' }}>
                            <span className="text-primary font-bold text-sm font-display">שאלה {currentQuestionIndex + 1} מתוך {totalQuestions}</span>
                        </div>
                        <div className="p-5 md:p-7">
                            <h2 className="text-base md:text-xl font-bold mb-5 text-on-surface">{currentQuestion.question}</h2>
                            {currentQuestion.code && (
                                <pre className="rounded-xl p-4 mb-5 md:mb-7 text-xs md:text-sm overflow-x-auto font-mono text-on-surface relative" style={{ background: 'var(--surface-container-lowest)' }} dir="ltr">
                                    <div className="absolute top-0 left-0 w-0.5 h-full gradient-cta" />
                                    {currentQuestion.code.split('\n').map((line: string, idx: number) => (
                                        <div key={idx} className="flex">
                                            <span className="text-primary/25 w-6 md:w-8 select-none text-right mr-3 md:mr-4 shrink-0">{idx + 1}</span>
                                            <span>{line}</span>
                                        </div>
                                    ))}
                                </pre>
                            )}
                            <div className="space-y-2.5">
                                {currentQuestion.options.map((opt, i) => (
                                    <div
                                        key={i}
                                        onClick={() => handleSelectAnswer(currentQuestion.id, i)}
                                        className="p-4 rounded-xl cursor-pointer flex items-center gap-3 transition-all ghost-border hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
                                        style={{
                                            background: userAnswers[currentQuestion.id] === i
                                                ? 'rgba(0,247,123,0.1)'
                                                : 'var(--surface-container-highest)'
                                        }}
                                    >
                                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                                            userAnswers[currentQuestion.id] === i
                                                ? 'gradient-cta text-background-dark'
                                                : 'text-on-surface-variant'
                                        }`} style={userAnswers[currentQuestion.id] !== i ? { background: 'var(--surface-container-low)' } : {}}>
                                            {String.fromCharCode(1488 + i)}
                                        </span>
                                        <div className="flex flex-col text-sm text-on-surface">
                                            {renderNewlines(fixCodeDirection(opt)).split('\n').map((line, i) => (
                                                <span key={i}>{line}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-4 md:p-6 flex justify-between" style={{ borderTop: '1px solid rgba(59,75,60,0.2)' }}>
                            <button
                                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                                disabled={currentQuestionIndex === 0}
                                className="px-5 md:px-6 py-2.5 rounded-xl font-bold text-sm disabled:opacity-30 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-all"
                            >
                                → הקודם
                            </button>
                            <button
                                onClick={() => setCurrentQuestionIndex(Math.min(totalQuestions - 1, currentQuestionIndex + 1))}
                                disabled={currentQuestionIndex === totalQuestions - 1}
                                className="px-5 md:px-6 py-2.5 gradient-cta text-background-dark font-bold rounded-xl disabled:opacity-30 text-sm hover:opacity-90 transition-all shadow-[0_4px_12px_rgba(0,247,123,0.15)]"
                            >
                                הבא ←
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
