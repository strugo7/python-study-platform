"use client";

import { motion } from "framer-motion";

interface AnswerOption {
    id: string;
    label: string; // א, ב, ג, ד
    text: string;
}

interface QuizQuestionProps {
    questionNumber: number;
    totalQuestions: number;
    questionText: string;
    codeSnippet?: string[];
    options: AnswerOption[];
    selectedAnswer?: string;
    correctAnswer?: string;
    showFeedback?: boolean;
    feedbackText?: string;
    onSelectAnswer: (answerId: string) => void;
    onNextQuestion: () => void;
    onPreviousQuestion: () => void;
}

export default function QuizQuestion({
    questionNumber,
    totalQuestions,
    questionText,
    codeSnippet,
    options,
    selectedAnswer,
    correctAnswer,
    showFeedback = false,
    feedbackText,
    onSelectAnswer,
    onNextQuestion,
    onPreviousQuestion,
}: QuizQuestionProps) {
    const progressPercentage = (questionNumber / totalQuestions) * 100;
    const isCorrect = selectedAnswer === correctAnswer;

    return (
        <div className="min-h-screen flex flex-col">
            {/* Progress Section */}
            <div className="mb-10 max-w-3xl mx-auto w-full px-6 pt-8">
                <div className="flex justify-between items-end mb-3">
                    <div className="flex flex-col gap-1">
                        <span className="text-primary text-sm font-bold tracking-widest uppercase">
                            מבחן הסמכה: יסודות פייתון
                        </span>
                        <h2 className="text-2xl font-bold text-white">
                            שאלה {questionNumber} מתוך {totalQuestions}
                        </h2>
                    </div>
                    <span className="text-white/60 text-sm font-medium">
                        {Math.round(progressPercentage)}% הושלמו
                    </span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-primary progress-glow rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto w-full px-6">
                {/* Question & Code Column */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-xl">
                        <p className="text-lg text-white leading-relaxed mb-6">
                            {questionText}
                        </p>

                        {/* Code Block */}
                        {codeSnippet && (
                            <div className="bg-[#0a150e] rounded-lg p-5 border border-primary/20 relative overflow-hidden" dir="ltr">
                                <div className="absolute top-0 left-0 w-1 h-full bg-primary/50" />
                                <div className="flex justify-between items-center mb-4 opacity-50 text-[10px] font-mono tracking-widest uppercase">
                                    <span>python_v3.10</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <pre className="code-font text-sm md:text-base leading-loose text-white">
                                    {codeSnippet.map((line, idx) => (
                                        <div key={idx} className="flex">
                                            <span className="text-primary/30 w-8 select-none text-right mr-4 shrink-0">{idx + 1}</span>
                                            <span>{line}</span>
                                        </div>
                                    ))}
                                </pre>
                            </div>
                        )}
                    </div>

                    {/* Feedback Bar */}
                    {showFeedback && (
                        <motion.div
                            className={`rounded-xl p-5 flex items-start gap-4 ${isCorrect
                                    ? "bg-primary/20 border-2 border-primary"
                                    : "bg-red-500/20 border-2 border-red-500"
                                }`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div
                                className={`rounded-full p-1 shrink-0 mt-1 ${isCorrect ? "bg-primary text-background-dark" : "bg-red-500 text-white"
                                    }`}
                            >
                                {isCorrect ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                            </div>
                            <div>
                                <h4 className={`font-bold text-lg mb-1 ${isCorrect ? "text-primary" : "text-red-400"}`}>
                                    {isCorrect ? "תשובה נכונה!" : "תשובה שגויה"}
                                </h4>
                                <p className="text-white/90 leading-relaxed">{feedbackText}</p>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Answer Options Column */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                    <h3 className="text-white/50 text-sm font-bold mb-2 pr-2">
                        בחר את התשובה הנכונה:
                    </h3>

                    {options.map((option, index) => {
                        const isSelected = selectedAnswer === option.id;
                        const isCorrectOption = correctAnswer === option.id;
                        const showAsCorrect = showFeedback && isCorrectOption;
                        const showAsIncorrect = showFeedback && isSelected && !isCorrectOption;

                        return (
                            <motion.button
                                key={option.id}
                                onClick={() => !showFeedback && onSelectAnswer(option.id)}
                                className={`w-full text-right p-5 rounded-xl border-2 transition-all flex items-center justify-between group ${showAsCorrect
                                        ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(43,238,108,0.1)]"
                                        : showAsIncorrect
                                            ? "border-red-500 bg-red-500/10"
                                            : isSelected
                                                ? "border-primary bg-primary/10"
                                                : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                                    }`}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                disabled={showFeedback}
                            >
                                <div className="flex items-center gap-4">
                                    <span
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${showAsCorrect
                                                ? "bg-primary text-background-dark"
                                                : showAsIncorrect
                                                    ? "bg-red-500 text-white"
                                                    : isSelected
                                                        ? "bg-primary text-background-dark"
                                                        : "bg-white/10 group-hover:bg-primary/20 group-hover:text-primary"
                                            }`}
                                    >
                                        {option.label}
                                    </span>
                                    <div className={`text-lg ${isSelected || showAsCorrect ? "font-bold" : "font-medium"} flex flex-col`} dir="ltr">
                                        {option.text.split('\n').map((line, i) => (
                                            <span key={i}>{line}</span>
                                        ))}
                                    </div>
                                </div>
                                {(showAsCorrect || isSelected) && (
                                    <svg
                                        className={`w-6 h-6 ${showAsCorrect ? "text-primary" : showAsIncorrect ? "text-red-500" : "text-primary"}`}
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                    </svg>
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Footer Controls */}
            <footer className="border-t border-white/10 bg-background-dark/80 backdrop-blur-md py-6 px-6 mt-auto">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <button
                        onClick={onPreviousQuestion}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 text-white/70 hover:text-white hover:bg-white/5 transition-all"
                    >
                        <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="font-bold">הקודם</span>
                    </button>

                    <div className="hidden md:flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 text-white/50 cursor-not-allowed">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <span className="font-bold">רמז</span>
                        </button>
                    </div>

                    <button
                        onClick={onNextQuestion}
                        className="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-background-dark font-bold hover:scale-105 transition-all shadow-[0_4px_20px_rgba(43,238,108,0.3)]"
                    >
                        <span className="font-bold">המשך לשאלה הבאה</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>
            </footer>
        </div>
    );
}
