"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Link from "next/link";
import { getShuffledExam, getAllFinalExams, type FinalExam } from "@/data/finalExams";
import { fixCodeDirection, renderNewlines } from "@/utils/bidi";

function FinalExamContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const examId = searchParams.get('id');

    const [currentExam, setCurrentExam] = useState<FinalExam | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
    const [, setExamSubmitted] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);
    const [view, setView] = useState<'library' | 'exam' | 'results'>('library');

    useEffect(() => {
        if (examId) {
            const exam = getShuffledExam(examId);
            if (exam) {
                setCurrentExam(exam);
                setView('exam');
            }
        } else {
            setView('library');
            setCurrentExam(null);
        }
    }, [examId]);

    const allExams = getAllFinalExams();
    const currentQuestion = currentExam?.questions[currentQuestionIndex];
    const totalQuestions = currentExam?.questions.length || 0;
    const answeredCount = Object.keys(userAnswers).length;

    const handleSelectAnswer = (questionId: number, optionIndex: number) => {
        setUserAnswers({ ...userAnswers, [questionId]: optionIndex });
    };

    const handleNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setShowExplanation(false);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setShowExplanation(false);
        }
    };

    const handleGoToQuestion = (index: number) => {
        setCurrentQuestionIndex(index);
        setShowExplanation(false);
    };

    const handleSubmit = () => {
        const unanswered = totalQuestions - answeredCount;
        if (unanswered > 0) {
            if (!confirm(`יש ${unanswered} שאלות לא נענו. להגיש בכל זאת?`)) {
                return;
            }
        }
        setExamSubmitted(true);
        setView('results');
    };

    const handleRetake = () => {
        setCurrentQuestionIndex(0);
        setUserAnswers({});
        setExamSubmitted(false);
        setShowExplanation(false);
        setView('exam');
    };

    const handleBackToLibrary = () => {
        router.push('/exam/final');
        setView('library');
        setCurrentExam(null);
        setUserAnswers({});
        setExamSubmitted(false);
        setShowExplanation(false);
    };

    // ── Library View ──────────────────────────────────────
    if (view === 'library') {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 p-5 md:p-8">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-10">
                            <h1 className="font-display text-3xl md:text-4xl font-black mb-2 text-on-surface">מאגר מבחנים</h1>
                            <p className="text-on-surface-variant text-sm md:text-base">4 מבחנים ברמת המרצה · 80 שאלות ייחודיות</p>
                        </div>

                        {/* Timed Exam Featured Card — gradient accent */}
                        <div className="mb-10">
                            <Link href="/exam/timed">
                                <div
                                    className="rounded-2xl p-6 md:p-8 hover:opacity-95 transition-all hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] group"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(249,115,22,0.08) 100%)',
                                        border: '1px solid rgba(239,68,68,0.2)',
                                    }}
                                >
                                    <div className="flex flex-col md:flex-row items-center gap-5 md:gap-8">
                                        <div className="text-5xl md:text-6xl">⏱️</div>
                                        <div className="flex-1 text-center md:text-right">
                                            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                                <h3 className="font-display text-xl md:text-2xl font-black text-on-surface">מבחן סיום מקיף</h3>
                                                <span className="text-xs px-3 py-1 rounded-full text-red-400" style={{ background: 'rgba(239,68,68,0.15)' }}>
                                                    מבחן אמיתי
                                                </span>
                                            </div>
                                            <p className="text-on-surface-variant text-sm mb-4">20 שאלות מאתגרות | שעתיים | ציון בסיום</p>
                                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                                <span className="text-xs px-2 py-1 rounded-lg text-on-surface-variant" style={{ background: 'var(--surface-container-highest)' }}>⏰ מוגבל בזמן</span>
                                                <span className="text-xs px-2 py-1 rounded-lg text-on-surface-variant" style={{ background: 'var(--surface-container-highest)' }}>🔒 ללא הסברים</span>
                                                <span className="text-xs px-2 py-1 rounded-lg text-on-surface-variant" style={{ background: 'var(--surface-container-highest)' }}>🎲 מעורבל</span>
                                            </div>
                                        </div>
                                        <div className="text-primary font-bold text-sm group-hover:translate-x-1 transition-transform">
                                            התחל מבחן ←
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        <h2 className="font-display text-xl font-bold mb-5 text-on-surface">מבחני תרגול (ללא מגבלת זמן)</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {allExams.map((exam) => (
                                <div
                                    key={exam.id}
                                    className="rounded-2xl overflow-hidden card-hover flex flex-col"
                                    style={{ background: 'var(--surface-container)' }}
                                >
                                    <div className="p-6 flex-1">
                                        <div className="flex items-center justify-between mb-5">
                                            <span className="text-4xl">📋</span>
                                            <span className={`text-xs px-3 py-1 rounded-full ${
                                                exam.difficulty === 'גבוהה מאוד'
                                                    ? 'text-red-400'
                                                    : 'text-orange-400'
                                            }`} style={{ background: exam.difficulty === 'גבוהה מאוד' ? 'rgba(239,68,68,0.12)' : 'rgba(249,115,22,0.12)' }}>
                                                {exam.difficulty}
                                            </span>
                                        </div>
                                        <h3 className="font-display text-lg font-bold mb-2 text-on-surface">{exam.title}</h3>
                                        <p className="text-on-surface-variant text-sm mb-5">{exam.description}</p>
                                        <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-5">
                                            <span>❓</span>
                                            <span>{exam.questions.length} שאלות</span>
                                            <span className="text-primary">· הסברים מיידיים</span>
                                        </div>
                                    </div>
                                    <div className="p-5 pt-0">
                                        <Link
                                            href={`/exam/final?id=${exam.id}`}
                                            className="block w-full gradient-cta text-background-dark font-bold py-3 rounded-xl text-center hover:opacity-90 transition-all text-sm shadow-[0_4px_12px_rgba(0,247,123,0.15)]"
                                        >
                                            התחל תרגול
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 text-center">
                            <Link href="/" className="text-on-surface-variant hover:text-primary transition-colors text-sm">
                                ← חזרה לדף הבית
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // ── Results View ──────────────────────────────────────
    if (view === 'results' && currentExam) {
        let correctCount = 0;
        currentExam.questions.forEach(q => {
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
                            <div className={`font-display text-7xl font-black mb-3 ${percentage >= 60 ? '' : 'text-red-400'}`}
                                 style={percentage >= 60 ? { background: 'linear-gradient(135deg, #00f77b, #63ff93)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } : {}}
                            >
                                {percentage}%
                            </div>
                            <p className="text-lg md:text-xl mb-2 text-on-surface">{correctCount} מתוך {totalQuestions} תשובות נכונות</p>
                            <p className="text-on-surface-variant text-sm">
                                {percentage >= 90 ? '🏆 מצוין!' : percentage >= 70 ? '👍 טוב מאוד!' : percentage >= 60 ? '✓ עברת!' : '📚 צריך תרגול'}
                            </p>
                        </div>

                        <h2 className="font-display text-xl md:text-2xl font-bold mb-5 text-on-surface">סקירת השאלות</h2>
                        <div className="space-y-4 md:space-y-5">
                            {currentExam.questions.map((q, idx) => {
                                const userAnswer = userAnswers[q.id];
                                const isCorrect = userAnswer === q.correct;
                                const isUnanswered = userAnswer === undefined;

                                return (
                                    <div key={q.id} className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface-container)' }}>
                                        <div className={`px-5 py-3 flex items-center justify-between`}
                                             style={{ background: isCorrect ? 'rgba(0,247,123,0.08)' : 'rgba(255,180,171,0.08)', borderBottom: '1px solid rgba(59,75,60,0.2)' }}>
                                            <span className="font-bold text-sm text-on-surface">שאלה {idx + 1}</span>
                                            <span className={`flex items-center gap-2 text-sm ${isCorrect ? 'text-primary' : 'text-error'}`}>
                                                {isUnanswered ? '⚪ לא נענתה' : isCorrect ? '✓ נכון' : '✗ שגוי'}
                                            </span>
                                        </div>
                                        <div className="p-5 md:p-6">
                                            <p className="mb-3 text-sm md:text-base text-on-surface">{q.question}</p>
                                            {q.code && (
                                                <pre className="rounded-xl p-4 mb-5 text-xs md:text-sm overflow-x-auto font-mono text-on-surface" style={{ background: 'var(--surface-container-lowest)' }} dir="ltr">
                                                    {q.code.split('\n').map((line: string, idx: number) => (
                                                        <div key={idx} className="flex">
                                                            <span className="text-primary/25 w-6 md:w-8 select-none text-right mr-3 md:mr-4 shrink-0">{idx + 1}</span>
                                                            <span>{line}</span>
                                                        </div>
                                                    ))}
                                                </pre>
                                            )}
                                            <div className="space-y-2 mb-5">
                                                {q.options.map((opt, i) => (
                                                    <div
                                                        key={i}
                                                        className={`p-3 rounded-xl flex items-center gap-3 text-sm`}
                                                        style={{
                                                            background: q.correct === i
                                                                ? 'rgba(0,247,123,0.1)'
                                                                : userAnswer === i && userAnswer !== q.correct
                                                                    ? 'rgba(255,180,171,0.08)'
                                                                    : 'var(--surface-container-high)'
                                                        }}
                                                    >
                                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                                            q.correct === i
                                                                ? 'bg-primary text-background-dark'
                                                                : userAnswer === i
                                                                    ? 'bg-error/20 text-error'
                                                                    : 'text-on-surface-variant'
                                                        }`} style={q.correct !== i && userAnswer !== i ? { border: '1px solid rgba(59,75,60,0.3)' } : {}}>
                                                            {String.fromCharCode(65 + i)}
                                                        </span>
                                                        <div className={`flex flex-col ${
                                                            q.correct === i ? 'text-primary' : userAnswer === i && userAnswer !== q.correct ? 'text-error' : 'text-on-surface-variant'
                                                        }`}>
                                                            {renderNewlines(fixCodeDirection(opt)).split('\n').map((line, li) => (
                                                                <span key={li}>{line}</span>
                                                            ))}
                                                        </div>
                                                        {q.correct === i && <span className="mr-auto text-primary">✓</span>}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="rounded-xl p-4" style={{ background: 'var(--surface-container-lowest)', border: '1px solid rgba(0,247,123,0.1)' }}>
                                                <p className="text-sm text-primary font-bold mb-1">💡 הסבר:</p>
                                                <p className="text-on-surface-variant text-sm whitespace-pre-wrap">{q.explanation}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
                            <button
                                onClick={handleRetake}
                                className="px-8 py-3 gradient-cta text-background-dark font-bold rounded-xl hover:opacity-90 shadow-[0_4px_16px_rgba(0,247,123,0.2)]"
                            >
                                נסה שוב
                            </button>
                            <button
                                onClick={handleBackToLibrary}
                                className="px-8 py-3 font-medium rounded-xl text-on-surface-variant hover:text-on-surface transition-colors"
                                style={{ border: '1px solid rgba(59,75,60,0.3)' }}
                            >
                                ← חזרה למאגר
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // ── Exam View ──────────────────────────────────────
    if (view === 'exam' && currentExam && currentQuestion) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />

                {/* Exam Header Bar */}
                <div className="glass py-3 md:py-4 px-5 sticky top-[56px] z-40" style={{ borderBottom: '1px solid rgba(59,75,60,0.15)' }}>
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <button onClick={handleBackToLibrary} className="text-on-surface-variant hover:text-on-surface transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <h1 className="font-display font-bold text-on-surface text-sm md:text-base">{currentExam.title}</h1>
                            </div>
                            <div className="flex items-center gap-3 md:gap-5">
                                <span className="text-on-surface-variant text-xs md:text-sm">
                                    <span className="text-primary font-bold">{answeredCount}</span>/{totalQuestions} נענו
                                </span>
                                <button
                                    onClick={handleSubmit}
                                    className="px-4 py-2 gradient-cta text-background-dark font-bold rounded-xl hover:opacity-90 text-xs md:text-sm shadow-[0_2px_8px_rgba(0,247,123,0.2)]"
                                >
                                    הגש מבחן
                                </button>
                            </div>
                        </div>

                        {/* Question Navigation Pills */}
                        <div className="flex flex-wrap gap-2">
                            {currentExam.questions.map((q, i) => (
                                <button
                                    key={q.id}
                                    onClick={() => handleGoToQuestion(i)}
                                    className={`w-8 h-8 md:w-9 md:h-9 rounded-lg text-xs font-bold transition-all ${
                                        i === currentQuestionIndex
                                            ? 'gradient-cta text-background-dark shadow-[0_2px_8px_rgba(0,247,123,0.2)]'
                                            : userAnswers[q.id] !== undefined
                                                ? 'bg-primary/20 text-primary'
                                                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                                    }`}
                                    style={i !== currentQuestionIndex && userAnswers[q.id] === undefined ? { background: 'var(--surface-container-highest)' } : {}}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Question Content */}
                <main className="flex-1 p-4 md:p-8">
                    <div className="max-w-3xl mx-auto">
                        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface-container-high)' }}>
                            <div className="px-5 py-3" style={{ background: 'rgba(0,247,123,0.05)', borderBottom: '1px solid rgba(59,75,60,0.2)' }}>
                                <span className="text-primary font-bold text-sm font-display">שאלה {currentQuestionIndex + 1} מתוך {totalQuestions}</span>
                            </div>
                            <div className="p-5 md:p-7">
                                <h2 className="text-base md:text-xl font-bold mb-5 text-on-surface">{currentQuestion.question}</h2>
                                {currentQuestion.code && (
                                    <pre className="rounded-xl p-4 md:p-5 mb-5 md:mb-7 text-xs md:text-sm overflow-x-auto font-mono text-on-surface relative" style={{ background: 'var(--surface-container-lowest)' }} dir="ltr">
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
                                            onClick={() => !showExplanation && handleSelectAnswer(currentQuestion.id, i)}
                                            className={`p-4 rounded-xl flex items-center gap-3 transition-all ghost-border ${
                                                showExplanation ? '' : 'cursor-pointer hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)]'
                                            }`}
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
                                                {String.fromCharCode(65 + i)}
                                            </span>
                                            <div className="flex flex-col text-on-surface text-sm">
                                                {renderNewlines(fixCodeDirection(opt)).split('\n').map((line, i) => (
                                                    <span key={i}>{line}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Immediate Explanation */}
                                {showExplanation && (
                                    <div className={`mt-6 p-5 rounded-2xl`} style={{
                                        background: userAnswers[currentQuestion.id] === currentQuestion.correct
                                            ? 'rgba(0,247,123,0.08)'
                                            : 'rgba(255,180,171,0.08)',
                                        border: '1px solid ' + (userAnswers[currentQuestion.id] === currentQuestion.correct
                                            ? 'rgba(0,247,123,0.2)'
                                            : 'rgba(255,180,171,0.2)')
                                    }}>
                                        <div className="font-bold mb-2 flex items-center gap-2 text-sm">
                                            <span className={userAnswers[currentQuestion.id] === currentQuestion.correct ? 'text-primary' : 'text-error'}>
                                                {userAnswers[currentQuestion.id] === currentQuestion.correct ? '✓ תשובה נכונה!' : '✗ תשובה שגויה'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-on-surface-variant whitespace-pre-wrap">
                                            {currentQuestion.explanation.replace(/\\n/g, '\n')}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="p-5 md:p-6 flex justify-between" style={{ borderTop: '1px solid rgba(59,75,60,0.2)' }}>
                                <button
                                    onClick={handlePrev}
                                    disabled={currentQuestionIndex === 0}
                                    className={`px-5 md:px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                                        currentQuestionIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
                                    }`}
                                >
                                    → הקודם
                                </button>

                                {showExplanation ? (
                                    <button
                                        onClick={currentQuestionIndex === totalQuestions - 1 ? handleSubmit : handleNext}
                                        className="px-5 md:px-6 py-2.5 gradient-cta text-background-dark font-bold rounded-xl flex items-center gap-2 hover:opacity-90 text-sm shadow-[0_4px_12px_rgba(0,247,123,0.2)]"
                                    >
                                        {currentQuestionIndex === totalQuestions - 1 ? 'הגש מבחן' : 'הבא ←'}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setShowExplanation(true)}
                                        disabled={userAnswers[currentQuestion.id] === undefined}
                                        className={`px-5 md:px-6 py-2.5 font-bold rounded-xl flex items-center gap-2 text-sm transition-all ${
                                            userAnswers[currentQuestion.id] === undefined
                                                ? 'opacity-30 cursor-not-allowed text-on-surface-variant'
                                                : 'gradient-cta text-background-dark hover:opacity-90 shadow-[0_4px_12px_rgba(0,247,123,0.2)]'
                                        }`}
                                    >
                                        בדוק תשובה
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return null;
}

export default function FinalExamPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="font-display text-2xl font-bold mb-2">טוען מבחנים...</h1>
                    </div>
                </main>
            </div>
        }>
            <FinalExamContent />
        </Suspense>
    );
}
