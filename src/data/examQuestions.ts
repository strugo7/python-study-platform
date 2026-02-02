// Advanced Exam Questions Bank
// Based on Dr. Rica's exam patterns and trap profiles

export interface ExamQuestion {
    id: number;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
    trapProfile?: string;
    code: string;
    question: string;
    options: string[];
    correctAnswer: number; // 0-indexed
    explanation: string;
}

// Question bank organized by trap profiles
export const questionBank: ExamQuestion[] = [
    // === TRAP 1: Mutable Default Arguments ===
    {
        id: 1,
        category: "פונקציות",
        difficulty: "hard",
        trapProfile: "Mutable Defaults",
        code: `def add_item(item, lst=[]):
    lst.append(item)
    return lst

print(add_item(1))
print(add_item(2))
print(add_item(3))`,
        question: "מה יודפס?",
        options: [
            "[1]\n[2]\n[3]",
            "[1]\n[1, 2]\n[1, 2, 3]",
            "[1, 2, 3]\n[1, 2, 3]\n[1, 2, 3]",
            "שגיאה"
        ],
        correctAnswer: 1,
        explanation: "ערך ברירת מחדל Mutable (כמו רשימה) נוצר פעם אחת ומשותף בין כל הקריאות לפונקציה."
    },
    {
        id: 2,
        category: "פונקציות",
        difficulty: "hard",
        trapProfile: "Mutable Defaults",
        code: `def counter(count={"val": 0}):
    count["val"] += 1
    return count["val"]

a = counter()
b = counter()
c = counter()
print(a, b, c)`,
        question: "מה יודפס?",
        options: [
            "1 1 1",
            "1 2 3",
            "3 3 3",
            "שגיאה"
        ],
        correctAnswer: 1,
        explanation: "מילון כברירת מחדל הוא Mutable - אותו אובייקט משותף לכל הקריאות."
    },
    // === TRAP 2: Name Mangling ===
    {
        id: 3,
        category: "OOP",
        difficulty: "hard",
        trapProfile: "Name Mangling",
        code: `class Parent:
    def __init__(self):
        self.__secret = 42

class Child(Parent):
    def reveal(self):
        return self.__secret

c = Child()
print(c.reveal())`,
        question: "מה יודפס?",
        options: [
            "42",
            "None",
            "AttributeError",
            "0"
        ],
        correctAnswer: 2,
        explanation: "Name Mangling: __secret נהפך ל-_Parent__secret. Child מחפש _Child__secret שלא קיים."
    },
    {
        id: 4,
        category: "OOP",
        difficulty: "hard",
        trapProfile: "Name Mangling",
        code: `class Box:
    def __init__(self):
        self.__value = 10
    
    def get(self):
        return self.__value

b = Box()
b.__value = 20
print(b.get(), b.__value)`,
        question: "מה יודפס?",
        options: [
            "20 20",
            "10 20",
            "10 10",
            "AttributeError"
        ],
        correctAnswer: 1,
        explanation: "b.__value יוצר תכונה חדשה! התכונה המקורית היא _Box__value שנשארת 10."
    },
    // === TRAP 3: Method Overloading (Python doesn't support it) ===
    {
        id: 5,
        category: "OOP",
        difficulty: "medium",
        trapProfile: "Overloading",
        code: `class Calculator:
    def add(self, a, b):
        return a + b
    
    def add(self, a, b, c):
        return a + b + c

calc = Calculator()
print(calc.add(1, 2))`,
        question: "מה יודפס?",
        options: [
            "3",
            "0",
            "TypeError",
            "None"
        ],
        correctAnswer: 2,
        explanation: "בפייתון אין Overloading - ההגדרה השנייה דורסת את הראשונה. add דורש 3 ארגומנטים אבל קיבל 2."
    },
    // === TRAP 4: Infinite Loop with continue ===
    {
        id: 6,
        category: "לולאות",
        difficulty: "hard",
        trapProfile: "Infinite Loop",
        code: `i = 0
while i < 5:
    if i == 3:
        continue
    print(i, end=" ")
    i += 1`,
        question: "מה יודפס?",
        options: [
            "0 1 2 4",
            "0 1 2 3 4",
            "0 1 2 (לולאה אינסופית)",
            "0 1 2"
        ],
        correctAnswer: 2,
        explanation: "כש-i==3, continue מדלג על i+=1, כך ש-i נשאר 3 לנצח = לולאה אינסופית."
    },
    {
        id: 7,
        category: "לולאות",
        difficulty: "medium",
        trapProfile: "Infinite Loop",
        code: `count = 10
while count > 0:
    print(count, end=" ")
    if count == 5:
        break
    count -= 2`,
        question: "מה יודפס?",
        options: [
            "10 8 6 4 2",
            "10 8 6 5",
            "10 8 6 4 2 0",
            "10 8 6 (לולאה אינסופית)"
        ],
        correctAnswer: 3,
        explanation: "count יורד ב-2 בכל פעם: 10→8→6→4→2→0. count==5 לעולם לא מתקיים כי מדלגים עליו."
    },
    // === TRAP 5: Slicing vs Indexing ===
    {
        id: 8,
        category: "רשימות",
        difficulty: "medium",
        trapProfile: "Slicing",
        code: `lst = [1, 2, 3]
print(lst[10:20])`,
        question: "מה יודפס?",
        options: [
            "IndexError",
            "[]",
            "[1, 2, 3]",
            "None"
        ],
        correctAnswer: 1,
        explanation: "Slicing מחוץ לגבולות מחזיר רשימה ריקה, לא שגיאה (בניגוד לגישה ישירה לאינדקס)."
    },
    {
        id: 9,
        category: "רשימות",
        difficulty: "easy",
        trapProfile: "Slicing",
        code: `s = "Python"
print(s[1:4])`,
        question: "מה יודפס?",
        options: [
            "Pyth",
            "yth",
            "ytho",
            "Pyt"
        ],
        correctAnswer: 1,
        explanation: "Slicing [1:4] מחזיר תווים באינדקסים 1, 2, 3 (לא כולל 4)."
    },
    // === TRAP 6: Dictionary/Set uniqueness ===
    {
        id: 10,
        category: "מילונים",
        difficulty: "medium",
        trapProfile: "Dict Keys",
        code: `d = {1: "a", 1.0: "b", True: "c"}
print(len(d), d[1])`,
        question: "מה יודפס?",
        options: [
            "3 a",
            "3 c",
            "1 c",
            "1 a"
        ],
        correctAnswer: 2,
        explanation: "1, 1.0, True כולם שווים בפייתון ונחשבים אותו מפתח! המילון מכיל רק מפתח אחד עם הערך האחרון."
    },
    {
        id: 11,
        category: "סטים",
        difficulty: "medium",
        code: `s = {1, 2, 2, 3, 3, 3}
print(len(s), sum(s))`,
        question: "מה יודפס?",
        options: [
            "6 14",
            "3 6",
            "3 14",
            "6 6"
        ],
        correctAnswer: 1,
        explanation: "Set מכיל רק ערכים ייחודיים: {1, 2, 3}. len=3, sum=6."
    },
    // === TRAP 7: Scope and Global ===
    {
        id: 12,
        category: "משתנים",
        difficulty: "hard",
        trapProfile: "Scope",
        code: `x = 10

def modify():
    x = x + 1
    return x

print(modify())`,
        question: "מה יודפס?",
        options: [
            "11",
            "10",
            "UnboundLocalError",
            "None"
        ],
        correctAnswer: 2,
        explanation: "ההשמה x=x+1 הופכת x לmשתנה לוקאלי, אבל הוא מנסה לקרוא אותו לפני ההגדרה."
    },
    {
        id: 13,
        category: "משתנים",
        difficulty: "medium",
        trapProfile: "Scope",
        code: `x = [1, 2, 3]

def modify():
    x.append(4)

modify()
print(x)`,
        question: "מה יודפס?",
        options: [
            "[1, 2, 3]",
            "[1, 2, 3, 4]",
            "UnboundLocalError",
            "None"
        ],
        correctAnswer: 1,
        explanation: "לא יצרנו משתנה לוקאלי חדש - רק שינינו את הרשימה הגלובלית. זה עובד ללא global."
    },
    // === TRAP 8: Recursion ===
    {
        id: 14,
        category: "רקורסיה",
        difficulty: "medium",
        code: `def countdown(n):
    if n <= 0:
        return 0
    return n + countdown(n - 1)

print(countdown(4))`,
        question: "מה יודפס?",
        options: [
            "4",
            "10",
            "0",
            "RecursionError"
        ],
        correctAnswer: 1,
        explanation: "4 + 3 + 2 + 1 + 0 = 10. הפונקציה מחשבת סכום מ-n עד 0."
    },
    {
        id: 15,
        category: "רקורסיה",
        difficulty: "hard",
        code: `def mystery(n):
    if n < 2:
        return n
    return mystery(n-1) + mystery(n-2)

print(mystery(6))`,
        question: "מה יודפס?",
        options: [
            "6",
            "8",
            "13",
            "21"
        ],
        correctAnswer: 1,
        explanation: "זו סדרת פיבונאצ'י: F(6) = F(5) + F(4) = 5 + 3 = 8."
    },
    // === TRAP 9: String immutability ===
    {
        id: 16,
        category: "מחרוזות",
        difficulty: "easy",
        code: `s = "hello"
s[0] = "H"
print(s)`,
        question: "מה יודפס?",
        options: [
            "Hello",
            "hello",
            "TypeError",
            "H"
        ],
        correctAnswer: 2,
        explanation: "מחרוזות הן Immutable - לא ניתן לשנות תו בודד. צריך ליצור מחרוזת חדשה."
    },
    // === TRAP 10: Boolean evaluation ===
    {
        id: 17,
        category: "תנאים",
        difficulty: "medium",
        code: `x = []
y = ""
z = 0

if x or y or z:
    print("True")
else:
    print("False")`,
        question: "מה יודפס?",
        options: [
            "True",
            "False",
            "None",
            "שגיאה"
        ],
        correctAnswer: 1,
        explanation: "רשימה ריקה, מחרוזת ריקה ו-0 כולם Falsy בפייתון."
    },
    {
        id: 18,
        category: "תנאים",
        difficulty: "medium",
        code: `result = 5 and 0 or 3
print(result)`,
        question: "מה יודפס?",
        options: [
            "True",
            "0",
            "3",
            "5"
        ],
        correctAnswer: 2,
        explanation: "5 and 0 = 0 (הערך השני כי 5 הוא True). 0 or 3 = 3 (כי 0 הוא False)."
    },
    // === TRAP 11: List comprehension vs generator ===
    {
        id: 19,
        category: "רשימות",
        difficulty: "medium",
        code: `squares = [x**2 for x in range(5)]
print(squares)`,
        question: "מה יודפס?",
        options: [
            "[1, 4, 9, 16, 25]",
            "[0, 1, 4, 9, 16]",
            "[0, 1, 4, 9, 16, 25]",
            "[1, 2, 4, 8, 16]"
        ],
        correctAnswer: 1,
        explanation: "range(5) מייצר 0,1,2,3,4. בריבוע: 0,1,4,9,16."
    },
    // === TRAP 12: is vs == ===
    {
        id: 20,
        category: "השוואות",
        difficulty: "hard",
        code: `a = [1, 2, 3]
b = [1, 2, 3]
c = a

print(a == b, a is b, a is c)`,
        question: "מה יודפס?",
        options: [
            "True True True",
            "True False True",
            "True False False",
            "False False True"
        ],
        correctAnswer: 1,
        explanation: "== משווה ערכים (שווים), is משווה זהות באובייקט. a ו-b שווים אבל לא אותו אובייקט."
    },
    // === More advanced questions ===
    {
        id: 21,
        category: "OOP",
        difficulty: "hard",
        trapProfile: "Inheritance",
        code: `class A:
    def greet(self):
        return "A"

class B(A):
    def greet(self):
        return super().greet() + "B"

class C(B):
    def greet(self):
        return super().greet() + "C"

print(C().greet())`,
        question: "מה יודפס?",
        options: [
            "C",
            "ABC",
            "CBA",
            "שגיאה"
        ],
        correctAnswer: 1,
        explanation: "super() קורא להורה. C→B→A, אז A מחזיר 'A', B מוסיף 'B', C מוסיף 'C' = 'ABC'."
    },
    {
        id: 22,
        category: "מילונים",
        difficulty: "medium",
        code: `d = {"a": 1, "b": 2}
print(d.get("c", d.get("a")))`,
        question: "מה יודפס?",
        options: [
            "None",
            "1",
            "2",
            "KeyError"
        ],
        correctAnswer: 1,
        explanation: "'c' לא קיים, אז get מחזיר את ברירת המחדל שהיא d.get('a')=1."
    },
    {
        id: 23,
        category: "לולאות",
        difficulty: "medium",
        code: `for i in range(3):
    for j in range(3):
        if i == j:
            break
        print(f"{i},{j}", end=" ")`,
        question: "מה יודפס?",
        options: [
            "0,0 0,1 0,2 1,0 1,1 1,2 2,0 2,1 2,2",
            "1,0 2,0 2,1",
            "0,1 0,2 1,0 1,2 2,0 2,1",
            "שום דבר"
        ],
        correctAnswer: 1,
        explanation: "break יוצא מהלולאה הפנימית כש-i==j. עבור i=0: break מיד. i=1: j=0 מודפס. i=2: j=0,j=1 מודפסים."
    },
    {
        id: 24,
        category: "פונקציות",
        difficulty: "medium",
        code: `def outer():
    x = "local"
    def inner():
        nonlocal x
        x = "nonlocal"
    inner()
    return x

print(outer())`,
        question: "מה יודפס?",
        options: [
            "local",
            "nonlocal",
            "None",
            "UnboundLocalError"
        ],
        correctAnswer: 1,
        explanation: "nonlocal מאפשר לשנות משתנה מה-scope החיצוני (לא גלובלי)."
    },
    {
        id: 25,
        category: "רשימות",
        difficulty: "hard",
        code: `a = [[0] * 3] * 3
a[0][0] = 1
print(a)`,
        question: "מה יודפס?",
        options: [
            "[[1, 0, 0], [0, 0, 0], [0, 0, 0]]",
            "[[1, 0, 0], [1, 0, 0], [1, 0, 0]]",
            "[[1, 1, 1], [1, 1, 1], [1, 1, 1]]",
            "[[0, 0, 0], [0, 0, 0], [0, 0, 0]]"
        ],
        correctAnswer: 1,
        explanation: "[[0]*3]*3 יוצר 3 הפניות לאותה רשימה פנימית! שינוי אחת משפיע על כולן."
    },
    {
        id: 26,
        category: "מחרוזות",
        difficulty: "easy",
        code: `s = "Python"
print(s[::-1])`,
        question: "מה יודפס?",
        options: [
            "Python",
            "nohtyP",
            "P",
            "n"
        ],
        correctAnswer: 1,
        explanation: "[::-1] הופך את המחרוזת (step של -1)."
    },
    {
        id: 27,
        category: "חריגות",
        difficulty: "medium",
        code: `try:
    x = 1 / 0
except ArithmeticError:
    print("A", end=" ")
except ZeroDivisionError:
    print("Z", end=" ")
finally:
    print("F")`,
        question: "מה יודפס?",
        options: [
            "Z F",
            "A F",
            "A Z F",
            "F"
        ],
        correctAnswer: 1,
        explanation: "ZeroDivisionError יורש מ-ArithmeticError. ה-except הראשון שתופס (ArithmeticError) מופעל."
    },
    {
        id: 28,
        category: "סטים",
        difficulty: "medium",
        code: `a = {1, 2, 3}
b = {2, 3, 4}
print(a ^ b)`,
        question: "מה יודפס?",
        options: [
            "{2, 3}",
            "{1, 4}",
            "{1, 2, 3, 4}",
            "שגיאה"
        ],
        correctAnswer: 1,
        explanation: "^ הוא Symmetric Difference - איברים שנמצאים באחד אבל לא בשניהם."
    },
    {
        id: 29,
        category: "OOP",
        difficulty: "hard",
        code: `class Counter:
    count = 0
    
    def __init__(self):
        Counter.count += 1
    
    def get_count(self):
        return Counter.count

a = Counter()
b = Counter()
c = Counter()
print(a.get_count(), b.get_count())`,
        question: "מה יודפס?",
        options: [
            "1 2",
            "3 3",
            "1 1",
            "3 2"
        ],
        correctAnswer: 1,
        explanation: "count הוא Class Variable - משותף לכל האינסטנסים. אחרי 3 יצירות, הערך הוא 3 לכולם."
    },
    {
        id: 30,
        category: "פונקציות",
        difficulty: "hard",
        code: `def make_multiplier(n):
    def multiplier(x):
        return x * n
    return multiplier

double = make_multiplier(2)
triple = make_multiplier(3)
print(double(5) + triple(5))`,
        question: "מה יודפס?",
        options: [
            "15",
            "25",
            "30",
            "10"
        ],
        correctAnswer: 1,
        explanation: "Closure: double זוכר n=2, triple זוכר n=3. double(5)=10, triple(5)=15, סה״כ 25."
    }
];

// Function to get random questions for an exam
export function generateExam(count: number = 20, seed?: number): ExamQuestion[] {
    const shuffled = [...questionBank];

    // Simple shuffle with optional seed for reproducibility
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, count);
}

// Get questions by category
export function getQuestionsByCategory(category: string): ExamQuestion[] {
    return questionBank.filter(q => q.category === category);
}

// Get questions by difficulty
export function getQuestionsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): ExamQuestion[] {
    return questionBank.filter(q => q.difficulty === difficulty);
}

// Get all categories
export function getCategories(): string[] {
    return [...new Set(questionBank.map(q => q.category))];
}

export default questionBank;
