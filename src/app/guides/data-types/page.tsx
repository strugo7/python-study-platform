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
            <main className="flex-1 p-4 md:p-6 overflow-auto">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-6 md:mb-8">
                        <h1 className="text-2xl md:text-4xl font-black mb-3">📚 מילון טיפוסי נתונים</h1>
                        <p className="text-text-muted text-sm md:text-lg">כל מה שצריך לדעת על טיפוסי נתונים בפייתון</p>
                    </div>

                    {/* Data Types Grid */}
                    <section className="mb-8 md:mb-12">
                        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-2">
                            <span className="text-primary">📦</span> טיפוסי הנתונים העיקריים
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {dataTypes.map((dt) => (
                                <div
                                    key={dt.name}
                                    className="bg-surface-dark rounded-xl border border-border-dark p-4 md:p-5 hover:border-primary/50 transition-all"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-lg md:text-xl font-bold text-primary">{dt.name}</h3>
                                        <span className={`text-xs px-2 py-1 rounded-full ${dt.mutable ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                            {dt.mutable ? 'Mutable' : 'Immutable'}
                                        </span>
                                    </div>
                                    <p className="text-lg font-medium mb-2">{dt.hebrewName}</p>
                                    <p className="text-text-muted text-sm mb-3">{dt.description}</p>

                                    <div className="mb-3">
                                        <p className="text-xs text-text-muted mb-1">דוגמאות:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {dt.examples.map((ex, i) => (
                                                <code key={i} className="text-xs bg-background-dark px-2 py-1 rounded">{ex}</code>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <p className="text-xs text-text-muted mb-1">פעולות:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {dt.operations.map((op, i) => (
                                                <span key={i} className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">{op}</span>
                                            ))}
                                        </div>
                                    </div>

                                    {dt.notes && (
                                        <p className="text-xs text-orange-400 bg-orange-500/10 p-2 rounded">
                                            ⚠️ {dt.notes}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Comprehensive Operations Table */}
                    <section className="mb-8 md:mb-12">
                        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-2">
                            <span className="text-primary">📊</span> טבלת פעולות מקיפה
                        </h2>
                        <p className="text-text-muted mb-4 text-sm">כל הפעולות החשובות לפי טיפוס - מתוך חומרי המרצה</p>
                        <div className="bg-surface-dark rounded-xl border border-border-dark overflow-x-auto">
                            <table className="w-full text-xs md:text-sm">
                                <thead className="bg-primary/20">
                                    <tr>
                                        <th className="p-2 md:p-3 text-right font-bold text-primary">טיפוס</th>
                                        <th className="p-2 md:p-3 text-right font-bold">פעולה</th>
                                        <th className="p-2 md:p-3 text-right font-bold">דוגמה</th>
                                        <th className="p-2 md:p-3 text-right font-bold">תוצאה</th>
                                        <th className="p-2 md:p-3 text-right font-bold hidden md:table-cell">הסבר</th>
                                        <th className="p-2 md:p-3 text-center font-bold">Mutable?</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {operationsTable.map((row, i) => {
                                        const isFirstOfType = i === 0 || operationsTable[i - 1].type !== row.type;
                                        return (
                                            <tr key={i} className={`border-t border-border-dark hover:bg-border-dark/30 ${isFirstOfType ? 'bg-border-dark/20' : ''}`}>
                                                <td className="p-2 md:p-3">
                                                    {isFirstOfType && (
                                                        <code className="text-primary font-bold">{row.type}</code>
                                                    )}
                                                </td>
                                                <td className="p-2 md:p-3"><code className="text-blue-400">{row.operation}</code></td>
                                                <td className="p-2 md:p-3"><code className="text-green-400 text-xs">{row.example}</code></td>
                                                <td className="p-2 md:p-3"><code className="text-orange-400">{row.result}</code></td>
                                                <td className="p-2 md:p-3 text-text-muted text-xs hidden md:table-cell">{row.explanation}</td>
                                                <td className="p-2 md:p-3 text-center">
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
                        <div className="mt-4 flex gap-4 text-xs text-text-muted">
                            <span><span className="text-green-400">✅</span> Mutable = משנה את האובייקט המקורי</span>
                            <span><span className="text-red-400">❌</span> Immutable = יוצר אובייקט חדש</span>
                        </div>
                    </section>

                    {/* Type Conversions */}
                    <section className="mb-8 md:mb-12">
                        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-2">
                            <span className="text-primary">🔄</span> המרות בין טיפוסים
                        </h2>
                        <div className="bg-surface-dark rounded-xl border border-border-dark overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-border-dark/50">
                                    <tr>
                                        <th className="p-3 text-right">מ-</th>
                                        <th className="p-3 text-right">ל-</th>
                                        <th className="p-3 text-right">פונקציה</th>
                                        <th className="p-3 text-right">תוצאה</th>
                                        <th className="p-3 text-right">הערה</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {conversionTable.map((row, i) => (
                                        <tr key={i} className="border-t border-border-dark hover:bg-border-dark/30">
                                            <td className="p-3"><code className="text-blue-400">{row.from}</code></td>
                                            <td className="p-3"><code className="text-green-400">{row.to}</code></td>
                                            <td className="p-3"><code className="text-primary">{row.func}</code></td>
                                            <td className="p-3"><code>{row.result}</code></td>
                                            <td className="p-3 text-orange-400 text-xs">{row.warning}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Falsy Values */}
                    <section className="mb-8 md:mb-12">
                        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-2">
                            <span className="text-primary">❌</span> ערכי Falsy
                        </h2>
                        <p className="text-text-muted mb-4">ערכים אלו נחשבים כ-False בתנאי if:</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                            {falsyValues.map((fv, i) => (
                                <div key={i} className="bg-surface-dark rounded-lg border border-red-500/30 p-4 text-center">
                                    <code className="text-lg font-bold text-red-400">{fv.value}</code>
                                    <p className="text-xs text-text-muted mt-1">{fv.type}</p>
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-text-muted mt-4">💡 כל ערך אחר נחשב Truthy (True)</p>
                    </section>

                    {/* Back Link */}
                    <div className="text-center mt-8">
                        <Link href="/" className="text-text-muted hover:text-primary transition-colors">
                            ← חזרה לדף הבית
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
