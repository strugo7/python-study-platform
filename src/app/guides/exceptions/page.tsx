"use client";

import Header from "@/components/Header";
import Link from "next/link";
import { useState } from "react";

// Exception node interface
interface ExceptionNode {
    name: string;
    description: string;
    children: ExceptionNode[];
    highlight?: boolean;
    common?: boolean;
}

// Exception hierarchy data
const exceptionTree: ExceptionNode = {
    name: "BaseException",
    description: "הבסיס לכל החריגות",
    children: [
        {
            name: "SystemExit",
            description: "נזרקת על ידי sys.exit()",
            children: []
        },
        {
            name: "KeyboardInterrupt",
            description: "כאשר המשתמש לוחץ Ctrl+C",
            children: []
        },
        {
            name: "GeneratorExit",
            description: "כאשר Generator נסגר",
            children: []
        },
        {
            name: "Exception",
            description: "הבסיס לכל החריגות הרגילות",
            highlight: true,
            children: [
                {
                    name: "StopIteration",
                    description: "סיום איטרציה",
                    children: []
                },
                {
                    name: "ArithmeticError",
                    description: "שגיאות חישוב",
                    children: [
                        { name: "FloatingPointError", description: "שגיאה בחישוב נקודה צפה", children: [] },
                        { name: "OverflowError", description: "תוצאה גדולה מדי", children: [] },
                        { name: "ZeroDivisionError", description: "חלוקה באפס", children: [], common: true }
                    ]
                },
                {
                    name: "AssertionError",
                    description: "assert נכשל",
                    children: [],
                    common: true
                },
                {
                    name: "AttributeError",
                    description: "תכונה לא קיימת",
                    children: [],
                    common: true
                },
                {
                    name: "EOFError",
                    description: "input() קיבל EOF",
                    children: []
                },
                {
                    name: "ImportError",
                    description: "שגיאת ייבוא",
                    children: [
                        { name: "ModuleNotFoundError", description: "מודול לא נמצא", children: [], common: true }
                    ]
                },
                {
                    name: "LookupError",
                    description: "שגיאות חיפוש",
                    children: [
                        { name: "IndexError", description: "אינדקס מחוץ לטווח", children: [], common: true },
                        { name: "KeyError", description: "מפתח לא קיים במילון", children: [], common: true }
                    ]
                },
                {
                    name: "NameError",
                    description: "שם משתנה לא מוגדר",
                    children: [
                        { name: "UnboundLocalError", description: "משתנה מקומי לא אותחל", children: [], common: true }
                    ],
                    common: true
                },
                {
                    name: "OSError",
                    description: "שגיאות מערכת הפעלה",
                    children: [
                        { name: "FileExistsError", description: "קובץ כבר קיים", children: [] },
                        { name: "FileNotFoundError", description: "קובץ לא נמצא", children: [], common: true },
                        { name: "PermissionError", description: "אין הרשאה", children: [] },
                        { name: "TimeoutError", description: "זמן המתנה עבר", children: [] }
                    ]
                },
                {
                    name: "RuntimeError",
                    description: "שגיאה כללית בזמן ריצה",
                    children: [
                        { name: "RecursionError", description: "רקורסיה עמוקה מדי", children: [], common: true }
                    ]
                },
                {
                    name: "SyntaxError",
                    description: "שגיאת תחביר",
                    children: [
                        { name: "IndentationError", description: "שגיאת הזחה", children: [], common: true }
                    ],
                    common: true
                },
                {
                    name: "TypeError",
                    description: "טיפוס לא מתאים לפעולה",
                    children: [],
                    common: true
                },
                {
                    name: "ValueError",
                    description: "ערך לא מתאים",
                    children: [],
                    common: true
                }
            ]
        }
    ]
};

interface TreeNodeProps {
    node: ExceptionNode;
    depth?: number;
    expanded: Set<string>;
    toggleExpand: (name: string) => void;
}

function TreeNode({ node, depth = 0, expanded, toggleExpand }: TreeNodeProps) {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expanded.has(node.name);

    return (
        <div className="select-none">
            <div
                className={`flex items-center gap-2 p-2.5 rounded-xl cursor-pointer transition-all ${node.highlight ? 'shadow-[0_0_16px_rgba(0,247,123,0.08)]' : 'hover:bg-surface-container-highest'
                    }`}
                style={{
                    marginRight: `${depth * 24}px`,
                    background: node.highlight ? 'rgba(0,247,123,0.1)' : undefined,
                    border: node.highlight ? '1px solid rgba(0,247,123,0.2)' : '1px solid transparent',
                }}
                onClick={() => hasChildren && toggleExpand(node.name)}
            >
                {hasChildren ? (
                    <span className={`text-primary transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                        ▶
                    </span>
                ) : (
                    <span className="w-4"></span>
                )}
                <code className={`font-bold text-sm md:text-base ${node.common ? 'text-orange-400' : node.highlight ? 'text-primary' : 'text-on-surface'}`}>
                    {node.name}
                </code>
                {node.common && <span className="text-xs text-orange-400 px-1.5 md:px-2 py-0.5 rounded" style={{ background: 'rgba(249,115,22,0.12)' }}>נפוץ</span>}
                <span className="text-on-surface-variant text-xs md:text-sm mr-2 hidden md:inline">- {node.description}</span>
            </div>
            {hasChildren && isExpanded && (
                <div className="mr-4" style={{ borderRight: '1px solid rgba(59,75,60,0.2)' }}>
                    {node.children.map((child) => (
                        <TreeNode
                            key={child.name}
                            node={child}
                            depth={depth + 1}
                            expanded={expanded}
                            toggleExpand={toggleExpand}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

const commonExamples = [
    {
        exception: "ZeroDivisionError",
        code: `x = 5 / 0  # חלוקה באפס`,
        fix: `if divisor != 0:\n    x = 5 / divisor`
    },
    {
        exception: "IndexError",
        code: `lst = [1, 2, 3]\nprint(lst[5])  # אינדקס לא קיים`,
        fix: `if index < len(lst):\n    print(lst[index])`
    },
    {
        exception: "KeyError",
        code: `d = {"a": 1}\nprint(d["b"])  # מפתח לא קיים`,
        fix: `print(d.get("b", "default"))\n# או\nif "b" in d:\n    print(d["b"])`
    },
    {
        exception: "TypeError",
        code: `"hello" + 5  # לא ניתן לחבר str ו-int`,
        fix: `"hello" + str(5)`
    },
    {
        exception: "ValueError",
        code: `int("hello")  # לא ניתן להמיר`,
        fix: `try:\n    x = int(s)\nexcept ValueError:\n    x = 0`
    },
    {
        exception: "NameError",
        code: `print(undefined_var)  # משתנה לא מוגדר`,
        fix: `x = 10\nprint(x)`
    },
    {
        exception: "UnboundLocalError",
        code: `x = 10\ndef foo():\n    print(x)  # נקרא לפני הגדרה\n    x = 20`,
        fix: `x = 10\ndef foo():\n    global x\n    print(x)\n    x = 20`
    },
    {
        exception: "AttributeError",
        code: `"hello".append("!")  # str אין לו append`,
        fix: `lst = ["hello"]\nlst.append("!")`
    }
];

const tryExceptOrder = `# סדר ה-except חשוב!
# תמיד שים את החריגות הספציפיות קודם

try:
    x = 1 / 0
except ArithmeticError:  # יתפוס ראשון!
    print("שגיאת חישוב")
except ZeroDivisionError:  # לעולם לא יגיע לכאן
    print("חלוקה באפס")

# הסדר הנכון:
try:
    x = 1 / 0  
except ZeroDivisionError:  # ספציפי קודם
    print("חלוקה באפס")
except ArithmeticError:  # כללי אחר כך
    print("שגיאת חישוב אחרת")`;

export default function ExceptionsGuide() {
    const [expanded, setExpanded] = useState<Set<string>>(new Set(["BaseException", "Exception"]));

    const toggleExpand = (name: string) => {
        setExpanded(prev => {
            const next = new Set(prev);
            if (next.has(name)) {
                next.delete(name);
            } else {
                next.add(name);
            }
            return next;
        });
    };

    const expandAll = () => {
        const allNames = new Set<string>();
        const traverse = (node: typeof exceptionTree) => {
            allNames.add(node.name);
            node.children.forEach(traverse);
        };
        traverse(exceptionTree);
        setExpanded(allNames);
    };

    const collapseAll = () => {
        setExpanded(new Set(["BaseException"]));
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 p-4 md:p-8 overflow-auto">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8 md:mb-12">
                        <h1 className="font-display text-2xl md:text-4xl font-black mb-3 text-on-surface">🌳 עץ החריגות בפייתון</h1>
                        <p className="text-on-surface-variant text-sm md:text-lg">היררכיית החריגות וסדר התפיסה</p>
                    </div>

                    {/* Controls */}
                    <div className="flex gap-3 mb-6">
                        <button
                            onClick={expandAll}
                            className="px-4 py-2 rounded-xl text-sm font-bold text-primary hover:opacity-90 transition-all"
                            style={{ background: 'rgba(0,247,123,0.1)' }}
                        >
                            📂 פתח הכל
                        </button>
                        <button
                            onClick={collapseAll}
                            className="px-4 py-2 rounded-xl text-sm font-bold text-on-surface-variant hover:text-on-surface transition-all"
                            style={{ background: 'var(--surface-container-highest)' }}
                        >
                            📁 סגור הכל
                        </button>
                    </div>

                    {/* Important Note */}
                    <div className="rounded-2xl p-5 mb-7" style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
                        <p className="text-orange-400 font-bold mb-1">⚠️ חשוב למבחן!</p>
                        <p className="text-on-surface-variant text-sm">
                            בבלוקי try-except, צריך לתפוס את החריגות הספציפיות <strong className="text-on-surface">לפני</strong> הכלליות.
                            ZeroDivisionError יורש מ-ArithmeticError, לכן אם ArithmeticError מופיע ראשון - הוא יתפוס גם ZeroDivisionError!
                        </p>
                    </div>

                    {/* Tree Section */}
                    <section className="mb-10 md:mb-14">
                        <h2 className="font-display text-xl md:text-2xl font-bold mb-5 flex items-center gap-2 text-on-surface">
                            <span className="text-primary">🌲</span> מבנה ההיררכיה
                        </h2>
                        <div className="rounded-2xl p-4 md:p-5 overflow-x-auto" style={{ background: 'var(--surface-container)' }}>
                            <TreeNode
                                node={exceptionTree}
                                expanded={expanded}
                                toggleExpand={toggleExpand}
                            />
                        </div>
                        <p className="text-xs text-on-surface-variant mt-3">
                            💡 לחץ על חץ כדי לפתוח/לסגור. חריגות <span className="text-orange-400">בכתום</span> הן הנפוצות ביותר.
                        </p>
                    </section>

                    {/* Order Example */}
                    <section className="mb-10 md:mb-14">
                        <h2 className="font-display text-xl md:text-2xl font-bold mb-5 flex items-center gap-2 text-on-surface">
                            <span className="text-primary">📋</span> סדר תפיסת חריגות
                        </h2>
                        <div className="rounded-2xl overflow-hidden relative" style={{ background: 'var(--surface-container-lowest)' }}>
                            <div className="absolute top-0 left-0 w-0.5 h-full gradient-cta" />
                            <pre className="p-5 md:p-7 text-xs md:text-sm overflow-x-auto text-left text-on-surface" dir="ltr">
                                <code>{tryExceptOrder}</code>
                            </pre>
                        </div>
                    </section>

                    {/* Common Examples */}
                    <section className="mb-10 md:mb-14">
                        <h2 className="font-display text-xl md:text-2xl font-bold mb-5 md:mb-7 flex items-center gap-2 text-on-surface">
                            <span className="text-primary">🔥</span> חריגות נפוצות ואיך לטפל בהן
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {commonExamples.map((ex) => (
                                <div
                                    key={ex.exception}
                                    className="rounded-2xl overflow-hidden"
                                    style={{ background: 'var(--surface-container)' }}
                                >
                                    <div className="p-3.5" style={{ background: 'rgba(239,68,68,0.08)', borderBottom: '1px solid rgba(59,75,60,0.2)' }}>
                                        <code className="text-red-400 font-bold">{ex.exception}</code>
                                    </div>
                                    <div className="p-5">
                                        <p className="text-xs text-on-surface-variant mb-2">❌ גורם לשגיאה:</p>
                                        <pre className="p-3 rounded-xl text-xs mb-4 overflow-x-auto text-left text-on-surface" dir="ltr" style={{ background: 'var(--surface-container-lowest)' }}>
                                            <code>{ex.code}</code>
                                        </pre>
                                        <p className="text-xs text-on-surface-variant mb-2">✅ פתרון:</p>
                                        <pre className="p-3 rounded-xl text-xs overflow-x-auto text-left" dir="ltr" style={{ background: 'rgba(0,247,123,0.06)' }}>
                                            <code className="text-green-400">{ex.fix}</code>
                                        </pre>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Back Link */}
                    <div className="text-center mt-10">
                        <Link href="/" className="text-on-surface-variant hover:text-primary transition-colors text-sm">
                            ← חזרה לדף הבית
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
