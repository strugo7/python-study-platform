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

// All user-provided content is escaped via escapeHtml() before any span tags are injected.
// This ensures no XSS is possible — only our own controlled <span> markup is added back.
function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function highlightSyntax(code: string): string {
    let escaped = escapeHtml(code);
    const keywords = ["def", "return", "if", "else", "elif", "for", "while", "in", "print", "True", "False", "None", "and", "or", "not", "class", "import", "from", "as", "try", "except", "finally", "with", "lambda", "yield", "global", "nonlocal", "pass", "break", "continue", "raise", "assert", "input", "int", "str", "float", "list", "dict", "len", "range", "open"];

    let result = '';
    let i = 0;

    while (i < escaped.length) {
        if (escaped[i] === '#') {
            const commentEnd = escaped.indexOf('\n', i);
            const comment = commentEnd === -1 ? escaped.slice(i) : escaped.slice(i, commentEnd);
            result += `<span class="text-gray-500">${comment}</span>`;
            i += comment.length;
            continue;
        }

        if ((escaped[i] === 'f' && (escaped[i + 1] === "'" || escaped[i + 1] === '"')) ||
            (escaped[i] === 'f' && escaped.slice(i + 1, i + 7) === '&#039;')) {
            const quote = escaped[i + 1] === '"' ? '"' : (escaped.slice(i + 1, i + 7) === '&#039;' ? '&#039;' : "'");
            const quoteLen = quote.length;
            const start = i;
            i += 1 + quoteLen;
            while (i < escaped.length) {
                if (escaped.slice(i, i + quoteLen) === quote) { i += quoteLen; break; }
                i++;
            }
            result += `<span class="text-yellow-300">${escaped.slice(start, i)}</span>`;
            continue;
        }

        if (escaped[i] === '"' || escaped[i] === "'" || escaped.slice(i, i + 6) === '&#039;') {
            const isEscapedQuote = escaped.slice(i, i + 6) === '&#039;';
            const quote = isEscapedQuote ? '&#039;' : escaped[i];
            const quoteLen = quote.length;
            const start = i;
            i += quoteLen;
            while (i < escaped.length) {
                if (escaped.slice(i, i + quoteLen) === quote) { i += quoteLen; break; }
                i++;
            }
            result += `<span class="text-yellow-300">${escaped.slice(start, i)}</span>`;
            continue;
        }

        if (/\d/.test(escaped[i])) {
            const start = i;
            while (i < escaped.length && /[\d.]/.test(escaped[i])) i++;
            result += `<span class="text-orange-400">${escaped.slice(start, i)}</span>`;
            continue;
        }

        let foundKeyword = false;
        for (const kw of keywords) {
            if (escaped.slice(i, i + kw.length) === kw) {
                const before = i === 0 || !/[a-zA-Z0-9_]/.test(escaped[i - 1]);
                const after = i + kw.length >= escaped.length || !/[a-zA-Z0-9_]/.test(escaped[i + kw.length]);
                if (before && after) {
                    result += `<span class="text-primary/80">${kw}</span>`;
                    i += kw.length;
                    foundKeyword = true;
                    break;
                }
            }
        }
        if (foundKeyword) continue;

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
        <div
            className="rounded-xl relative overflow-hidden group"
            style={{ background: 'var(--surface-container-lowest)' }}
            dir="ltr"
        >
            {/* 2px gradient accent border — left edge */}
            <div className="absolute top-0 left-0 w-0.5 h-full gradient-cta" />

            {/* Header */}
            <div
                className="flex justify-between items-center px-5 py-2.5"
                style={{ borderBottom: '1px solid rgba(59,75,60,0.2)' }}
            >
                <span className="text-primary/50 text-xs font-mono tracking-widest uppercase">
                    {filename}
                </span>
                <button className="text-on-surface-variant/40 hover:text-primary transition-colors">
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
                                className={`flex items-start gap-4 py-1 px-2 -mx-2 rounded cursor-pointer transition-colors ${
                                    isCurrentStep
                                        ? "bg-primary/20 border-r-2 border-primary shadow-[0_0_10px_rgba(0,247,123,0.12)]"
                                        : line.highlighted
                                            ? "bg-primary/10 border-r-2 border-primary"
                                            : isPastStep
                                                ? "opacity-50"
                                                : "hover:bg-surface-container-high"
                                }`}
                                onMouseEnter={() => onLineHover?.(index)}
                                onMouseLeave={onLineLeave}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.03 }}
                            >
                                {showLineNumbers && (
                                    <span className={`select-none w-6 text-right shrink-0 ${
                                        isCurrentStep ? "text-primary font-bold" : "text-primary/25"
                                    }`}>
                                        {index + 1}
                                    </span>
                                )}
                                {/* Content is safe: all code goes through escapeHtml before highlighting */}
                                <code
                                    className="text-on-surface flex-1"
                                    // nosec: content sanitized via escapeHtml() before span injection
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
