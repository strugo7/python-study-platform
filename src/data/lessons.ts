export interface Lesson {
    id: string;
    title: string;
    description: string;
    status: "completed" | "in-progress" | "locked";
    imageUrl?: string;
}

export const lessons: Lesson[] = [
    {
        id: "1",
        title: "שיעור 1: בסיס ומשתנים",
        description: "היכרות עם סביבת העבודה, הדפסות, סוגי נתונים ופעולות חשבון בסיסיות.",
        status: "completed",
    },
    {
        id: "2",
        title: "שיעור 2: תנאים ולולאות",
        description: "בניית לוגיקה בעזרת if/else, לולאות for ו-while לביצוע פעולות חוזרות.",
        status: "in-progress",
    },
    {
        id: "3",
        title: "שיעור 3: פונקציות",
        description: "ארגון הקוד ליחידות לוגיות, העברת פרמטרים והחזרת ערכים.",
        status: "locked",
    },
    {
        id: "4",
        title: "שיעור 4: מבני נתונים",
        description: "עבודה עם רשימות, מילונים, טאפלים וסטים לניהול מידע מורכב.",
        status: "locked",
    },
    {
        id: "5",
        title: "שיעור 5: קבצים וחריגות",
        description: "קריאה וכתיבה לקבצים, טיפול בשגיאות באמצעות try/except.",
        status: "locked",
    },
    {
        id: "6",
        title: "שיעור 6: תכנות מונחה עצמים",
        description: "מחלקות, אובייקטים, ירושה ופולימורפיזם בפייתון.",
        status: "locked",
    },
];

export interface LessonContent {
    id: string;
    title: string;
    hebrewTheory: string[];
    codeExamples: {
        code: string[];
        explanation: string;
    }[];
    memoryVisualization?: {
        variables: { name: string; value: string | number; address: string }[];
        description: string;
    };
}

export const lessonContents: Record<string, LessonContent> = {
    "1": {
        id: "1",
        title: "איך עובד משתנה?",
        hebrewTheory: [
            "דמיינו שהזיכרון של המחשב (ה-RAM) הוא כמו מחסן ענק עם מיליוני קופסאות. לכל קופסה יש \"כתובת\" ייחודית משלה.",
            "כאשר פייתון רואה את המספר 10, הוא קודם כל יוצר \"אובייקט\" בזיכרון. הוא מוצא קופסה פנויה ומכניס לתוכה את הערך.",
            "בשלב השני, פייתון יוצר את השם x. השם הזה הוא לא הנתון עצמו, אלא רק \"תגית\" או \"תווית\".",
            "סימן השווה = אומר לפייתון: \"קח את התווית שקראנו לה x, ותדביק אותה על הקופסה שמכילה את הערך 10\".",
            "מעתה והלאה, בכל פעם שנשתמש ב-x בתוכנית שלנו, פייתון ידע ללכת לאותה כתובת בזיכרון ולהוציא משם את המספר 10.",
        ],
        codeExamples: [
            {
                code: ["x = 10", "print(x)"],
                explanation: "יצירת משתנה x עם הערך 10",
            },
        ],
        memoryVisualization: {
            variables: [{ name: "x", value: 10, address: "0x4F5" }],
            description: "מצביע x לכתובת זיכרון המכילה את הערך 10",
        },
    },
    "2": {
        id: "2",
        title: "תנאים ולולאות",
        hebrewTheory: [
            "תנאים מאפשרים לנו להריץ קוד רק אם תנאי מסוים מתקיים.",
            "פקודת if בודקת האם הביטוי שאחריה הוא True או False.",
            "לולאת for מאפשרת לרוץ על רצף של ערכים בצורה אוטומטית.",
            "לולאת while ממשיכה לרוץ כל עוד התנאי שלה מתקיים.",
        ],
        codeExamples: [
            {
                code: ["for i in range(5):", "    print(i)"],
                explanation: "לולאה שמדפיסה 0 עד 4",
            },
        ],
    },
};
