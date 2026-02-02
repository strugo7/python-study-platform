"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import QuizQuestion from "@/components/exam/QuizQuestion";
import { getRandomExamQuestions, getQuestionsByModule, getModuleById, getAllModules } from "@/data/curriculumLoader";
import Link from "next/link";
import type { PracticeQuestion } from "@/data/curriculum.types";

// Convert curriculum question to quiz format
function convertToQuizFormat(q: PracticeQuestion & { moduleId?: number; moduleTitle?: string }) {
    return {
        id: q.id,
        questionText: q.question_text,
        codeSnippet: q.code ? q.code.split('\n') : undefined, // Convert string to array of lines
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
        // Load questions based on module filter
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
            // First click shows feedback
            setShowFeedback(true);
            // Calculate score
            if (selectedAnswer === currentQuestion.correctAnswer) {
                setScore(prev => prev + 1);
            }
        } else {
            // Second click moves to next question
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setSelectedAnswer(answers[questions[currentQuestionIndex + 1]?.id]);
                setShowFeedback(false);
            } else {
                // Exam complete
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
        // Shuffle questions again
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
                        <div className="text-6xl mb-4">📚</div>
                        <h1 className="text-2xl font-bold mb-2">טוען שאלות...</h1>
                        <p className="text-text-muted">אנא המתן</p>
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
                    <div className="max-w-md w-full bg-surface-dark rounded-2xl p-8 text-center border border-border-dark">
                        <div className="text-6xl mb-6">
                            {percentage >= 80 ? '🏆' : percentage >= 60 ? '👍' : '📖'}
                        </div>
                        <h1 className="text-3xl font-black mb-2">
                            {percentage >= 80 ? 'מצוין!' : percentage >= 60 ? 'כל הכבוד!' : 'יש מקום לשיפור'}
                        </h1>
                        <p className="text-text-muted text-lg mb-6">
                            סיימת את {selectedModule ? `תרגול מודול ${selectedModule.id}` : 'הבחינה'}
                        </p>

                        <div className="bg-background-dark rounded-xl p-6 mb-6">
                            <div className="text-5xl font-black text-primary mb-2">
                                {percentage}%
                            </div>
                            <p className="text-text-muted">
                                {score} מתוך {questions.length} תשובות נכונות
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleRestart}
                                className="w-full bg-primary text-background-dark py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
                            >
                                נסה שוב
                            </button>
                            <Link
                                href="/"
                                className="w-full border border-border-dark py-3 rounded-xl font-medium hover:bg-surface-dark transition-colors"
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

            {/* Module Filter Bar */}
            <div className="bg-surface-dark border-b border-border-dark py-3 px-6">
                <div className="flex items-center gap-4 overflow-x-auto">
                    <span className="text-text-muted text-sm shrink-0">סנן לפי מודול:</span>
                    <Link
                        href="/exam"
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all shrink-0 ${!moduleId
                            ? 'bg-primary text-background-dark'
                            : 'bg-border-dark text-text-muted hover:bg-border-dark/80'
                            }`}
                    >
                        כל השאלות
                    </Link>
                    {allModules.map(m => (
                        <Link
                            key={m.id}
                            href={`/exam?module=${m.id}`}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all shrink-0 ${moduleId === String(m.id)
                                ? 'bg-primary text-background-dark'
                                : 'bg-border-dark text-text-muted hover:bg-border-dark/80'
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
                <div className="fixed bottom-4 left-4 right-4 bg-surface-dark border border-border-dark rounded-xl p-4 max-w-md mx-auto">
                    <p className="text-xs text-text-muted mb-2">🔗 קונספטים מצטברים:</p>
                    <div className="flex flex-wrap gap-2">
                        {currentQuestion.cumulativeConcepts.map((concept, idx) => (
                            <span key={idx} className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
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
                        <div className="text-6xl mb-4">📚</div>
                        <h1 className="text-2xl font-bold mb-2">טוען...</h1>
                    </div>
                </main>
            </div>
        }>
            <ExamContent />
        </Suspense>
    );
}
