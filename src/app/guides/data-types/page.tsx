"use client";

import Header from "@/components/Header";
import Link from "next/link";

// Data types information
const dataTypes = [
    {
        name: "int",
        hebrewName: "מספר שלם",
        description: "מספרים שלמים ללא נקודה עשרונית",
        examples: ["42", "-17", "0", "1000000"],
        operations: ["+", "-", "*", "/", "//", "%", "**"],
        mutable: false,
        notes: "חלוקה (/) תמיד מחזירה float"
    },
    {
        name: "float",
        hebrewName: "מספר עשרוני",
        description: "מספרים עם נקודה עשרונית",
        examples: ["3.14", "-0.001", "2.0", "1e10"],
        operations: ["+", "-", "*", "/", "//", "%", "**"],
        mutable: false,
        notes: "זהירות מבעיות דיוק: 0.1 + 0.2 != 0.3"
    },
    {
        name: "str",
        hebrewName: "מחרוזת",
        description: "רצף של תווים",
        examples: ["'hello'", "\"world\"", "'''multi\\nline'''"],
        operations: ["+", "*", "[]", "[:]", "in"],
        mutable: false,
        notes: "Immutable - לא ניתן לשנות תו בודד"
    },
    {
        name: "bool",
        hebrewName: "בוליאני",
        description: "ערך אמת או שקר",
        examples: ["True", "False"],
        operations: ["and", "or", "not"],
        mutable: false,
        notes: "True == 1, False == 0"
    },
    {
        name: "list",
        hebrewName: "רשימה",
        description: "אוסף מסודר וניתן לשינוי",
        examples: ["[1, 2, 3]", "['a', 'b']", "[]"],
        operations: ["+", "*", "[]", "[:]", "in", "append", "extend", "pop"],
        mutable: true,
        notes: "Mutable - ניתן לשנות, להוסיף ולמחוק איברים"
    },
    {
        name: "tuple",
        hebrewName: "טאפל",
        description: "אוסף מסודר שלא ניתן לשינוי",
        examples: ["(1, 2, 3)", "('a',)", "()"],
        operations: ["+", "*", "[]", "[:]", "in"],
        mutable: false,
        notes: "Immutable - לא ניתן לשנות לאחר יצירה"
    },
    {
        name: "dict",
        hebrewName: "מילון",
        description: "אוסף של זוגות מפתח-ערך",
        examples: ["{'a': 1}", "{1: 'one'}", "{}"],
        operations: ["[]", "in", "keys()", "values()", "items()", "get()"],
        mutable: true,
        notes: "מפתחות חייבים להיות hashable (immutable)"
    },
    {
        name: "set",
        hebrewName: "קבוצה",
        description: "אוסף לא מסודר של ערכים ייחודיים",
        examples: ["{1, 2, 3}", "set()", "set([1,2,2])"],
        operations: ["|", "&", "-", "^", "add()", "remove()"],
        mutable: true,
        notes: "איברים חייבים להיות hashable"
    },
    {
        name: "NoneType",
        hebrewName: "None",
        description: "ייצוג של 'כלום' או 'אין ערך'",
        examples: ["None"],
        operations: ["is", "is not"],
        mutable: false,
        notes: "השווה תמיד עם 'is None' ולא '== None'"
    }
];

const conversionTable = [
    { from: "str", to: "int", func: "int('42')", result: "42", warning: "יזרוק ValueError אם לא מספר" },
    { from: "str", to: "float", func: "float('3.14')", result: "3.14", warning: "יזרוק ValueError אם לא מספר" },
    { from: "int", to: "str", func: "str(42)", result: "'42'", warning: "" },
    { from: "int", to: "float", func: "float(42)", result: "42.0", warning: "" },
    { from: "float", to: "int", func: "int(3.99)", result: "3", warning: "חותך (לא מעגל!) לכיוון אפס" },
    { from: "list", to: "tuple", func: "tuple([1,2])", result: "(1, 2)", warning: "" },
    { from: "tuple", to: "list", func: "list((1,2))", result: "[1, 2]", warning: "" },
    { from: "str", to: "list", func: "list('abc')", result: "['a','b','c']", warning: "" },
    { from: "list", to: "str", func: "''.join(['a','b'])", result: "'ab'", warning: "רק לרשימות של strings" },
    { from: "list", to: "set", func: "set([1,2,2])", result: "{1, 2}", warning: "מסיר כפילויות" },
];

const falsyValues = [
    { value: "False", type: "bool" },
    { value: "None", type: "NoneType" },
    { value: "0", type: "int" },
    { value: "0.0", type: "float" },
    { value: "''", type: "str (ריק)" },
    { value: "[]", type: "list (ריקה)" },
    { value: "()", type: "tuple (ריק)" },
    { value: "{}", type: "dict (ריק)" },
    { value: "set()", type: "set (ריק)" },
];

// Comprehensive operations table from lecturer's materials
const operationsTable = [
    // int operations
    { type: "int", operation: "+", example: "3 + 4", result: "7", explanation: "מחבר שני מספרים ויוצר מספר חדש", mutable: false },
    { type: "int", operation: "*", example: "3 * 4", result: "12", explanation: "מכפיל את הערכים ומחזיר מספר חדש", mutable: false },
    { type: "int", operation: "/", example: "7 / 2", result: "3.5", explanation: "חילוק רגיל – תמיד מחזיר float", mutable: false },
    { type: "int", operation: "//", example: "7 // 2", result: "3", explanation: "חילוק שלם – לוקח רק את החלק השלם", mutable: false },
    { type: "int", operation: "%", example: "7 % 2", result: "1", explanation: "מחזיר את השארית של החילוק", mutable: false },
    { type: "int", operation: "**", example: "2 ** 3", result: "8", explanation: "מעלה מספר בחזקה", mutable: false },
    // float operations
    { type: "float", operation: "round()", example: "round(3.6)", result: "4", explanation: "מעגל את המספר לערך הקרוב ביותר", mutable: false },
    { type: "float", operation: "+", example: "1.5 + 2.5", result: "4", explanation: "חיבור מספרים עשרוניים", mutable: false },
    // bool operations
    { type: "bool", operation: "and", example: "True and False", result: "False", explanation: "אמת רק אם שני הערכים אמת", mutable: false },
    { type: "bool", operation: "or", example: "True or False", result: "True", explanation: "אמת אם לפחות אחד אמת", mutable: false },
    { type: "bool", operation: "not", example: "not True", result: "False", explanation: "הופך אמת לשקר ולהפך", mutable: false },
    // str operations
    { type: "str", operation: "חיתוך [:]", example: '"hello"[1:4]', result: '"ell"', explanation: "מחזיר חלק מהמחרוזת לפי אינדקסים, לא משנה את המשתנה בזיכרון", mutable: false },
    { type: "str", operation: "upper()", example: '"hi".upper()', result: '"HI"', explanation: "יוצר מחרוזת חדשה (בזיכרון) עם אותיות גדולות", mutable: false },
    { type: "str", operation: "lower()", example: '"HI".lower()', result: '"hi"', explanation: "יוצר מחרוזת חדשה (בזיכרון) עם אותיות קטנות", mutable: false },
    { type: "str", operation: "replace()", example: '"hi".replace("h","b")', result: '"bi"', explanation: "מחליף תווים, יוצר מחרוזת חדשה בזיכרון ומחזיר לנו אותה", mutable: false },
    { type: "str", operation: "split()", example: '"a,b".split(",")', result: '["a","b"]', explanation: "מפרק מחרוזת לרשימה לפי מפריד", mutable: false },
    { type: "str", operation: "+", example: '"hi" + "!"', result: '"hi!"', explanation: "מחבר מחרוזות ויוצר חדשה בזיכרון", mutable: false },
    // tuple operations
    { type: "Tuple", operation: "אינדקס", example: "(1,2,3)[0]", result: "1", explanation: "גישה לאיבר לפי מיקום", mutable: false },
    { type: "Tuple", operation: "חיתוך", example: "(1,2,3)[1:]", result: "(2,3)", explanation: "מחזיר tuple חדש עם חלק מהערכים", mutable: false },
    { type: "Tuple", operation: "count()", example: "(1,1,2).count(1)", result: "2", explanation: "סופר כמה פעמים ערך מופיע", mutable: false },
    // list operations
    { type: "List", operation: "append()", example: "[1,2].append(3)", result: "[1,2,3]", explanation: "מוסיף איבר לסוף הרשימה", mutable: true },
    { type: "List", operation: "pop()", example: "[1,2,3].pop()", result: "3", explanation: "מסיר ומחזיר איבר מהרשימה", mutable: true },
    { type: "List", operation: "sort()", example: "[3,1,2].sort()", result: "[1,2,3]", explanation: "ממיין את הרשימה עצמה", mutable: true },
    { type: "List", operation: '"".join()', example: '"".join(["a","b"])', result: '"ab"', explanation: "מחבר רשימת מחרוזות למחרוזת אחת", mutable: false },
    // dict operations
    { type: "Dict", operation: "insert()", example: 'd["a"] = 1', result: '{"a": 1}', explanation: "מוסיף מפתח וערך למילון", mutable: true },
    { type: "Dict", operation: "get()", example: 'd.get("a")', result: "1 / None", explanation: "מחזיר ערך (בלי שגיאה אם לא קיים)", mutable: false },
    { type: "Dict", operation: "keys()", example: "d.keys()", result: "dict_keys", explanation: "מחזיר אוסף של כל המפתחות", mutable: false },
    // set operations
    { type: "Set", operation: "add()", example: "{1,2}.add(3)", result: "{1,2,3}", explanation: "מוסיף איבר ייחודי לקבוצה", mutable: true },
    { type: "Set", operation: "remove()", example: "{1,2}.remove(1)", result: "{2}", explanation: "מסיר איבר (שגיאה אם לא קיים)", mutable: true },
    { type: "Set", operation: "discard()", example: "{1,2}.discard(5)", result: "{1,2}", explanation: "מסיר איבר (אין שגיאה אם לא קיים)", mutable: true },
    { type: "Set", operation: "pop()", example: "{1,2}.pop()", result: "האיבר שנשלף", explanation: "שולף ומסיר איבר אקראי", mutable: true },
    { type: "Set", operation: "| (Union)", example: "{1} | {2}", result: "{1,2}", explanation: "מאחד קבוצות (כל האיברים בלי כפילויות)", mutable: false },
    { type: "Set", operation: "& (Intersection)", example: "{1,2} & {2,3}", result: "{2}", explanation: "מחזיר רק איברים משותפים (בלי כפילויות)", mutable: false },
    { type: "Set", operation: "- (Difference)", example: "{1,2} - {2}", result: "{1}", explanation: "מחזיר איברים שנמצאים רק בראשונה", mutable: false },
];

export default function DataTypesGuide() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 p-4 md:p-8 overflow-auto">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8 md:mb-12">
                        <h1 className="font-display text-2xl md:text-4xl font-black mb-3 text-on-surface">📚 מילון טיפוסי נתונים</h1>
                        <p className="text-on-surface-variant text-sm md:text-lg">כל מה שצריך לדעת על טיפוסי נתונים בפייתון</p>
                    </div>

                    {/* Data Types Grid */}
                    <section className="mb-10 md:mb-14">
                        <h2 className="font-display text-xl md:text-2xl font-bold mb-5 md:mb-7 flex items-center gap-2 text-on-surface">
                            <span className="text-primary">📦</span> טיפוסי הנתונים העיקריים
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {dataTypes.map((dt) => (
                                <div
                                    key={dt.name}
                                    className="rounded-2xl p-5 md:p-6 card-hover ghost-border"
                                    style={{ background: 'var(--surface-container)' }}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-display text-lg md:text-xl font-bold text-primary">{dt.name}</h3>
                                        <span className={`text-xs px-2.5 py-1 rounded-full ${dt.mutable ? 'text-orange-400' : 'text-blue-400'}`}
                                              style={{ background: dt.mutable ? 'rgba(249,115,22,0.12)' : 'rgba(96,165,250,0.12)' }}>
                                            {dt.mutable ? 'Mutable' : 'Immutable'}
                                        </span>
                                    </div>
                                    <p className="text-lg font-medium text-on-surface mb-2">{dt.hebrewName}</p>
                                    <p className="text-on-surface-variant text-sm mb-4">{dt.description}</p>

                                    <div className="mb-3">
                                        <p className="text-xs text-on-surface-variant/60 mb-1.5 tracking-widest uppercase">דוגמאות:</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {dt.examples.map((ex, i) => (
                                                <code key={i} className="text-xs px-2 py-1 rounded text-on-surface" style={{ background: 'var(--surface-container-lowest)' }}>{ex}</code>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <p className="text-xs text-on-surface-variant/60 mb-1.5 tracking-widest uppercase">פעולות:</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {dt.operations.map((op, i) => (
                                                <span key={i} className="text-xs text-primary px-2 py-0.5 rounded" style={{ background: 'rgba(0,247,123,0.1)' }}>{op}</span>
                                            ))}
                                        </div>
                                    </div>

                                    {dt.notes && (
                                        <p className="text-xs text-orange-400 p-2.5 rounded-lg" style={{ background: 'rgba(249,115,22,0.08)' }}>
                                            ⚠️ {dt.notes}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Comprehensive Operations Table */}
                    <section className="mb-10 md:mb-14">
                        <h2 className="font-display text-xl md:text-2xl font-bold mb-5 md:mb-7 flex items-center gap-2 text-on-surface">
                            <span className="text-primary">📊</span> טבלת פעולות מקיפה
                        </h2>
                        <p className="text-on-surface-variant mb-5 text-sm">כל הפעולות החשובות לפי טיפוס - מתוך חומרי המרצה</p>
                        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface-container)' }}>
                            <table className="w-full text-xs md:text-sm">
                                <thead>
                                    <tr style={{ background: 'rgba(0,247,123,0.08)' }}>
                                        <th className="p-3 md:p-4 text-right font-bold text-primary">טיפוס</th>
                                        <th className="p-3 md:p-4 text-right font-bold text-on-surface">פעולה</th>
                                        <th className="p-3 md:p-4 text-right font-bold text-on-surface">דוגמה</th>
                                        <th className="p-3 md:p-4 text-right font-bold text-on-surface">תוצאה</th>
                                        <th className="p-3 md:p-4 text-right font-bold text-on-surface hidden md:table-cell">הסבר</th>
                                        <th className="p-3 md:p-4 text-center font-bold text-on-surface">Mutable?</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {operationsTable.map((row, i) => {
                                        const isFirstOfType = i === 0 || operationsTable[i - 1].type !== row.type;
                                        return (
                                            <tr key={i}
                                                className="transition-colors hover:bg-surface-container-high"
                                                style={{
                                                    background: isFirstOfType ? 'var(--surface-container-low)' : undefined,
                                                    borderTop: '1px solid rgba(59,75,60,0.15)',
                                                }}>
                                                <td className="p-3 md:p-4">
                                                    {isFirstOfType && (
                                                        <code className="text-primary font-bold">{row.type}</code>
                                                    )}
                                                </td>
                                                <td className="p-3 md:p-4"><code className="text-blue-400">{row.operation}</code></td>
                                                <td className="p-3 md:p-4"><code className="text-green-400 text-xs">{row.example}</code></td>
                                                <td className="p-3 md:p-4"><code className="text-orange-400">{row.result}</code></td>
                                                <td className="p-3 md:p-4 text-on-surface-variant text-xs hidden md:table-cell">{row.explanation}</td>
                                                <td className="p-3 md:p-4 text-center">
                                                    {row.mutable ? (
                                                        <span className="text-green-400">✅</span>
                                                    ) : (
                                                        <span className="text-red-400">❌</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4 flex gap-4 text-xs text-on-surface-variant">
                            <span><span className="text-green-400">✅</span> Mutable = משנה את האובייקט המקורי</span>
                            <span><span className="text-red-400">❌</span> Immutable = יוצר אובייקט חדש</span>
                        </div>
                    </section>

                    {/* Type Conversions */}
                    <section className="mb-10 md:mb-14">
                        <h2 className="font-display text-xl md:text-2xl font-bold mb-5 md:mb-7 flex items-center gap-2 text-on-surface">
                            <span className="text-primary">🔄</span> המרות בין טיפוסים
                        </h2>
                        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface-container)' }}>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr style={{ background: 'var(--surface-container-high)' }}>
                                        <th className="p-3 text-right text-on-surface font-bold">מ-</th>
                                        <th className="p-3 text-right text-on-surface font-bold">ל-</th>
                                        <th className="p-3 text-right text-on-surface font-bold">פונקציה</th>
                                        <th className="p-3 text-right text-on-surface font-bold">תוצאה</th>
                                        <th className="p-3 text-right text-on-surface font-bold">הערה</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {conversionTable.map((row, i) => (
                                        <tr key={i} className="hover:bg-surface-container-high transition-colors" style={{ borderTop: '1px solid rgba(59,75,60,0.15)' }}>
                                            <td className="p-3"><code className="text-blue-400">{row.from}</code></td>
                                            <td className="p-3"><code className="text-green-400">{row.to}</code></td>
                                            <td className="p-3"><code className="text-primary">{row.func}</code></td>
                                            <td className="p-3"><code className="text-on-surface">{row.result}</code></td>
                                            <td className="p-3 text-orange-400 text-xs">{row.warning}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Falsy Values */}
                    <section className="mb-10 md:mb-14">
                        <h2 className="font-display text-xl md:text-2xl font-bold mb-5 md:mb-7 flex items-center gap-2 text-on-surface">
                            <span className="text-primary">❌</span> ערכי Falsy
                        </h2>
                        <p className="text-on-surface-variant mb-5">ערכים אלו נחשבים כ-False בתנאי if:</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                            {falsyValues.map((fv, i) => (
                                <div key={i} className="rounded-xl p-4 text-center ghost-border" style={{ background: 'var(--surface-container-high)' }}>
                                    <code className="text-lg font-bold text-red-400">{fv.value}</code>
                                    <p className="text-xs text-on-surface-variant mt-1">{fv.type}</p>
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-on-surface-variant mt-4">💡 כל ערך אחר נחשב Truthy (True)</p>
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
