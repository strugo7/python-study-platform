import type { SimStepState } from '../curriculum.types';

// Module 2: פירוק מספר לספרות - while loop with %, //
// Code:
// n = 852
// result = 0
// while n > 0:
//     digit = n % 10
//     if digit > 5:
//         result += digit
//     n = n // 10
// print(f'סכום הספרות הגדולות מ-5: {result}')

export const module2Steps: SimStepState[] = [
    {
        lineNumber: 4,
        variables: [
            { name: 'n', value: 852, type: 'int', address: '0x4F00', isNew: true },
        ],
        output: [],
        description: 'יוצרים משתנה n עם הערך 852',
    },
    {
        lineNumber: 5,
        variables: [
            { name: 'n', value: 852, type: 'int', address: '0x4F00' },
            { name: 'result', value: 0, type: 'int', address: '0x4F01', isNew: true },
        ],
        output: [],
        description: 'יוצרים משתנה result עם הערך 0 — כאן נצבור את הסכום',
    },
    // --- Iteration 1: n=852 ---
    {
        lineNumber: 7,
        variables: [
            { name: 'n', value: 852, type: 'int', address: '0x4F00' },
            { name: 'result', value: 0, type: 'int', address: '0x4F01' },
        ],
        output: [],
        description: 'בודק תנאי הלולאה: 852 > 0 → אמת, נכנסים ללולאה',
    },
    {
        lineNumber: 8,
        variables: [
            { name: 'n', value: 852, type: 'int', address: '0x4F00' },
            { name: 'result', value: 0, type: 'int', address: '0x4F01' },
            { name: 'digit', value: 2, type: 'int', address: '0x4F02', isNew: true },
        ],
        output: [],
        description: 'digit = 852 % 10 = 2 — הספרה האחרונה',
    },
    {
        lineNumber: 9,
        variables: [
            { name: 'n', value: 852, type: 'int', address: '0x4F00' },
            { name: 'result', value: 0, type: 'int', address: '0x4F01' },
            { name: 'digit', value: 2, type: 'int', address: '0x4F02' },
        ],
        output: [],
        description: 'בודק תנאי: 2 > 5 → שקר, לא מוסיפים ל-result',
    },
    {
        lineNumber: 11,
        variables: [
            { name: 'n', value: 85, type: 'int', address: '0x4F00', changed: true },
            { name: 'result', value: 0, type: 'int', address: '0x4F01' },
            { name: 'digit', value: 2, type: 'int', address: '0x4F02' },
        ],
        output: [],
        description: 'n = 852 // 10 = 85 — מסירים את הספרה האחרונה',
    },
    // --- Iteration 2: n=85 ---
    {
        lineNumber: 7,
        variables: [
            { name: 'n', value: 85, type: 'int', address: '0x4F00' },
            { name: 'result', value: 0, type: 'int', address: '0x4F01' },
            { name: 'digit', value: 2, type: 'int', address: '0x4F02' },
        ],
        output: [],
        description: 'בודק תנאי הלולאה: 85 > 0 → אמת, ממשיכים',
    },
    {
        lineNumber: 8,
        variables: [
            { name: 'n', value: 85, type: 'int', address: '0x4F00' },
            { name: 'result', value: 0, type: 'int', address: '0x4F01' },
            { name: 'digit', value: 5, type: 'int', address: '0x4F02', changed: true },
        ],
        output: [],
        description: 'digit = 85 % 10 = 5 — הספרה האחרונה',
    },
    {
        lineNumber: 9,
        variables: [
            { name: 'n', value: 85, type: 'int', address: '0x4F00' },
            { name: 'result', value: 0, type: 'int', address: '0x4F01' },
            { name: 'digit', value: 5, type: 'int', address: '0x4F02' },
        ],
        output: [],
        description: 'בודק תנאי: 5 > 5 → שקר, לא מוסיפים (שווה ל-5, לא גדול)',
    },
    {
        lineNumber: 11,
        variables: [
            { name: 'n', value: 8, type: 'int', address: '0x4F00', changed: true },
            { name: 'result', value: 0, type: 'int', address: '0x4F01' },
            { name: 'digit', value: 5, type: 'int', address: '0x4F02' },
        ],
        output: [],
        description: 'n = 85 // 10 = 8 — מסירים את הספרה האחרונה',
    },
    // --- Iteration 3: n=8 ---
    {
        lineNumber: 7,
        variables: [
            { name: 'n', value: 8, type: 'int', address: '0x4F00' },
            { name: 'result', value: 0, type: 'int', address: '0x4F01' },
            { name: 'digit', value: 5, type: 'int', address: '0x4F02' },
        ],
        output: [],
        description: 'בודק תנאי הלולאה: 8 > 0 → אמת, ממשיכים',
    },
    {
        lineNumber: 8,
        variables: [
            { name: 'n', value: 8, type: 'int', address: '0x4F00' },
            { name: 'result', value: 0, type: 'int', address: '0x4F01' },
            { name: 'digit', value: 8, type: 'int', address: '0x4F02', changed: true },
        ],
        output: [],
        description: 'digit = 8 % 10 = 8 — הספרה האחרונה',
    },
    {
        lineNumber: 9,
        variables: [
            { name: 'n', value: 8, type: 'int', address: '0x4F00' },
            { name: 'result', value: 0, type: 'int', address: '0x4F01' },
            { name: 'digit', value: 8, type: 'int', address: '0x4F02' },
        ],
        output: [],
        description: 'בודק תנאי: 8 > 5 → אמת! מוסיפים 8 ל-result',
    },
    {
        lineNumber: 10,
        variables: [
            { name: 'n', value: 8, type: 'int', address: '0x4F00' },
            { name: 'result', value: 8, type: 'int', address: '0x4F01', changed: true },
            { name: 'digit', value: 8, type: 'int', address: '0x4F02' },
        ],
        output: [],
        description: 'result = 0 + 8 = 8',
    },
    {
        lineNumber: 11,
        variables: [
            { name: 'n', value: 0, type: 'int', address: '0x4F00', changed: true },
            { name: 'result', value: 8, type: 'int', address: '0x4F01' },
            { name: 'digit', value: 8, type: 'int', address: '0x4F02' },
        ],
        output: [],
        description: 'n = 8 // 10 = 0 — לא נשארו ספרות',
    },
    // --- Loop ends ---
    {
        lineNumber: 7,
        variables: [
            { name: 'n', value: 0, type: 'int', address: '0x4F00' },
            { name: 'result', value: 8, type: 'int', address: '0x4F01' },
            { name: 'digit', value: 8, type: 'int', address: '0x4F02' },
        ],
        output: [],
        description: 'בודק תנאי הלולאה: 0 > 0 → שקר, יוצאים מהלולאה',
    },
    {
        lineNumber: 13,
        variables: [
            { name: 'n', value: 0, type: 'int', address: '0x4F00' },
            { name: 'result', value: 8, type: 'int', address: '0x4F01' },
            { name: 'digit', value: 8, type: 'int', address: '0x4F02' },
        ],
        output: ['סכום הספרות הגדולות מ-5: 8'],
        description: 'מדפיס את התוצאה: רק הספרה 8 גדולה מ-5, סכום = 8',
    },
];
