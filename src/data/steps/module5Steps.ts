import type { SimStepState } from '../curriculum.types';

// Module 5: מערכת ניהול ציונים — functions, dicts, for loops
// The code defines functions then calls them. We trace the execution flow.

export const module5Steps: SimStepState[] = [
    // --- Function definitions (shown briefly) ---
    {
        lineNumber: 1,
        variables: [],
        output: [],
        description: 'הגדרת פונקציה create_gradebook() — הפונקציה נשמרת בזיכרון',
        callStack: ['global'],
    },
    {
        lineNumber: 11,
        variables: [],
        output: [],
        description: 'הגדרת פונקציה calculate_average(grades) — מחשבת ממוצע רשימה',
        callStack: ['global'],
    },
    {
        lineNumber: 15,
        variables: [],
        output: [],
        description: 'הגדרת פונקציה get_all_averages(gradebook) — ממוצע לכל סטודנט',
        callStack: ['global'],
    },
    {
        lineNumber: 22,
        variables: [],
        output: [],
        description: 'הגדרת פונקציה get_top_students(gradebook, threshold) — מחזירה מצטיינים',
        callStack: ['global'],
    },
    // --- Execution: gb = create_gradebook() ---
    {
        lineNumber: 30,
        variables: [],
        output: [],
        description: 'קוראים ל-create_gradebook() — נכנסים לפונקציה',
        callStack: ['global', 'create_gradebook()'],
    },
    {
        lineNumber: 5,
        variables: [
            { name: 'gb', value: 'dict[3]', type: 'dict', address: '0x4F00', isNew: true, pointsTo: '0xA200' },
        ],
        output: [],
        description: 'הפונקציה מחזירה מילון עם 3 סטודנטים ורשימות ציונים',
        callStack: ['global'],
        heapObjects: [
            {
                type: 'dict', address: '0xA200', entries: [
                    { key: 'דני', value: '[85, 90, 78]' },
                    { key: 'רונית', value: '[92, 88, 95]' },
                    { key: 'יוסי', value: '[70, 75, 80]' },
                ]
            },
        ],
    },
    // --- Execution: print('ממוצעים:', get_all_averages(gb)) ---
    {
        lineNumber: 31,
        variables: [
            { name: 'gb', value: 'dict[3]', type: 'dict', address: '0x4F00', pointsTo: '0xA200' },
        ],
        output: [],
        description: 'קוראים ל-get_all_averages(gb) — נכנסים לפונקציה',
        callStack: ['global', 'get_all_averages()'],
        heapObjects: [
            {
                type: 'dict', address: '0xA200', entries: [
                    { key: 'דני', value: '[85, 90, 78]' },
                    { key: 'רונית', value: '[92, 88, 95]' },
                    { key: 'יוסי', value: '[70, 75, 80]' },
                ]
            },
        ],
    },
    {
        lineNumber: 17,
        variables: [
            { name: 'gb', value: 'dict[3]', type: 'dict', address: '0x4F00', pointsTo: '0xA200' },
            { name: 'averages', value: 'dict[0]', type: 'dict', address: '0x4F01', isNew: true, scope: 'local', pointsTo: '0xA300' },
        ],
        output: [],
        description: 'יוצרים מילון ריק averages — כאן נשמור את הממוצעים',
        callStack: ['global', 'get_all_averages()'],
        heapObjects: [
            {
                type: 'dict', address: '0xA200', entries: [
                    { key: 'דני', value: '[85, 90, 78]' },
                    { key: 'רונית', value: '[92, 88, 95]' },
                    { key: 'יוסי', value: '[70, 75, 80]' },
                ]
            },
            { type: 'dict', address: '0xA300', entries: [] },
        ],
    },
    {
        lineNumber: 18,
        variables: [
            { name: 'gb', value: 'dict[3]', type: 'dict', address: '0x4F00', pointsTo: '0xA200' },
            { name: 'averages', value: 'dict[1]', type: 'dict', address: '0x4F01', changed: true, scope: 'local', pointsTo: '0xA300' },
            { name: 'name', value: 'דני', type: 'str', address: '0x4F02', isNew: true, scope: 'local' },
        ],
        output: [],
        description: "לולאת for — עוברים על .items(): name='דני', grades=[85,90,78]",
        callStack: ['global', 'get_all_averages()', 'calculate_average()'],
        heapObjects: [
            {
                type: 'dict', address: '0xA200', entries: [
                    { key: 'דני', value: '[85, 90, 78]' },
                    { key: 'רונית', value: '[92, 88, 95]' },
                    { key: 'יוסי', value: '[70, 75, 80]' },
                ]
            },
            { type: 'dict', address: '0xA300', entries: [{ key: 'דני', value: 84.33 }] },
        ],
    },
    {
        lineNumber: 18,
        variables: [
            { name: 'gb', value: 'dict[3]', type: 'dict', address: '0x4F00', pointsTo: '0xA200' },
            { name: 'averages', value: 'dict[2]', type: 'dict', address: '0x4F01', changed: true, scope: 'local', pointsTo: '0xA300' },
            { name: 'name', value: 'רונית', type: 'str', address: '0x4F02', changed: true, scope: 'local' },
        ],
        output: [],
        description: "איטרציה שנייה: name='רונית', ממוצע = (92+88+95)/3 = 91.67",
        callStack: ['global', 'get_all_averages()'],
        heapObjects: [
            {
                type: 'dict', address: '0xA200', entries: [
                    { key: 'דני', value: '[85, 90, 78]' },
                    { key: 'רונית', value: '[92, 88, 95]' },
                    { key: 'יוסי', value: '[70, 75, 80]' },
                ]
            },
            { type: 'dict', address: '0xA300', entries: [{ key: 'דני', value: 84.33 }, { key: 'רונית', value: 91.67 }] },
        ],
    },
    {
        lineNumber: 18,
        variables: [
            { name: 'gb', value: 'dict[3]', type: 'dict', address: '0x4F00', pointsTo: '0xA200' },
            { name: 'averages', value: 'dict[3]', type: 'dict', address: '0x4F01', changed: true, scope: 'local', pointsTo: '0xA300' },
            { name: 'name', value: 'יוסי', type: 'str', address: '0x4F02', changed: true, scope: 'local' },
        ],
        output: [],
        description: "איטרציה שלישית: name='יוסי', ממוצע = (70+75+80)/3 = 75.0",
        callStack: ['global', 'get_all_averages()'],
        heapObjects: [
            {
                type: 'dict', address: '0xA200', entries: [
                    { key: 'דני', value: '[85, 90, 78]' },
                    { key: 'רונית', value: '[92, 88, 95]' },
                    { key: 'יוסי', value: '[70, 75, 80]' },
                ]
            },
            { type: 'dict', address: '0xA300', entries: [{ key: 'דני', value: 84.33 }, { key: 'רונית', value: 91.67 }, { key: 'יוסי', value: 75.0 }] },
        ],
    },
    {
        lineNumber: 31,
        variables: [
            { name: 'gb', value: 'dict[3]', type: 'dict', address: '0x4F00', pointsTo: '0xA200' },
        ],
        output: ["ממוצעים: {'דני': 84.33, 'רונית': 91.67, 'יוסי': 75.0}"],
        description: 'הפונקציה החזירה את מילון הממוצעים — מדפיסים',
        callStack: ['global'],
        heapObjects: [
            {
                type: 'dict', address: '0xA200', entries: [
                    { key: 'דני', value: '[85, 90, 78]' },
                    { key: 'רונית', value: '[92, 88, 95]' },
                    { key: 'יוסי', value: '[70, 75, 80]' },
                ]
            },
        ],
    },
    // --- Execution: print('מצטיינים:', get_top_students(gb)) ---
    {
        lineNumber: 32,
        variables: [
            { name: 'gb', value: 'dict[3]', type: 'dict', address: '0x4F00', pointsTo: '0xA200' },
        ],
        output: ["ממוצעים: {'דני': 84.33, 'רונית': 91.67, 'יוסי': 75.0}"],
        description: 'קוראים ל-get_top_students(gb) עם threshold=85 (ברירת מחדל)',
        callStack: ['global', 'get_top_students()'],
        heapObjects: [
            {
                type: 'dict', address: '0xA200', entries: [
                    { key: 'דני', value: '[85, 90, 78]' },
                    { key: 'רונית', value: '[92, 88, 95]' },
                    { key: 'יוסי', value: '[70, 75, 80]' },
                ]
            },
        ],
    },
    {
        lineNumber: 25,
        variables: [
            { name: 'gb', value: 'dict[3]', type: 'dict', address: '0x4F00', pointsTo: '0xA200' },
            { name: 'top', value: 'list[1]', type: 'list', address: '0x4F01', isNew: true, scope: 'local', pointsTo: '0xA400' },
        ],
        output: ["ממוצעים: {'דני': 84.33, 'רונית': 91.67, 'יוסי': 75.0}"],
        description: "עוברים על הסטודנטים: רק רונית (91.67) עוברת את סף 85",
        callStack: ['global', 'get_top_students()'],
        heapObjects: [
            {
                type: 'dict', address: '0xA200', entries: [
                    { key: 'דני', value: '[85, 90, 78]' },
                    { key: 'רונית', value: '[92, 88, 95]' },
                    { key: 'יוסי', value: '[70, 75, 80]' },
                ]
            },
            { type: 'list', address: '0xA400', items: ['רונית'] },
        ],
    },
    {
        lineNumber: 32,
        variables: [
            { name: 'gb', value: 'dict[3]', type: 'dict', address: '0x4F00', pointsTo: '0xA200' },
        ],
        output: ["ממוצעים: {'דני': 84.33, 'רונית': 91.67, 'יוסי': 75.0}", "מצטיינים: ['רונית']"],
        description: "הפונקציה החזירה ['רונית'] — מדפיסים את רשימת המצטיינים",
        callStack: ['global'],
        heapObjects: [
            {
                type: 'dict', address: '0xA200', entries: [
                    { key: 'דני', value: '[85, 90, 78]' },
                    { key: 'רונית', value: '[92, 88, 95]' },
                    { key: 'יוסי', value: '[70, 75, 80]' },
                ]
            },
        ],
    },
];
