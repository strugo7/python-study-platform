"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Link from "next/link";
import { getShuffledExam, getAllFinalExams, type FinalExam, type FinalExamQuestion } from "@/data/finalExams";

function FinalExamContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const examId = searchParams.get('id');

    const [currentExam, setCurrentExam] = useState<FinalExam | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
    const [examSubmitted, setExamSubmitted] = useState(false);
    const [view, setView] = useState<'library' | 'exam' | 'results'>('library');

    useEffect(() => {
        if (examId) {
            // Use shuffled exam so answers are randomized
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
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleGoToQuestion = (index: number) => {
        setCurrentQuestionIndex(index);
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
        setView('exam');
    };

    const handleBackToLibrary = () => {
        router.push('/exam/final');
        setView('library');
        setCurrentExam(null);
        setUserAnswers({});
        setExamSubmitted(false);
    };

    // Library View
    if (view === 'library') {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 p-6">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-black mb-2">📝 מאגר מבחנים</h1>
                            <p className="text-text-muted">4 מבחנים ברמת המרצה - 80 שאלות ייחודיות</p>
                        </div>

                        {/* Timed Exam Card - Featured */}
                        <div className="mb-8">
                            <Link href="/exam/timed">
                                <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl border-2 border-red-500/50 p-6 hover:border-red-400 transition-all">
                                    <div className="flex flex-col md:flex-row items-center gap-6">
                                        <div className="text-6xl">⏱️</div>
                                        <div className="flex-1 text-center md:text-right">
                                            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                                <h3 className="text-2xl font-black">מבחן סיום מקיף</h3>
                                                <span className="text-xs px-3 py-1 rounded-full bg-red-500/20 text-red-400">
                                                    מבחן אמיתי
                                                </span>
                                            </div>
                                            <p className="text-text-muted mb-3">20 שאלות מאתגרות מכל החומר | שעתיים | ציון בסיום בלבד</p>
                                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                                <span className="text-xs bg-border-dark px-2 py-1 rounded">⏰ מוגבל בזמן</span>
                                                <span className="text-xs bg-border-dark px-2 py-1 rounded">🔒 ללא הסברים במהלך</span>
                                                <span className="text-xs bg-border-dark px-2 py-1 rounded">🎲 תשובות מעורבלות</span>
                                            </div>
                                        </div>
                                        <div className="text-primary font-bold text-lg">
                                            התחל מבחן →
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        <h2 className="text-xl font-bold mb-4">📚 מבחני תרגול (ללא מגבלת זמן)</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {allExams.map((exam) => (
                                <div
                                    key={exam.id}
                                    className="bg-surface-dark rounded-xl border border-border-dark overflow-hidden hover:border-primary/50 transition-all"
                                >
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-4xl">📋</span>
                                            <span className={`text-xs px-3 py-1 rounded-full ${exam.difficulty === 'גבוהה מאוד'
                                                ? 'bg-red-500/20 text-red-400'
                                                : 'bg-orange-500/20 text-orange-400'
                                                }`}>
                                                {exam.difficulty}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">{exam.title}</h3>
                                        <p className="text-text-muted text-sm mb-4">{exam.description}</p>
                                        <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
                                            <span>❓</span>
                                            <span>{exam.questions.length} שאלות</span>
                                            <span className="text-primary">• הסברים מיידיים</span>
                                        </div>
                                        <Link
                                            href={`/exam/final?id=${exam.id}`}
                                            className="block w-full bg-primary text-background-dark font-bold py-3 rounded-lg text-center hover:opacity-90 transition-opacity"
                                        >
                                            התחל תרגול
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 text-center">
                            <Link href="/" className="text-text-muted hover:text-primary transition-colors">
                                ← חזרה לדף הבית
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // Results View
    if (view === 'results' && currentExam) {
        let correctCount = 0;
        currentExam.questions.forEach(q => {
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
                            <div className={`text-6xl font-black mb-4 ${percentage >= 60 ? 'text-primary' : 'text-red-400'}`}>
                                {percentage}%
                            </div>
                            <p className="text-xl mb-2">{correctCount} מתוך {totalQuestions} תשובות נכונות</p>
                            <p className="text-text-muted">
                                {percentage >= 90 ? '🏆 מצוין!' : percentage >= 70 ? '👍 טוב מאוד!' : percentage >= 60 ? '✓ עברת!' : '📚 צריך תרגול'}
                            </p>
                        </div>

                        {/* Questions Review */}
                        <h2 className="text-2xl font-bold mb-4">📋 סקירת השאלות</h2>
                        <div className="space-y-6">
                            {currentExam.questions.map((q, idx) => {
                                const userAnswer = userAnswers[q.id];
                                const isCorrect = userAnswer === q.correct;
                                const isUnanswered = userAnswer === undefined;

                                return (
                                    <div key={q.id} className="bg-surface-dark rounded-xl border border-border-dark overflow-hidden">
                                        <div className={`p-4 border-b border-border-dark flex items-center justify-between ${isCorrect ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                                            <span className="font-bold">שאלה {idx + 1}</span>
                                            <span className={`flex items-center gap-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                                {isUnanswered ? '⚪ לא נענתה' : isCorrect ? '✓ נכון' : '✗ שגוי'}
                                            </span>
                                        </div>
                                        <div className="p-6">
                                            <p className="mb-3">{q.question}</p>
                                            {q.code && (
                                                <pre className="bg-background-dark p-4 rounded-lg mb-4 text-sm overflow-x-auto text-left" dir="ltr">
                                                    <code>{q.code}</code>
                                                </pre>
                                            )}
                                            <div className="space-y-2 mb-4">
                                                {q.options.map((opt, i) => (
                                                    <div
                                                        key={i}
                                                        className={`p-3 rounded-lg border flex items-center gap-3 text-sm ${q.correct === i
                                                            ? 'border-green-500 bg-green-500/10'
                                                            : userAnswer === i && userAnswer !== q.correct
                                                                ? 'border-red-500 bg-red-500/10'
                                                                : 'border-border-dark'
                                                            }`}
                                                    >
                                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${q.correct === i
                                                            ? 'bg-green-500 text-white'
                                                            : userAnswer === i
                                                                ? 'bg-red-500 text-white'
                                                                : 'bg-border-dark text-text-muted'
                                                            }`}>
                                                            {String.fromCharCode(65 + i)}
                                                        </span>
                                                        <span className={
                                                            q.correct === i
                                                                ? 'text-green-400'
                                                                : userAnswer === i && userAnswer !== q.correct
                                                                    ? 'text-red-400'
                                                                    : 'text-text-muted'
                                                        }>
                                                            {opt}
                                                        </span>
                                                        {q.correct === i && <span className="mr-auto">✓</span>}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="bg-background-dark p-4 rounded-lg border border-primary/20">
                                                <p className="text-sm text-primary font-bold mb-1">💡 הסבר:</p>
                                                <p className="text-text-muted text-sm">{q.explanation}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-8 flex gap-4 justify-center">
                            <button
                                onClick={handleRetake}
                                className="px-8 py-3 bg-primary text-background-dark font-bold rounded-xl hover:opacity-90"
                            >
                                🔄 נסה שוב
                            </button>
                            <button
                                onClick={handleBackToLibrary}
                                className="px-8 py-3 border border-border-dark font-medium rounded-xl hover:bg-surface-dark"
                            >
                                ← חזרה למאגר
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // Exam View
    if (view === 'exam' && currentExam && currentQuestion) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />

                {/* Exam Header */}
                <div className="bg-surface-dark border-b border-border-dark p-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <button onClick={handleBackToLibrary} className="text-text-muted hover:text-white">✕</button>
                                <h1 className="font-bold">{currentExam.title}</h1>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-text-muted text-sm">
                                    <span className="text-primary font-bold">{answeredCount}</span>/{totalQuestions} נענו
                                </span>
                                <button
                                    onClick={handleSubmit}
                                    className="px-4 py-2 bg-primary text-background-dark font-bold rounded-lg hover:opacity-90 text-sm"
                                >
                                    הגש מבחן
                                </button>
                            </div>
                        </div>

                        {/* Question Navigation */}
                        <div className="flex flex-wrap gap-2">
                            {currentExam.questions.map((q, i) => (
                                <button
                                    key={q.id}
                                    onClick={() => handleGoToQuestion(i)}
                                    className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${i === currentQuestionIndex
                                        ? 'border-2 border-primary bg-primary/20'
                                        : userAnswers[q.id] !== undefined
                                            ? 'bg-primary text-background-dark'
                                            : 'bg-border-dark text-text-muted hover:border-primary'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Question Content */}
                <main className="flex-1 p-6">
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-surface-dark rounded-xl border border-border-dark overflow-hidden">
                            <div className="p-4 border-b border-border-dark bg-border-dark/30">
                                <span className="text-primary font-bold">שאלה {currentQuestionIndex + 1} מתוך {totalQuestions}</span>
                            </div>
                            <div className="p-6">
                                <h2 className="text-xl font-bold mb-4">{currentQuestion.question}</h2>
                                {currentQuestion.code && (
                                    <pre className="bg-background-dark p-4 rounded-lg mb-6 text-sm overflow-x-auto text-left" dir="ltr">
                                        <code>{currentQuestion.code}</code>
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
                                            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${userAnswers[currentQuestion.id] === i
                                                ? 'bg-primary text-background-dark'
                                                : 'border-2 border-text-muted text-text-muted'
                                                }`}>
                                                {String.fromCharCode(65 + i)}
                                            </span>
                                            <span>{opt}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="p-6 border-t border-border-dark flex justify-between">
                                <button
                                    onClick={handlePrev}
                                    disabled={currentQuestionIndex === 0}
                                    className={`px-6 py-3 bg-border-dark text-text-muted font-bold rounded-lg flex items-center gap-2 ${currentQuestionIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/20 hover:text-white'
                                        }`}
                                >
                                    → הקודם
                                </button>
                                <button
                                    onClick={currentQuestionIndex === totalQuestions - 1 ? handleSubmit : handleNext}
                                    className="px-6 py-3 bg-primary text-background-dark font-bold rounded-lg flex items-center gap-2 hover:opacity-90"
                                >
                                    {currentQuestionIndex === totalQuestions - 1 ? 'הגש מבחן' : 'הבא ←'}
                                </button>
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
                        <div className="text-6xl mb-4">📝</div>
                        <h1 className="text-2xl font-bold mb-2">טוען מבחנים...</h1>
                    </div>
                </main>
            </div>
        }>
            <FinalExamContent />
        </Suspense>
    );
}
