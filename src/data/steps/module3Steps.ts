import type { SimStepState } from '../curriculum.types';

// Module 3: ניהול רשימת קניות - list operations
// Code:
// shopping_list = ['milk', 'bread', 'eggs']
// shopping_list.append('coffee')
// shopping_list.remove('bread')
// shopping_list.sort()
// print(f'רשימה מעודכנת: {shopping_list}')
// print(f'מספר מוצרים: {len(shopping_list)}')

export const module3Steps: SimStepState[] = [
    {
        lineNumber: 1,
        variables: [
            { name: 'shopping_list', value: 'list[3]', type: 'list', address: '0x4F00', isNew: true, pointsTo: '0xA100' },
        ],
        output: [],
        description: 'יוצרים רשימת קניות עם 3 מוצרים — הרשימה נשמרת ב-Heap',
        heapObjects: [
            { type: 'list', items: ['milk', 'bread', 'eggs'], address: '0xA100' },
        ],
    },
    {
        lineNumber: 3,
        variables: [
            { name: 'shopping_list', value: 'list[4]', type: 'list', address: '0x4F00', changed: true, pointsTo: '0xA100' },
        ],
        output: [],
        description: 'append — מוסיפים "coffee" לסוף הרשימה. הרשימה כעת מכילה 4 פריטים',
        heapObjects: [
            { type: 'list', items: ['milk', 'bread', 'eggs', 'coffee'], address: '0xA100' },
        ],
    },
    {
        lineNumber: 5,
        variables: [
            { name: 'shopping_list', value: 'list[3]', type: 'list', address: '0x4F00', changed: true, pointsTo: '0xA100' },
        ],
        output: [],
        description: 'remove — מסירים "bread" מהרשימה. האינדקסים מתעדכנים',
        heapObjects: [
            { type: 'list', items: ['milk', 'eggs', 'coffee'], address: '0xA100' },
        ],
    },
    {
        lineNumber: 7,
        variables: [
            { name: 'shopping_list', value: 'list[3]', type: 'list', address: '0x4F00', changed: true, pointsTo: '0xA100' },
        ],
        output: [],
        description: 'sort — ממיינים את הרשימה בסדר אלפביתי (ABC)',
        heapObjects: [
            { type: 'list', items: ['coffee', 'eggs', 'milk'], address: '0xA100' },
        ],
    },
    {
        lineNumber: 9,
        variables: [
            { name: 'shopping_list', value: 'list[3]', type: 'list', address: '0x4F00', pointsTo: '0xA100' },
        ],
        output: ["רשימה מעודכנת: ['coffee', 'eggs', 'milk']"],
        description: 'מדפיס את הרשימה הממוינת',
        heapObjects: [
            { type: 'list', items: ['coffee', 'eggs', 'milk'], address: '0xA100' },
        ],
    },
    {
        lineNumber: 10,
        variables: [
            { name: 'shopping_list', value: 'list[3]', type: 'list', address: '0x4F00', pointsTo: '0xA100' },
        ],
        output: ["רשימה מעודכנת: ['coffee', 'eggs', 'milk']", 'מספר מוצרים: 3'],
        description: 'len() מחזיר את מספר האיברים ברשימה: 3',
        heapObjects: [
            { type: 'list', items: ['coffee', 'eggs', 'milk'], address: '0xA100' },
        ],
    },
];
