"use client";

import { motion } from "framer-motion";

interface CodeLine {
    code: string;
    highlighted?: boolean;
}

interface CodeBlockProps {
    lines: CodeLine[];
    filename?: string;
    onLineHover?: (lineIndex: number) => void;
    onLineLeave?: () => void;
    currentLine?: number; // For PyTutor stepping
    showLineNumbers?: boolean;
}

// Escape HTML to prevent XSS and display issues
function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Improved syntax highlighting that handles Hebrew and complex strings
function highlightSyntax(code: string): string {
    // First, escape HTML entities
    let escaped = escapeHtml(code);

    // Track positions that are already highlighted to avoid overlapping
    const keywords = ["def", "return", "if", "else", "elif", "for", "while", "in", "print", "True", "False", "None", "and", "or", "not", "class", "import", "from", "as", "try", "except", "finally", "with", "lambda", "yield", "global", "nonlocal", "pass", "break", "continue", "raise", "assert", "input", "int", "str", "float", "list", "dict", "len", "range", "open"];

    // Split by strings and comments first to protect them
    const parts: { type: 'code' | 'string' | 'comment'; content: string }[] = [];
    let remaining = escaped;
    let match;

    // Simple approach: process character by character for reliable parsing
    let result = '';
    let i = 0;

    while (i < escaped.length) {
        // Check for comment
        if (escaped[i] === '#') {
            const commentEnd = escaped.indexOf('\n', i);
            const comment = commentEnd === -1 ? escaped.slice(i) : escaped.slice(i, commentEnd);
            result += `<span class="text-gray-500">${comment}</span>`;
            i += comment.length;
            continue;
        }

        // Check for f-string
        if ((escaped[i] === 'f' && (escaped[i + 1] === "'" || escaped[i + 1] === '"')) ||
            (escaped[i] === 'f' && escaped.slice(i + 1, i + 7) === '&#039;')) {
            const quote = escaped[i + 1] === '"' ? '"' : (escaped.slice(i + 1, i + 7) === '&#039;' ? '&#039;' : "'");
            const quoteLen = quote.length;
            const start = i;
            i += 1 + quoteLen; // skip f and opening quote

            // Find closing quote
            while (i < escaped.length) {
                if (escaped.slice(i, i + quoteLen) === quote) {
                    i += quoteLen;
                    break;
                }
                i++;
            }
            result += `<span class="text-yellow-300">${escaped.slice(start, i)}</span>`;
            continue;
        }

        // Check for string (single or double quote)
        if (escaped[i] === '"' || escaped[i] === "'" || escaped.slice(i, i + 6) === '&#039;') {
            const isEscapedQuote = escaped.slice(i, i + 6) === '&#039;';
            const quote = isEscapedQuote ? '&#039;' : escaped[i];
            const quoteLen = quote.length;
            const start = i;
            i += quoteLen; // skip opening quote

            // Find closing quote
            while (i < escaped.length) {
                if (escaped.slice(i, i + quoteLen) === quote) {
                    i += quoteLen;
                    break;
                }
                i++;
            }
            result += `<span class="text-yellow-300">${escaped.slice(start, i)}</span>`;
            continue;
        }

        // Check for number
        if (/\d/.test(escaped[i])) {
            const start = i;
            while (i < escaped.length && /[\d.]/.test(escaped[i])) {
                i++;
            }
            result += `<span class="text-orange-400">${escaped.slice(start, i)}</span>`;
            continue;
        }

        // Check for keyword
        let foundKeyword = false;
        for (const kw of keywords) {
            if (escaped.slice(i, i + kw.length) === kw) {
                // Make sure it's a whole word
                const before = i === 0 || !/[a-zA-Z0-9_]/.test(escaped[i - 1]);
                const after = i + kw.length >= escaped.length || !/[a-zA-Z0-9_]/.test(escaped[i + kw.length]);
                if (before && after) {
                    result += `<span class="text-primary/70">${kw}</span>`;
                    i += kw.length;
                    foundKeyword = true;
                    break;
                }
            }
        }
        if (foundKeyword) continue;

        // Regular character
        result += escaped[i];
        i++;
    }

    return result;
}

export default function CodeBlock({
    lines,
    filename = "python_code.py",
    onLineHover,
    onLineLeave,
    currentLine,
    showLineNumbers = true,
}: CodeBlockProps) {
    return (
        <div className="bg-[#0a150e] rounded-lg border border-primary/20 relative overflow-hidden group" dir="ltr">
            {/* Left border accent */}
            <div className="absolute top-0 left-0 w-1 h-full bg-primary/50" />

            {/* Header */}
            <div className="flex justify-between items-center px-5 py-3 border-b border-primary/10">
                <span className="text-primary/50 text-xs font-mono tracking-widest uppercase">
                    {filename}
                </span>
                <button className="text-primary/30 hover:text-primary transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </button>
            </div>

            {/* Code Lines */}
            <div className="p-5">
                <pre className="code-font text-sm md:text-base leading-loose">
                    {lines.map((line, index) => {
                        const isCurrentStep = currentLine === index + 1;
                        const isPastStep = currentLine !== undefined && index + 1 < currentLine;

                        return (
                            <motion.div
                                key={index}
                                className={`flex items-start gap-4 py-1 px-2 -mx-2 rounded cursor-pointer transition-colors ${isCurrentStep
                                        ? "bg-primary/30 border-r-2 border-primary shadow-[0_0_10px_rgba(43,238,108,0.2)]"
                                        : line.highlighted
                                            ? "bg-primary/20 border-r-2 border-primary"
                                            : isPastStep
                                                ? "bg-white/5 opacity-70"
                                                : "hover:bg-white/5"
                                    }`}
                                onMouseEnter={() => onLineHover?.(index)}
                                onMouseLeave={onLineLeave}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.03 }}
                            >
                                {showLineNumbers && (
                                    <span className={`select-none w-6 text-right ${isCurrentStep ? "text-primary font-bold" : "text-primary/30"
                                        }`}>
                                        {index + 1}
                                    </span>
                                )}
                                <code
                                    className="text-white flex-1"
                                    dangerouslySetInnerHTML={{ __html: highlightSyntax(line.code) }}
                                />
                                {isCurrentStep && (
                                    <motion.span
                                        className="text-primary text-xs font-mono"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                    >
                                        ◀ כאן
                                    </motion.span>
                                )}
                            </motion.div>
                        );
                    })}
                </pre>
            </div>
        </div>
    );
}
