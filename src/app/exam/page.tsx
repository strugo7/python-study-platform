"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import QuizQuestion from "@/components/exam/QuizQuestion";
import { getRandomExamQuestions, getQuestionsByModule, getModuleById, getAllModules } from "@/data/curriculumLoader";
import Link from "next/link";
import type { PracticeQuestion } from "@/data/curriculum.types";

function convertToQuizFormat(q: PracticeQuestion & { moduleId?: number; moduleTitle?: string }) {
    return {
        id: q.id,
        questionText: q.question_text,
        codeSnippet: q.code ? q.code.split('\n') : undefined,
        options: q.options.map(opt => ({
            id: opt.id,
            label: opt.label,
            text: opt.text
        })),
        correctAnswer: q.correct_answer,
        explanation: q.explanation,
        moduleId: q.moduleId,
        moduleTitle: q.moduleTitle,
        cumulativeConcepts: q.cumulative_concepts || []
    };
}

function ExamContent() {
    const searchParams = useSearchParams();
    const moduleId = searchParams.get('module');

    const [questions, setQuestions] = useState<ReturnType<typeof convertToQuizFormat>[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | undefined>();
    const [showFeedback, setShowFeedback] = useState(false);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [score, setScore] = useState(0);
    const [examComplete, setExamComplete] = useState(false);

    const allModules = getAllModules();
    const selectedModule = moduleId ? getModuleById(parseInt(moduleId)) : undefined;

    useEffect(() => {
        if (moduleId) {
            const moduleQuestions = getQuestionsByModule(parseInt(moduleId));
            const module = getModuleById(parseInt(moduleId));
            setQuestions(moduleQuestions.map(q => convertToQuizFormat({
                ...q,
                moduleId: module?.id,
                moduleTitle: module?.title
            })));
        } else {
            const randomQuestions = getRandomExamQuestions(10);
            setQuestions(randomQuestions.map(convertToQuizFormat));
        }
    }, [moduleId]);

    const currentQuestion = questions[currentQuestionIndex];

    const handleSelectAnswer = (answerId: string) => {
        setSelectedAnswer(answerId);
        setAnswers({ ...answers, [currentQuestion.id]: answerId });
    };

    const handleNextQuestion = () => {
        if (!selectedAnswer) return;

        if (!showFeedback) {
            setShowFeedback(true);
            if (selectedAnswer === currentQuestion.correctAnswer) {
                setScore(prev => prev + 1);
            }
        } else {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setSelectedAnswer(answers[questions[currentQuestionIndex + 1]?.id]);
                setShowFeedback(false);
            } else {
                setExamComplete(true);
            }
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setSelectedAnswer(answers[questions[currentQuestionIndex - 1]?.id]);
            setShowFeedback(false);
        }
    };

    const handleRestart = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswer(undefined);
        setShowFeedback(false);
        setAnswers({});
        setScore(0);
        setExamComplete(false);
        if (moduleId) {
            const moduleQuestions = getQuestionsByModule(parseInt(moduleId));
            const module = getModuleById(parseInt(moduleId));
            setQuestions(moduleQuestions.map(q => convertToQuizFormat({
                ...q,
                moduleId: module?.id,
                moduleTitle: module?.title
            })));
        } else {
            const randomQuestions = getRandomExamQuestions(10);
            setQuestions(randomQuestions.map(convertToQuizFormat));
        }
    };

    if (questions.length === 0) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 rounded-2xl gradient-cta flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
                            <svg className="w-8 h-8 text-background-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13" />
                            </svg>
                        </div>
                        <h1 className="font-display text-2xl font-bold mb-2 text-on-surface">טוען שאלות...</h1>
                        <p className="text-on-surface-variant">אנא המתן</p>
                    </div>
                </main>
            </div>
        );
    }

    if (examComplete) {
        const percentage = Math.round((score / questions.length) * 100);
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center p-6">
                    <div className="max-w-md w-full rounded-2xl p-10 text-center" style={{ background: 'var(--surface-container-high)' }}>
                        <div className="text-5xl mb-6">
                            {percentage >= 80 ? '🏆' : percentage >= 60 ? '👍' : '📖'}
                        </div>
                        <h1 className="font-display text-3xl font-black mb-2 text-on-surface">
                            {percentage >= 80 ? 'מצוין!' : percentage >= 60 ? 'כל הכבוד!' : 'יש מקום לשיפור'}
                        </h1>
                        <p className="text-on-surface-variant text-base mb-8">
                            סיימת את {selectedModule ? `תרגול מודול ${selectedModule.id}` : 'הבחינה'}
                        </p>

                        <div className="rounded-xl p-6 mb-8" style={{ background: 'var(--surface-container-lowest)' }}>
                            <div className="font-display text-5xl font-black gradient-cta-text mb-2">
                                {percentage}%
                            </div>
                            <p className="text-on-surface-variant text-sm">
                                {score} מתוך {questions.length} תשובות נכונות
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleRestart}
                                className="w-full gradient-cta text-background-dark py-3 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-[0_4px_16px_rgba(0,247,123,0.2)]"
                            >
                                נסה שוב
                            </button>
                            <Link
                                href="/"
                                className="w-full py-3 rounded-xl font-medium text-on-surface-variant hover:text-on-surface transition-colors"
                                style={{ border: '1px solid rgba(59,75,60,0.3)' }}
                            >
                                חזרה לדף הבית
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            {/* Module Filter Bar — glass panel with tonal chips */}
            <div className="glass py-3 px-6 sticky top-[56px] z-40" style={{ borderBottom: '1px solid rgba(59,75,60,0.15)' }}>
                <div className="flex items-center gap-3 overflow-x-auto">
                    <span className="text-on-surface-variant text-xs font-medium shrink-0 tracking-widest uppercase">סנן:</span>
                    <Link
                        href="/exam"
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                            !moduleId
                                ? 'gradient-cta text-background-dark shadow-[0_2px_8px_rgba(0,247,123,0.2)]'
                                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                        }`}
                    >
                        כל השאלות
                    </Link>
                    {allModules.map(m => (
                        <Link
                            key={m.id}
                            href={`/exam?module=${m.id}`}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                                moduleId === String(m.id)
                                    ? 'gradient-cta text-background-dark shadow-[0_2px_8px_rgba(0,247,123,0.2)]'
                                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                            }`}
                        >
                            {m.id}. {m.title}
                        </Link>
                    ))}
                </div>
            </div>

            <QuizQuestion
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={questions.length}
                questionText={currentQuestion.questionText}
                codeSnippet={currentQuestion.codeSnippet}
                options={currentQuestion.options}
                selectedAnswer={selectedAnswer}
                correctAnswer={currentQuestion.correctAnswer}
                showFeedback={showFeedback}
                feedbackText={currentQuestion.explanation}
                onSelectAnswer={handleSelectAnswer}
                onNextQuestion={handleNextQuestion}
                onPreviousQuestion={handlePreviousQuestion}
            />

            {/* Cumulative Concepts Badge */}
            {showFeedback && currentQuestion.cumulativeConcepts.length > 0 && (
                <div className="fixed bottom-4 left-4 right-4 rounded-xl p-4 max-w-md mx-auto shadow-lg" style={{ background: 'var(--surface-container-high)' }}>
                    <p className="text-xs text-on-surface-variant mb-2">קונספטים מצטברים:</p>
                    <div className="flex flex-wrap gap-2">
                        {currentQuestion.cumulativeConcepts.map((concept, idx) => (
                            <span key={idx} className="text-xs text-primary px-2 py-1 rounded-full" style={{ background: 'rgba(0,247,123,0.1)' }}>
                                {concept}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ExamPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="font-display text-2xl font-bold mb-2">טוען...</h1>
                    </div>
                </main>
            </div>
        }>
            <ExamContent />
        </Suspense>
    );
}
