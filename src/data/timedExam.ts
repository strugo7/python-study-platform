// Comprehensive Timed Final Exam - 20 challenging questions covering all topics
// 2 hours time limit, no explanations until submission

export interface TimedExamQuestion {
    id: number;
    question: string;
    code: string;
    options: string[];
    correct: number;
    explanation: string;
}

export const timedExam: TimedExamQuestion[] = [
    {
        id: 1,
        question: "מה יודפס בקוד הבא?",
        code: `class Counter:
    total = 0
    
    def __init__(self, name):
        self.name = name
        self.count = 0
        Counter.total += 1
    
    def increment(self):
        self.count += 1
        Counter.total += 1
        return self

c1 = Counter("A")
c2 = Counter("B")
c1.increment().increment()
c2.increment()
print(f"{c1.count}, {c2.count}, {Counter.total}")`,
        options: ["2, 1, 3", "2, 1, 5", "3, 2, 5", "2, 1, 6"],
        correct: 1,
        explanation: "נוצרים 2 אובייקטים (total=2), c1 עושה increment פעמיים (count=2, total=4), c2 עושה increment פעם אחת (count=1, total=5). תוצאה: 2, 1, 5."
    },
    {
        id: 2,
        question: "בחרו את הטענה הלא נכונה העוסקת ברשימות (lists) בפייתון:",
        code: `# שאלה תיאורטית על רשימות`,
        options: [
            "ניתן להוסיף איברים לסוף הרשימה באמצעות append",
            "ניתן למחוק איברים לפי ערך באמצעות remove",
            "ניתן לגשת לאיברים באמצעות אינדקס שלילי",
            "ניתן לשנות את הגודל של הרשימה רק באמצעות append ו-remove"
        ],
        correct: 3,
        explanation: "תשובה ד' לא נכונה. ניתן לשנות גודל רשימה גם באמצעות: insert, extend, pop, del, clear, ו-slicing assignment."
    },
    {
        id: 3,
        question: "מה יודפס?",
        code: `from functools import reduce

data = [{'name': 'a', 'val': 3}, {'name': 'b', 'val': 7}, {'name': 'c', 'val': 2}]
result = reduce(
    lambda acc, x: acc if acc['val'] > x['val'] else x,
    data
)
print(result['name'])`,
        options: ["a", "b", "c", "שגיאה"],
        correct: 1,
        explanation: "reduce משווה בין מילונים לפי val ושומר את הגדול ביותר. b עם val=7 הוא הגדול ביותר, לכן מודפס 'b'."
    },
    {
        id: 4,
        question: "מה יודפס?",
        code: `class A:
    def __init__(self):
        self.x = 1
    
    def __add__(self, other):
        result = A()
        result.x = self.x + other.x
        return result
    
    def __str__(self):
        return str(self.x)
    
    def __repr__(self):
        return f"A({self.x})"

a = A()
a.x = 5
b = A()
b.x = 3
print([a + b])`,
        options: ["[8]", "[A(8)]", "8", "[A object]"],
        correct: 1,
        explanation: "כאשר מדפיסים רשימה, פייתון משתמש ב-__repr__ של האיברים. a+b יוצר A חדש עם x=8, ו-__repr__ מחזיר 'A(8)'."
    },
    {
        id: 5,
        question: "מה יודפס?",
        code: `def process(items):
    result = []
    for i, item in enumerate(items):
        if i % 2 == 0:
            result.append(item.upper())
        else:
            result.append(item.lower())
    return "-".join(result)

words = ["Hello", "WORLD", "Python", "CODE"]
print(process(words))`,
        options: ["HELLO-world-PYTHON-code", "hello-WORLD-python-CODE", "Hello-world-Python-code", "HELLO-WORLD-PYTHON-CODE"],
        correct: 0,
        explanation: "אינדקס 0,2 (זוגי) → upper(), אינדקס 1,3 (אי-זוגי) → lower(). תוצאה: HELLO-world-PYTHON-code."
    },
    {
        id: 6,
        question: "מה יודפס?",
        code: `try:
    try:
        x = int("abc")
    except ValueError:
        print("A", end=" ")
        raise TypeError("converted")
    except TypeError:
        print("B", end=" ")
except TypeError:
    print("C", end=" ")
finally:
    print("D")`,
        options: ["A B D", "A C D", "A D", "B C D"],
        correct: 1,
        explanation: "ValueError נתפס, מודפס A, נזרק TypeError. ה-except TypeError הפנימי לא תופס כי הוא באותו try. ה-except החיצוני תופס. מודפס A C D."
    },
    {
        id: 7,
        question: "מה יודפס?",
        code: `matrix = [[i*j for j in range(1, 4)] for i in range(1, 4)]
result = [row[i] for i, row in enumerate(matrix)]
print(result)`,
        options: ["[1, 2, 3]", "[1, 4, 9]", "[3, 6, 9]", "[1, 1, 1]"],
        correct: 1,
        explanation: "matrix = [[1,2,3], [2,4,6], [3,6,9]]. result לוקח row[0] מ-row0, row[1] מ-row1, row[2] מ-row2 = [1, 4, 9] (האלכסון)."
    },
    {
        id: 8,
        question: "בחרו את הטענה הלא נכונה העוסקת במילונים (dictionaries) בפייתון:",
        code: `# שאלה תיאורטית על מילונים`,
        options: [
            "מפתחות במילון חייבים להיות ייחודיים",
            "ניתן להשתמש ברשימה כמפתח במילון",
            "ניתן לקבל ערך ברירת מחדל באמצעות המתודה get",
            "ניתן לעבור על המפתחות והערכים באמצעות items"
        ],
        correct: 1,
        explanation: "תשובה ב' לא נכונה. רשימות הן mutable ולכן לא hashable, ולא ניתן להשתמש בהן כמפתחות במילון. רק טיפוסים immutable (כמו tuple, str, int) יכולים לשמש כמפתחות."
    },
    {
        id: 9,
        question: "בחרו את הטענה הנכונה העוסקת בקבצים (files) בפייתון:",
        code: `# שאלה תיאורטית על קבצים`,
        options: [
            "פתיחת קובץ במצב 'w' תמחק את תוכן הקובץ הקיים",
            "פתיחת קובץ במצב 'r' תיצור קובץ חדש אם לא קיים",
            "אין צורך לסגור קובצים אף פעם בפייתון",
            "המתודה readline קוראת את כל הקובץ לזיכרון"
        ],
        correct: 0,
        explanation: "תשובה א' נכונה. מצב 'w' (write) מוחק את תוכן הקובץ הקיים ומתחיל מחדש. 'r' זורק שגיאה אם הקובץ לא קיים (לא יוצר חדש). readline קוראת שורה אחת בלבד."
    },
    {
        id: 10,
        question: "מה יודפס?",
        code: `d = {}
keys = ['a', 'b', 'a', 'c', 'b', 'a']
for i, k in enumerate(keys):
    d[k] = d.get(k, [])
    d[k].append(i)

print(sorted(d['a']))`,
        options: ["[0]", "[0, 2, 5]", "[5]", "[0, 2]"],
        correct: 1,
        explanation: "'a' מופיע באינדקסים 0, 2, 5. d.get מחזיר רשימה קיימת או יוצר חדשה, ומוסיפים את האינדקס."
    },
    {
        id: 11,
        question: "מה יודפס?",
        code: `class Stack:
    def __init__(self):
        self._items = []
    
    def push(self, item):
        self._items.append(item)
        return self
    
    def pop(self):
        return self._items.pop() if self._items else None
    
    def __len__(self):
        return len(self._items)

s = Stack()
s.push(1).push(2).push(3)
s.pop()
print(len(s), s.pop())`,
        options: ["3 3", "2 2", "2 3", "1 2"],
        correct: 1,
        explanation: "push מחזיר self לכן אפשר לשרשר. אחרי push(1,2,3) יש 3 איברים. pop() מסיר 3. len=2, pop() מסיר ומחזיר 2."
    },
    {
        id: 12,
        question: "מה יודפס?",
        code: `nums = [1, 2, 3, 4, 5]
result = list(filter(lambda x: x > 2, map(lambda x: x ** 2, nums)))
print(result)`,
        options: ["[9, 16, 25]", "[4, 9, 16, 25]", "[1, 4, 9, 16, 25]", "[3, 4, 5]"],
        correct: 0,
        explanation: "map מעלה בריבוע: [1,4,9,16,25]. filter משאיר רק >2: [9,16,25] (4 לא עובר כי 4>2 אבל סינון על התוצאה)."
    },
    {
        id: 13,
        question: "מה יודפס?",
        code: `class Parent:
    def greet(self):
        return self.get_name()
    
    def get_name(self):
        return "Parent"

class Child(Parent):
    def get_name(self):
        return "Child"

c = Child()
print(c.greet())`,
        options: ["Parent", "Child", "None", "שגיאה"],
        correct: 1,
        explanation: "זה פולימורפיזם. c.greet() קורא ל-self.get_name(). כי c הוא Child, נקראת get_name של Child שמחזירה 'Child'."
    },
    {
        id: 14,
        question: "מה יודפס?",
        code: `def write_and_count(filename, lines):
    with open(filename, "w") as f:
        for line in lines:
            f.write(line + "\\n")
    with open(filename, "r") as f:
        return len(f.readlines())

# Unit Test
def test_write_and_count():
    result = write_and_count("test.txt", ["a", "b", "c"])
    assert result == 3
    print("PASS")

test_write_and_count()`,
        options: ["PASS", "AssertionError", "3", "FileNotFoundError"],
        correct: 0,
        explanation: "הפונקציה כותבת 3 שורות לקובץ, ואז קוראת אותן וסופרת. readlines() מחזירה רשימה של 3 שורות, len=3. assert 3==3 מצליח, מודפס 'PASS'."
    },
    {
        id: 15,
        question: "מה יודפס?",
        code: `data = [
    ("apple", 3),
    ("banana", 1),
    ("cherry", 2)
]

sorted_data = sorted(data, key=lambda x: (-x[1], x[0]))
print([item[0] for item in sorted_data])`,
        options: ["['apple', 'cherry', 'banana']", "['banana', 'cherry', 'apple']", "['apple', 'banana', 'cherry']", "['cherry', 'banana', 'apple']"],
        correct: 0,
        explanation: "מיון לפי -x[1] (יורד לפי מספר), ואז x[0] (עולה לפי שם). apple(3), cherry(2), banana(1)."
    },
    {
        id: 16,
        question: "בחרו את הטענה הנכונה העוסקת ב-Unit Testing בפייתון:",
        code: `# שאלה תיאורטית על בדיקות`,
        options: [
            "שם קובץ בדיקה חייב להתחיל ב-test_ כדי ש-pytest יזהה אותו",
            "pytest לא תומך בשימוש ב-assert",
            "לא ניתן לבדוק פונקציות שזורקות Exceptions",
            "חייבים להשתמש ב-unittest, pytest לא נתמך"
        ],
        correct: 0,
        explanation: "תשובה א' נכונה. pytest מזהה אוטומטית קבצים לפי הקונבנציה test_*.py או *_test.py, ושמות פונקציות שמתחילות ב-test_."
    },
    {
        id: 17,
        question: "מה יודפס?",
        code: `def func(*args, **kwargs):
    result = sum(args)
    for v in kwargs.values():
        result *= v
    return result

print(func(1, 2, 3, x=2, y=3))`,
        options: ["6", "12", "36", "11"],
        correct: 2,
        explanation: "args=(1,2,3), sum=6. kwargs={'x':2, 'y':3}. 6*2=12, 12*3=36."
    },
    {
        id: 18,
        question: "בחרו את הטענה הנכונה העוסקת ב-tuples בפייתון:",
        code: `# שאלה תיאורטית על tuples`,
        options: [
            "tuple הוא immutable ולכן לא ניתן לשנות את ערכיו לאחר יצירה",
            "ניתן להוסיף איברים ל-tuple באמצעות append",
            "tuple לא יכול להכיל טיפוסים שונים",
            "לא ניתן לגשת לאיברי tuple באמצעות אינדקס"
        ],
        correct: 0,
        explanation: "תשובה א' נכונה. tuple הוא immutable - לא ניתן לשנות, להוסיף או להסיר איברים. אפשר לגשת באינדקס ו-tuple יכול להכיל טיפוסים שונים."
    },
    {
        id: 19,
        question: "מה יודפס?",
        code: `sets = [{1, 2}, {2, 3}, {3, 4}]
result = sets[0]
for s in sets[1:]:
    result = result ^ s
print(sorted(result))`,
        options: ["[1, 4]", "[2, 3]", "[1, 2, 3, 4]", "[]"],
        correct: 0,
        explanation: "^ הוא symmetric difference. {1,2}^{2,3}={1,3}. {1,3}^{3,4}={1,4}."
    },
    {
        id: 20,
        question: "בחרו את הטענה הנכונה העוסקת ב-sets בפייתון:",
        code: `# שאלה תיאורטית על sets`,
        options: [
            "set לא יכול להכיל איברים כפולים",
            "ניתן להגדיר set בתוך set",
            "set שומר על סדר ההכנסה של האיברים",
            "ניתן לגשת לאיברי set באמצעות אינדקס"
        ],
        correct: 0,
        explanation: "תשובה א' נכונה. set מוסיר כפילויות אוטומטית. לא ניתן להכניס set בתוך set (כי set הוא mutable), אין סדר מובטח, ואין גישה באינדקס."
    }
];

// Shuffle function for answers
export function shuffleExamAnswers(questions: TimedExamQuestion[]): { questions: TimedExamQuestion[], answerMappings: Map<number, number[]> } {
    const answerMappings = new Map<number, number[]>();

    const shuffledQuestions = questions.map(q => {
        const indices = [0, 1, 2, 3];
        // Fisher-Yates shuffle
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }

        answerMappings.set(q.id, indices);

        const newCorrect = indices.indexOf(q.correct);
        const shuffledOptions = indices.map(i => q.options[i]);

        return {
            ...q,
            options: shuffledOptions,
            correct: newCorrect
        };
    });

    return { questions: shuffledQuestions, answerMappings };
}

export const EXAM_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours
