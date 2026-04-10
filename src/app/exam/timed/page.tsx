"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import Link from "next/link";
import { timedExam, shuffleExamAnswers, EXAM_DURATION_MS } from "@/data/timedExam";
import { fixCodeDirection } from "@/utils/bidi";

export default function TimedExamPage() {
    const [examStarted, setExamStarted] = useState(false);
    const [examFinished, setExamFinished] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
    const [shuffledQuestions, setShuffledQuestions] = useState(timedExam);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [timeRemaining, setTimeRemaining] = useState(EXAM_DURATION_MS);

    // Timer effect
    useEffect(() => {
        if (!examStarted || examFinished || !startTime) return;

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, EXAM_DURATION_MS - elapsed);
            setTimeRemaining(remaining);

            if (remaining === 0) {
                handleSubmit();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [examStarted, examFinished, startTime]);

    const handleStartExam = () => {
        const { questions } = shuffleExamAnswers(timedExam);
        setShuffledQuestions(questions);
        setStartTime(Date.now());
        setExamStarted(true);
    };

    const handleSubmit = useCallback(() => {
        setExamFinished(true);
    }, []);

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

    // Start screen
    if (!examStarted) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center p-6">
                    <div className="max-w-lg w-full bg-surface-dark rounded-2xl border border-border-dark p-8 text-center">
                        <div className="text-6xl mb-6">⏱️</div>
                        <h1 className="text-3xl font-black mb-4">מבחן סיום מקיף</h1>
                        <p className="text-text-muted mb-6">20 שאלות מאתגרות מכל החומר</p>

                        <div className="bg-background-dark rounded-xl p-6 mb-6 text-right">
                            <h3 className="font-bold mb-3">📋 הנחיות:</h3>
                            <ul className="text-sm text-text-muted space-y-2">
                                <li>• משך המבחן: <span className="text-primary font-bold">שעתיים</span></li>
                                <li>• מספר שאלות: <span className="text-primary font-bold">20</span></li>
                                <li>• לא ניתן לראות תשובות במהלך המבחן</li>
                                <li>• הציון והתשובות יוצגו בסיום בלבד</li>
                                <li>• ניתן לדלג ולחזור לשאלות</li>
                            </ul>
                        </div>

                        <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mb-6">
                            <p className="text-orange-400 text-sm">
                                ⚠️ לאחר התחלת המבחן, הטיימר לא יעצור!
                            </p>
                        </div>

                        <button
                            onClick={handleStartExam}
                            className="w-full bg-primary text-background-dark font-black py-4 rounded-xl text-lg hover:opacity-90 transition-opacity"
                        >
                            🚀 התחל מבחן
                        </button>

                        <Link href="/exam/final" className="block mt-4 text-text-muted hover:text-primary text-sm">
                            ← חזרה למאגר מבחנים
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    // Results screen
    if (examFinished) {
        let correctCount = 0;
        shuffledQuestions.forEach(q => {
            if (userAnswers[q.id] === q.correct) correctCount++;
        });
        const percentage = Math.round((correctCount / totalQuestions) * 100);

        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 p-6 overflow-auto">
                    <div className="max-w-3xl mx-auto">
                        {/* Score Card */}
                        <div className="bg-surface-dark rounded-xl border border-border-dark p-8 text-center mb-8">
                            <div className={`text-7xl font-black mb-4 ${percentage >= 60 ? 'text-primary' : 'text-red-400'}`}>
                                {percentage}%
                            </div>
                            <p className="text-2xl mb-2">{correctCount} מתוך {totalQuestions} תשובות נכונות</p>
                            <p className="text-text-muted text-lg">
                                {percentage >= 90 ? '🏆 מצוין! מוכן למבחן!' :
                                    percentage >= 70 ? '👍 כל הכבוד! עוד קצת תרגול' :
                                        percentage >= 60 ? '✓ עברת! המשך לתרגל' :
                                            '📚 לא עברת, חזור על החומר'}
                            </p>
                        </div>

                        {/* Questions Review */}
                        <h2 className="text-2xl font-bold mb-4">📋 סקירת השאלות</h2>
                        <div className="space-y-4">
                            {shuffledQuestions.map((q, idx) => {
                                const userAnswer = userAnswers[q.id];
                                const isCorrect = userAnswer === q.correct;
                                const isUnanswered = userAnswer === undefined;

                                return (
                                    <div key={q.id} className="bg-surface-dark rounded-xl border border-border-dark overflow-hidden">
                                        <div className={`p-3 flex items-center justify-between ${isCorrect ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                                            <span className="font-bold">שאלה {idx + 1}</span>
                                            <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>
                                                {isUnanswered ? '⚪ לא נענתה' : isCorrect ? '✓ נכון' : '✗ שגוי'}
                                            </span>
                                        </div>
                                        <div className="p-4">
                                            <p className="mb-2 text-sm">{q.question}</p>
                                            {q.code && (
                                                <pre className="bg-background-dark p-3 rounded-lg mb-3 text-xs overflow-x-auto text-left font-mono" dir="ltr">
                                                    {q.code.split('\n').map((line: string, idx: number) => (
                                                        <div key={idx} className="flex">
                                                            <span className="text-primary/30 w-6 select-none text-right mr-3 shrink-0">{idx + 1}</span>
                                                            <span className="text-white">{line}</span>
                                                        </div>
                                                    ))}
                                                </pre>
                                            )}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                                                {q.options.map((opt, i) => (
                                                    <div
                                                        key={i}
                                                        className={`p-2 rounded-lg text-sm ${q.correct === i
                                                            ? 'bg-green-500/20 border border-green-500'
                                                            : userAnswer === i
                                                                ? 'bg-red-500/20 border border-red-500'
                                                                : 'bg-border-dark/30'
                                                            }`}
                                                    >
                                                        <span className="font-bold ml-2">{String.fromCharCode(1488 + i)}.</span>
                                                        <span className="flex flex-col">
                                                            {fixCodeDirection(opt).split('\n').map((line, li) => (
                                                                <span key={li}>{line}</span>
                                                            ))}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
                                                <p className="text-sm"><span className="text-primary font-bold">הסבר:</span> {q.explanation}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-8 text-center">
                            <Link href="/exam/final" className="bg-primary text-background-dark font-bold px-8 py-3 rounded-xl">
                                חזרה למאגר מבחנים
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // Exam screen
    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            {/* Timer Bar */}
            <div className="bg-surface-dark border-b border-border-dark p-2 md:p-3 sticky top-16 z-40">
                <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 md:gap-4">
                        <span className={`text-lg md:text-2xl font-mono font-bold ${timeRemaining < 600000 ? 'text-red-400 animate-pulse' : 'text-primary'}`}>
                            ⏱️ {formatTime(timeRemaining)}
                        </span>
                        <span className="text-text-muted text-xs md:text-sm">
                            {answeredCount}/{totalQuestions} נענו
                        </span>
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="px-3 md:px-6 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 text-sm md:text-base"
                    >
                        סיים מבחן
                    </button>
                </div>
            </div>

            {/* Question Navigation */}
            <div className="bg-background-dark p-2 md:p-3 border-b border-border-dark overflow-x-auto">
                <div className="max-w-4xl mx-auto flex flex-wrap gap-1 md:gap-2 justify-center">
                    {shuffledQuestions.map((q, i) => (
                        <button
                            key={q.id}
                            onClick={() => setCurrentQuestionIndex(i)}
                            className={`w-8 h-8 md:w-10 md:h-10 rounded-lg font-bold text-xs md:text-sm ${i === currentQuestionIndex
                                ? 'ring-2 ring-primary bg-primary/20'
                                : userAnswers[q.id] !== undefined
                                    ? 'bg-primary text-background-dark'
                                    : 'bg-border-dark text-text-muted'
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>

            {/* Question Content */}
            <main className="flex-1 p-3 md:p-6">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-surface-dark rounded-xl border border-border-dark overflow-hidden">
                        <div className="p-4 bg-border-dark/30 border-b border-border-dark">
                            <span className="text-primary font-bold">שאלה {currentQuestionIndex + 1} מתוך {totalQuestions}</span>
                        </div>
                        <div className="p-6">
                            <h2 className="text-base md:text-xl font-bold mb-4">{currentQuestion.question}</h2>
                            {currentQuestion.code && (
                                <pre className="bg-background-dark p-3 md:p-4 rounded-lg mb-4 md:mb-6 text-xs md:text-sm overflow-x-auto text-left font-mono" dir="ltr">
                                    {currentQuestion.code.split('\n').map((line: string, idx: number) => (
                                        <div key={idx} className="flex">
                                            <span className="text-primary/30 w-6 md:w-8 select-none text-right mr-3 md:mr-4 shrink-0">{idx + 1}</span>
                                            <span className="text-white">{line}</span>
                                        </div>
                                    ))}
                                </pre>
                            )}
                            <div className="space-y-3">
                                {currentQuestion.options.map((opt, i) => (
                                    <div
                                        key={i}
                                        onClick={() => handleSelectAnswer(currentQuestion.id, i)}
                                        className={`p-4 rounded-lg border cursor-pointer flex items-center gap-3 transition-all ${userAnswers[currentQuestion.id] === i
                                            ? 'border-primary bg-primary/10'
                                            : 'border-border-dark hover:border-primary/50'
                                            }`}
                                    >
                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${userAnswers[currentQuestion.id] === i
                                            ? 'bg-primary text-background-dark'
                                            : 'border-2 border-text-muted text-text-muted'
                                            }`}>
                                            {String.fromCharCode(1488 + i)}
                                        </span>
                                        <div className="flex flex-col">
                                            {fixCodeDirection(opt).split('\n').map((line, i) => (
                                                <span key={i}>{line}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-4 border-t border-border-dark flex justify-between">
                            <button
                                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                                disabled={currentQuestionIndex === 0}
                                className="px-6 py-2 bg-border-dark rounded-lg disabled:opacity-50"
                            >
                                → הקודם
                            </button>
                            <button
                                onClick={() => setCurrentQuestionIndex(Math.min(totalQuestions - 1, currentQuestionIndex + 1))}
                                disabled={currentQuestionIndex === totalQuestions - 1}
                                className="px-6 py-2 bg-primary text-background-dark font-bold rounded-lg disabled:opacity-50"
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
