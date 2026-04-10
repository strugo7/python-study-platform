import type { SimStepState } from '../curriculum.types';

// Module 4: מנתח נתיבי קבצים - string methods
// Code:
// path = 'user/downloads/data.csv'
// filename = path.split('/')[-1]
// if filename.endswith('.csv'):
//     type = 'Table Data'
// else:
//     type = 'Unknown'
// print(f'שם קובץ: {filename}')
// print(f'סוג: {type}')

export const module4Steps: SimStepState[] = [
    {
        lineNumber: 1,
        variables: [
            { name: 'path', value: 'user/downloads/data.csv', type: 'str', address: '0x4F00', isNew: true },
        ],
        output: [],
        description: 'יוצרים משתנה path עם נתיב הקובץ',
    },
    {
        lineNumber: 3,
        variables: [
            { name: 'path', value: 'user/downloads/data.csv', type: 'str', address: '0x4F00' },
            { name: 'filename', value: 'data.csv', type: 'str', address: '0x4F01', isNew: true },
        ],
        output: [],
        description: "split('/') מפצל את המחרוזת לרשימה ['user','downloads','data.csv'], ו-[-1] לוקח את האחרון",
    },
    {
        lineNumber: 5,
        variables: [
            { name: 'path', value: 'user/downloads/data.csv', type: 'str', address: '0x4F00' },
            { name: 'filename', value: 'data.csv', type: 'str', address: '0x4F01' },
        ],
        output: [],
        description: "בודק: 'data.csv'.endswith('.csv') → אמת! הקובץ מסתיים ב-.csv",
    },
    {
        lineNumber: 6,
        variables: [
            { name: 'path', value: 'user/downloads/data.csv', type: 'str', address: '0x4F00' },
            { name: 'filename', value: 'data.csv', type: 'str', address: '0x4F01' },
            { name: 'type', value: 'Table Data', type: 'str', address: '0x4F02', isNew: true },
        ],
        output: [],
        description: "התנאי אמת — type מקבל 'Table Data'",
    },
    {
        lineNumber: 10,
        variables: [
            { name: 'path', value: 'user/downloads/data.csv', type: 'str', address: '0x4F00' },
            { name: 'filename', value: 'data.csv', type: 'str', address: '0x4F01' },
            { name: 'type', value: 'Table Data', type: 'str', address: '0x4F02' },
        ],
        output: ['שם קובץ: data.csv'],
        description: 'מדפיס את שם הקובץ שחולץ מהנתיב',
    },
    {
        lineNumber: 11,
        variables: [
            { name: 'path', value: 'user/downloads/data.csv', type: 'str', address: '0x4F00' },
            { name: 'filename', value: 'data.csv', type: 'str', address: '0x4F01' },
            { name: 'type', value: 'Table Data', type: 'str', address: '0x4F02' },
        ],
        output: ['שם קובץ: data.csv', 'סוג: Table Data'],
        description: 'מדפיס את סוג הקובץ שזוהה',
    },
];
