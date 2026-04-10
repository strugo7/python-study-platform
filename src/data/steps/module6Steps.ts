import type { SimStepState } from '../curriculum.types';

// Module 6: קריאת קובץ ציונים עם טיפול בשגיאות
// Since file I/O can't run in browser, we simulate as if reading a file
// with known content: "דני:85,90,78\nרונית:92,88,95\nיוסי:70,75,80"

export const module6Steps: SimStepState[] = [
    {
        lineNumber: 1,
        variables: [],
        output: [],
        description: 'הגדרת פונקציה process_student_file(filename) — מעבדת קובץ סטודנטים',
        callStack: ['global'],
    },
    // --- Simulated call ---
    {
        lineNumber: 33,
        variables: [
            { name: 'filename', value: 'students.txt', type: 'str', address: '0x4F00', isNew: true, scope: 'local' },
        ],
        output: [],
        description: "קוראים ל-process_student_file('students.txt')",
        callStack: ['global', 'process_student_file()'],
    },
    {
        lineNumber: 5,
        variables: [
            { name: 'filename', value: 'students.txt', type: 'str', address: '0x4F00', scope: 'local' },
            { name: 'students', value: 'dict[0]', type: 'dict', address: '0x4F01', isNew: true, scope: 'local', pointsTo: '0xA500' },
        ],
        output: [],
        description: 'יוצרים מילון ריק students — כאן נאחסן את הנתונים',
        callStack: ['global', 'process_student_file()'],
        heapObjects: [
            { type: 'dict', address: '0xA500', entries: [] },
        ],
    },
    {
        lineNumber: 7,
        variables: [
            { name: 'filename', value: 'students.txt', type: 'str', address: '0x4F00', scope: 'local' },
            { name: 'students', value: 'dict[0]', type: 'dict', address: '0x4F01', scope: 'local', pointsTo: '0xA500' },
        ],
        output: [],
        description: "try — מנסים לפתוח את הקובץ. אם הקובץ לא קיים, נתפס ב-except",
        callStack: ['global', 'process_student_file()'],
        heapObjects: [
            { type: 'dict', address: '0xA500', entries: [] },
        ],
    },
    {
        lineNumber: 8,
        variables: [
            { name: 'filename', value: 'students.txt', type: 'str', address: '0x4F00', scope: 'local' },
            { name: 'students', value: 'dict[0]', type: 'dict', address: '0x4F01', scope: 'local', pointsTo: '0xA500' },
            { name: 'file', value: '<file>', type: 'TextIO', address: '0x4F02', isNew: true, scope: 'local' },
        ],
        output: [],
        description: "with open — פותחים את הקובץ לקריאה. with מבטיח סגירה אוטומטית",
        callStack: ['global', 'process_student_file()'],
        heapObjects: [
            { type: 'dict', address: '0xA500', entries: [] },
        ],
    },
    // --- Reading line 1: "דני:85,90,78" ---
    {
        lineNumber: 9,
        variables: [
            { name: 'filename', value: 'students.txt', type: 'str', address: '0x4F00', scope: 'local' },
            { name: 'students', value: 'dict[0]', type: 'dict', address: '0x4F01', scope: 'local', pointsTo: '0xA500' },
            { name: 'line', value: 'דני:85,90,78', type: 'str', address: '0x4F03', isNew: true, scope: 'local' },
        ],
        output: [],
        description: "קוראים שורה ראשונה מהקובץ: 'דני:85,90,78'",
        callStack: ['global', 'process_student_file()'],
        heapObjects: [
            { type: 'dict', address: '0xA500', entries: [] },
        ],
    },
    {
        lineNumber: 11,
        variables: [
            { name: 'filename', value: 'students.txt', type: 'str', address: '0x4F00', scope: 'local' },
            { name: 'students', value: 'dict[0]', type: 'dict', address: '0x4F01', scope: 'local', pointsTo: '0xA500' },
            { name: 'line', value: 'דני:85,90,78', type: 'str', address: '0x4F03', scope: 'local' },
            { name: 'parts', value: "['דני','85,90,78']", type: 'list', address: '0x4F04', isNew: true, scope: 'local' },
        ],
        output: [],
        description: "strip().split(':') מפצל ל-['דני', '85,90,78'] — שם וציונים",
        callStack: ['global', 'process_student_file()'],
        heapObjects: [
            { type: 'dict', address: '0xA500', entries: [] },
        ],
    },
    {
        lineNumber: 16,
        variables: [
            { name: 'filename', value: 'students.txt', type: 'str', address: '0x4F00', scope: 'local' },
            { name: 'students', value: 'dict[1]', type: 'dict', address: '0x4F01', changed: true, scope: 'local', pointsTo: '0xA500' },
            { name: 'name', value: 'דני', type: 'str', address: '0x4F05', isNew: true, scope: 'local' },
        ],
        output: [],
        description: "ממירים '85,90,78' לרשימת מספרים [85,90,78] ומוסיפים למילון",
        callStack: ['global', 'process_student_file()'],
        heapObjects: [
            { type: 'dict', address: '0xA500', entries: [{ key: 'דני', value: '[85, 90, 78]' }] },
        ],
    },
    // --- Reading line 2: "רונית:92,88,95" ---
    {
        lineNumber: 9,
        variables: [
            { name: 'filename', value: 'students.txt', type: 'str', address: '0x4F00', scope: 'local' },
            { name: 'students', value: 'dict[2]', type: 'dict', address: '0x4F01', changed: true, scope: 'local', pointsTo: '0xA500' },
            { name: 'line', value: 'רונית:92,88,95', type: 'str', address: '0x4F03', changed: true, scope: 'local' },
            { name: 'name', value: 'רונית', type: 'str', address: '0x4F05', changed: true, scope: 'local' },
        ],
        output: [],
        description: "שורה שנייה: 'רונית:92,88,95' — מפצלים ומוסיפים למילון",
        callStack: ['global', 'process_student_file()'],
        heapObjects: [
            { type: 'dict', address: '0xA500', entries: [{ key: 'דני', value: '[85, 90, 78]' }, { key: 'רונית', value: '[92, 88, 95]' }] },
        ],
    },
    // --- Reading line 3: "יוסי:70,75,80" ---
    {
        lineNumber: 9,
        variables: [
            { name: 'filename', value: 'students.txt', type: 'str', address: '0x4F00', scope: 'local' },
            { name: 'students', value: 'dict[3]', type: 'dict', address: '0x4F01', changed: true, scope: 'local', pointsTo: '0xA500' },
            { name: 'line', value: 'יוסי:70,75,80', type: 'str', address: '0x4F03', changed: true, scope: 'local' },
            { name: 'name', value: 'יוסי', type: 'str', address: '0x4F05', changed: true, scope: 'local' },
        ],
        output: [],
        description: "שורה שלישית: 'יוסי:70,75,80' — מפצלים ומוסיפים למילון",
        callStack: ['global', 'process_student_file()'],
        heapObjects: [
            { type: 'dict', address: '0xA500', entries: [{ key: 'דני', value: '[85, 90, 78]' }, { key: 'רונית', value: '[92, 88, 95]' }, { key: 'יוסי', value: '[70, 75, 80]' }] },
        ],
    },
    // --- Computing averages ---
    {
        lineNumber: 20,
        variables: [
            { name: 'students', value: 'dict[3]', type: 'dict', address: '0x4F01', scope: 'local', pointsTo: '0xA500' },
            { name: 'averages', value: 'dict[0]', type: 'dict', address: '0x4F06', isNew: true, scope: 'local', pointsTo: '0xA600' },
        ],
        output: [],
        description: 'יוצרים מילון ריק averages — נחשב ממוצע לכל סטודנט',
        callStack: ['global', 'process_student_file()'],
        heapObjects: [
            { type: 'dict', address: '0xA500', entries: [{ key: 'דני', value: '[85, 90, 78]' }, { key: 'רונית', value: '[92, 88, 95]' }, { key: 'יוסי', value: '[70, 75, 80]' }] },
            { type: 'dict', address: '0xA600', entries: [] },
        ],
    },
    {
        lineNumber: 23,
        variables: [
            { name: 'students', value: 'dict[3]', type: 'dict', address: '0x4F01', scope: 'local', pointsTo: '0xA500' },
            { name: 'averages', value: 'dict[3]', type: 'dict', address: '0x4F06', changed: true, scope: 'local', pointsTo: '0xA600' },
        ],
        output: [],
        description: 'חישוב ממוצעים: דני=84.33, רונית=91.67, יוסי=75.0',
        callStack: ['global', 'process_student_file()'],
        heapObjects: [
            { type: 'dict', address: '0xA500', entries: [{ key: 'דני', value: '[85, 90, 78]' }, { key: 'רונית', value: '[92, 88, 95]' }, { key: 'יוסי', value: '[70, 75, 80]' }] },
            { type: 'dict', address: '0xA600', entries: [{ key: 'דני', value: 84.33 }, { key: 'רונית', value: 91.67 }, { key: 'יוסי', value: 75.0 }] },
        ],
    },
    {
        lineNumber: 25,
        variables: [
            { name: 'averages', value: 'dict[3]', type: 'dict', address: '0x4F06', scope: 'local', pointsTo: '0xA600' },
        ],
        output: [],
        description: 'return averages — מחזירים את מילון הממוצעים. with סוגר את הקובץ אוטומטית',
        callStack: ['global'],
        heapObjects: [
            { type: 'dict', address: '0xA600', entries: [{ key: 'דני', value: 84.33 }, { key: 'רונית', value: 91.67 }, { key: 'יוסי', value: 75.0 }] },
        ],
    },
];
