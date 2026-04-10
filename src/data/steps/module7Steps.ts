import type { SimStepState } from '../curriculum.types';

// Module 7: מחלקת סטודנט — class, __init__, self, methods
// Code:
// class Student:
//     def __init__(self, name, student_id):
//         self.name = name
//         self.student_id = student_id
//         self.grades = []
//     def add_grade(self, grade):
//         if 0 <= grade <= 100:
//             self.grades.append(grade)
//     def get_average(self):
//         if not self.grades:
//             return 0
//         return sum(self.grades) / len(self.grades)
//     def __str__(self):
//         return f'{self.name} (ID: {self.student_id})'
// s = Student('דני', 12345)
// s.add_grade(85)
// s.add_grade(90)
// print(s)
// print(f'ממוצע: {s.get_average()}')

export const module7Steps: SimStepState[] = [
    {
        lineNumber: 1,
        variables: [],
        output: [],
        description: 'הגדרת מחלקה Student — תבנית ליצירת אובייקטי סטודנט',
        callStack: ['global'],
    },
    // --- s = Student('דני', 12345) ---
    {
        lineNumber: 20,
        variables: [],
        output: [],
        description: "קוראים ל-Student('דני', 12345) — Python קורא אוטומטית ל-__init__",
        callStack: ['global', 'Student.__init__()'],
    },
    {
        lineNumber: 3,
        variables: [
            { name: 's', value: 'Student', type: 'Student', address: '0x4F00', isNew: true, pointsTo: '0xB100' },
        ],
        output: [],
        description: 'self.name = "דני" — שומרים את השם באובייקט',
        callStack: ['global', 'Student.__init__()'],
        heapObjects: [
            {
                type: 'object', className: 'Student', address: '0xB100', attributes: [
                    { name: 'name', value: 'דני' },
                ]
            },
        ],
    },
    {
        lineNumber: 4,
        variables: [
            { name: 's', value: 'Student', type: 'Student', address: '0x4F00', pointsTo: '0xB100' },
        ],
        output: [],
        description: 'self.student_id = 12345 — שומרים את מספר הסטודנט',
        callStack: ['global', 'Student.__init__()'],
        heapObjects: [
            {
                type: 'object', className: 'Student', address: '0xB100', attributes: [
                    { name: 'name', value: 'דני' },
                    { name: 'student_id', value: 12345 },
                ]
            },
        ],
    },
    {
        lineNumber: 5,
        variables: [
            { name: 's', value: 'Student', type: 'Student', address: '0x4F00', pointsTo: '0xB100' },
        ],
        output: [],
        description: 'self.grades = [] — יוצרים רשימת ציונים ריקה לסטודנט',
        callStack: ['global', 'Student.__init__()'],
        heapObjects: [
            {
                type: 'object', className: 'Student', address: '0xB100', attributes: [
                    { name: 'name', value: 'דני' },
                    { name: 'student_id', value: 12345 },
                    { name: 'grades', value: { type: 'list' as const, items: [], address: '0xB110' } },
                ]
            },
        ],
    },
    {
        lineNumber: 20,
        variables: [
            { name: 's', value: 'Student', type: 'Student', address: '0x4F00', pointsTo: '0xB100' },
        ],
        output: [],
        description: '__init__ הסתיים — s מצביע על אובייקט Student חדש',
        callStack: ['global'],
        heapObjects: [
            {
                type: 'object', className: 'Student', address: '0xB100', attributes: [
                    { name: 'name', value: 'דני' },
                    { name: 'student_id', value: 12345 },
                    { name: 'grades', value: { type: 'list' as const, items: [], address: '0xB110' } },
                ]
            },
        ],
    },
    // --- s.add_grade(85) ---
    {
        lineNumber: 21,
        variables: [
            { name: 's', value: 'Student', type: 'Student', address: '0x4F00', pointsTo: '0xB100' },
        ],
        output: [],
        description: 's.add_grade(85) — קוראים למתודה, self=s, grade=85',
        callStack: ['global', 'Student.add_grade()'],
        heapObjects: [
            {
                type: 'object', className: 'Student', address: '0xB100', attributes: [
                    { name: 'name', value: 'דני' },
                    { name: 'student_id', value: 12345 },
                    { name: 'grades', value: { type: 'list' as const, items: [], address: '0xB110' } },
                ]
            },
        ],
    },
    {
        lineNumber: 8,
        variables: [
            { name: 's', value: 'Student', type: 'Student', address: '0x4F00', pointsTo: '0xB100' },
        ],
        output: [],
        description: '0 <= 85 <= 100 → אמת! הציון תקין, מוסיפים לרשימה',
        callStack: ['global', 'Student.add_grade()'],
        heapObjects: [
            {
                type: 'object', className: 'Student', address: '0xB100', attributes: [
                    { name: 'name', value: 'דני' },
                    { name: 'student_id', value: 12345 },
                    { name: 'grades', value: { type: 'list' as const, items: [85], address: '0xB110' } },
                ]
            },
        ],
    },
    // --- s.add_grade(90) ---
    {
        lineNumber: 22,
        variables: [
            { name: 's', value: 'Student', type: 'Student', address: '0x4F00', pointsTo: '0xB100' },
        ],
        output: [],
        description: 's.add_grade(90) — מוסיפים ציון נוסף',
        callStack: ['global', 'Student.add_grade()'],
        heapObjects: [
            {
                type: 'object', className: 'Student', address: '0xB100', attributes: [
                    { name: 'name', value: 'דני' },
                    { name: 'student_id', value: 12345 },
                    { name: 'grades', value: { type: 'list' as const, items: [85, 90], address: '0xB110' } },
                ]
            },
        ],
    },
    // --- print(s) ---
    {
        lineNumber: 23,
        variables: [
            { name: 's', value: 'Student', type: 'Student', address: '0x4F00', pointsTo: '0xB100' },
        ],
        output: [],
        description: 'print(s) — Python קורא אוטומטית ל-__str__ של האובייקט',
        callStack: ['global', 'Student.__str__()'],
        heapObjects: [
            {
                type: 'object', className: 'Student', address: '0xB100', attributes: [
                    { name: 'name', value: 'דני' },
                    { name: 'student_id', value: 12345 },
                    { name: 'grades', value: { type: 'list' as const, items: [85, 90], address: '0xB110' } },
                ]
            },
        ],
    },
    {
        lineNumber: 23,
        variables: [
            { name: 's', value: 'Student', type: 'Student', address: '0x4F00', pointsTo: '0xB100' },
        ],
        output: ['דני (ID: 12345)'],
        description: '__str__ מחזיר "דני (ID: 12345)" — זה מה שמודפס',
        callStack: ['global'],
        heapObjects: [
            {
                type: 'object', className: 'Student', address: '0xB100', attributes: [
                    { name: 'name', value: 'דני' },
                    { name: 'student_id', value: 12345 },
                    { name: 'grades', value: { type: 'list' as const, items: [85, 90], address: '0xB110' } },
                ]
            },
        ],
    },
    // --- print(f'ממוצע: {s.get_average()}') ---
    {
        lineNumber: 24,
        variables: [
            { name: 's', value: 'Student', type: 'Student', address: '0x4F00', pointsTo: '0xB100' },
        ],
        output: ['דני (ID: 12345)'],
        description: 'קוראים ל-s.get_average() — מחשבים (85+90)/2 = 87.5',
        callStack: ['global', 'Student.get_average()'],
        heapObjects: [
            {
                type: 'object', className: 'Student', address: '0xB100', attributes: [
                    { name: 'name', value: 'דני' },
                    { name: 'student_id', value: 12345 },
                    { name: 'grades', value: { type: 'list' as const, items: [85, 90], address: '0xB110' } },
                ]
            },
        ],
    },
    {
        lineNumber: 24,
        variables: [
            { name: 's', value: 'Student', type: 'Student', address: '0x4F00', pointsTo: '0xB100' },
        ],
        output: ['דני (ID: 12345)', 'ממוצע: 87.5'],
        description: 'מדפיסים "ממוצע: 87.5" — ממוצע שני הציונים של דני',
        callStack: ['global'],
        heapObjects: [
            {
                type: 'object', className: 'Student', address: '0xB100', attributes: [
                    { name: 'name', value: 'דני' },
                    { name: 'student_id', value: 12345 },
                    { name: 'grades', value: { type: 'list' as const, items: [85, 90], address: '0xB110' } },
                ]
            },
        ],
    },
];
