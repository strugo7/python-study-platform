export interface Question {
    id: string;
    questionText: string;
    codeSnippet?: string[];
    options: {
        id: string;
        label: string;
        text: string;
    }[];
    correctAnswer: string;
    explanation: string;
    topic: string;
    relatedLesson?: string;
}

export const questions: Question[] = [
    {
        id: "1",
        topic: "משתנים וזיכרון",
        relatedLesson: "1",
        questionText: "מה יהיה הפלט של הקוד הבא?",
        codeSnippet: [
            "x = 5",
            "y = x",
            "x = 10",
            "print(y)",
        ],
        options: [
            { id: "a", label: "א", text: "5" },
            { id: "b", label: "ב", text: "10" },
            { id: "c", label: "ג", text: "15" },
            { id: "d", label: "ד", text: "Error" },
        ],
        correctAnswer: "a",
        explanation: "התשובה היא 5 מכיוון ש-y מקבל את הערך של x בזמן ההשמה (5). כאשר x משתנה ל-10 אחר כך, זה לא משפיע על y כי מספרים הם Immutable.",
    },
    {
        id: "2",
        topic: "רשימות (Lists)",
        relatedLesson: "4",
        questionText: "מה יהיה הפלט של הקוד הבא ב-Python? שים לב לאופן שבו רשימות מועברות בזיכרון והשפעתן על המשתנים הגלובליים.",
        codeSnippet: [
            "def update_list(lst):",
            "    lst.append(4)",
            "",
            "my_list = [1, 2, 3]",
            "update_list(my_list)",
            "print(my_list)",
        ],
        options: [
            { id: "a", label: "א", text: "[1, 2, 3]" },
            { id: "b", label: "ב", text: "[1, 2, 3, 4]" },
            { id: "c", label: "ג", text: "None" },
            { id: "d", label: "ד", text: "Error: Name 'lst' is not defined" },
        ],
        correctAnswer: "b",
        explanation: "רשימות (Lists) ב-Python הן אובייקטים מסוג Mutable (ניתנים לשינוי). כאשר מעבירים רשימה לפונקציה, היא מועברת כהפניה (Reference), ולכן כל שינוי שמתבצע בתוך הפונקציה משפיע על הרשימה המקורית בזיכרון.",
    },
    {
        id: "3",
        topic: "לולאות",
        relatedLesson: "2",
        questionText: "מה יהיה הפלט של הקוד הבא?",
        codeSnippet: [
            "result = 0",
            "for i in range(1, 4):",
            "    result += i",
            "print(result)",
        ],
        options: [
            { id: "a", label: "א", text: "6" },
            { id: "b", label: "ב", text: "10" },
            { id: "c", label: "ג", text: "3" },
            { id: "d", label: "ד", text: "4" },
        ],
        correctAnswer: "a",
        explanation: "range(1, 4) מייצר את הערכים 1, 2, 3. הלולאה מחברת אותם: 1 + 2 + 3 = 6.",
    },
    {
        id: "4",
        topic: "מחרוזות",
        relatedLesson: "1",
        questionText: "מה יהיה הפלט של הקוד הבא?",
        codeSnippet: [
            "s = 'Python'",
            "print(s[1:4])",
        ],
        options: [
            { id: "a", label: "א", text: "Pyt" },
            { id: "b", label: "ב", text: "yth" },
            { id: "c", label: "ג", text: "ytho" },
            { id: "d", label: "ד", text: "hon" },
        ],
        correctAnswer: "b",
        explanation: "חיתוך מחרוזות (Slicing) בפייתון: s[1:4] לוקח את התווים מאינדקס 1 (כולל) עד אינדקס 4 (לא כולל). התווים באינדקסים 1, 2, 3 הם 'y', 't', 'h'.",
    },
    {
        id: "5",
        topic: "פונקציות",
        relatedLesson: "3",
        questionText: "מה יהיה הפלט של הקוד הבא?",
        codeSnippet: [
            "def greet(name='Guest'):",
            "    return f'Hello, {name}!'",
            "",
            "print(greet())",
        ],
        options: [
            { id: "a", label: "א", text: "Hello, name!" },
            { id: "b", label: "ב", text: "Hello, Guest!" },
            { id: "c", label: "ג", text: "Error" },
            { id: "d", label: "ד", text: "None" },
        ],
        correctAnswer: "b",
        explanation: "כאשר לא מעבירים ארגומנט לפונקציה, הפרמטר name מקבל את ערך ברירת המחדל שלו: 'Guest'.",
    },
];
