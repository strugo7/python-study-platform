// Final Exams - 3 comprehensive exams with 60 unique questions
// Based on Dr. Rica's exact exam patterns

export interface FinalExamQuestion {
    id: number;
    question: string;
    code?: string;
    options: string[];
    correct: number; // 0-indexed
    explanation: string;
}

export interface FinalExam {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    questions: FinalExamQuestion[];
}

export const finalExams: Record<string, FinalExam> = {
    exam1: {
        id: "exam1",
        title: "מבחן מסכם 1",
        description: "שאלות על יסודות, פונקציות, מילונים, OOP ו-Scope",
        difficulty: "גבוהה",
        questions: [
            { id: 1, question: "בחרו את הטענה המדויקת ביותר העוסקת בקטע הקוד הבא:", code: `def func(word, sep=","):\n    count = 0\n    for char in word:\n        count += 1\n    for char in word:\n        if char == sep:\n            count += 1\n    return count\n\nprint(func("ab,cd,ef,gh", ","))`, options: ["הפלט יהיה 11", "הפלט יהיה 14", "הפלט יהיה 3", "הפלט יהיה 8"], correct: 1, explanation: "הלולאה הראשונה סופרת את כל התווים (11). הלולאה השנייה מוסיפה 1 לכל פסיק (3 פסיקים). סה\"כ 11+3=14." },
            { id: 2, question: "בחרו את הטענה המדויקת ביותר:", code: `sentence = "I am a cat"\nwords = sentence.split()\nd = {}\nfor word in words:\n    d[word] = len(word)\nfor key in d:\n    print(key * d[key])`, options: ["יודפס I\\nam\\na\\ncatcatcat", "יודפס I\\namam\\na\\ncatcatcat", "תהיה שגיאה כי לא ניתן להכפיל מחרוזת במספר", "יודפס IIII\\namam\\na\\ncatcatcat"], correct: 1, explanation: "המילון יכיל: {'I': 1, 'am': 2, 'a': 1, 'cat': 3}. עבור כל מפתח מכפילים את המחרוזת באורכה." },
            { id: 3, question: "בחרו את הטענה המדויקת ביותר:", code: `import turtle\nt = turtle.Turtle\nfor i in range(4):\n    t.forward(100)\n    t.right(90)`, options: ["הקוד תקין ויודפס ריבוע", "צריך להוסיף turtle.done() כדי שיודפס ריבוע", "אחרי תיקון שורה אחת יודפס ריבוע", "צריך לתקן שתי שורות"], correct: 2, explanation: "הבעיה היחידה היא בשורה 2: צריך turtle.Turtle() עם סוגריים כדי ליצור אובייקט." },
            { id: 4, question: "בחרו את הטענה המדויקת ביותר:", code: `name = input("Enter your name: ")\nage = input("Enter your age: ")\nprint("Next year you will be", age + 1)\nprint("Hello", name.capitalize())`, options: ["יש לתקן שתי שורות קוד", "יש לתקן שורה אחת בלבד", "הקוד תקין לחלוטין", "יש להמיר age ל-int ולהפעיל upper"], correct: 1, explanation: "הבעיה היחידה: age הוא string, וצריך int(age) + 1. capitalize תקין." },
            { id: 5, question: "בחרו את הטענה המדויקת ביותר:", code: `import random\n\nclass Weather:\n    __forecasts = ["Sunny", "Rainy", "Cloudy"]\n    \n    def get_forecast(self):\n        return random.choice(Weather.__forecasts)`, options: ["בכל ריצה נקבל אותה תחזית", "בכל ריצה נקבל תחזית אחרת", "חסרה מתודת main", "המחלקה מכילה משתנה מחלקה פרטי אחד"], correct: 3, explanation: "__forecasts הוא משתנה מחלקה פרטי (private class variable) בגלל שני הקווים התחתונים." },
            { id: 6, question: "הניחו ש-d מילון חוקי. אילו שורות עלולות לגרום לשגיאה?", code: `1. x = d.keys()\n2. x = d.values()\n3. x = d[5]\n4. x = d.get(5)`, options: ["שורה 4", "שורות 2 ו-4", "שורה 3", "שורות 1 או 3"], correct: 2, explanation: "d[5] זורקת KeyError אם המפתח 5 לא קיים. d.get(5) מחזירה None בבטחה." },
            { id: 7, question: "אילו שורות לעולם לא יגרמו לשגיאה?", code: `1. x = int("123abc")\n2. x = str(123)\n3. x = float("3.14")\n4. x = int(3.99)`, options: ["שורות 2 ו-3", "שורות 1 ו-2", "שורות 2 ו-4", "שורה 2 בלבד"], correct: 2, explanation: "str(123) תמיד עובד. int(3.99) תמיד עובד (קוצץ ל-3). int('123abc') נכשל." },
            { id: 8, question: "בחרו את הטענה המדויקת ביותר:", code: `def func():\n    x = 0\n    def inner():\n        nonlocal x\n        x += 1\n        return x\n    x = inner()\n    x = inner()\n    return x\n\nprint(func())`, options: ["שורה 9 מיותרת", "שורה 4 מיותרת", "יודפס 2", "יודפס 0"], correct: 2, explanation: "inner() מגדיל את x ומחזיר אותו. קריאה ראשונה: x=0→1. קריאה שנייה: x=1→2." },
            { id: 9, question: "מה יודפס?", code: `try:\n    print("n")\n    x = 5 / 0\nexcept ZeroDivisionError:\n    print("Zero")\nexcept KeyError:\n    print("Key")\nexcept:\n    print("error")`, options: ["n\\nerror", "n\\nZero", "n\\nZero\\nKey\\nerror", "Zero"], correct: 1, explanation: "מודפס 'n', אז נזרקת ZeroDivisionError שנתפסת. יודפס n\\nZero." },
            { id: 10, question: "בחרו את הטענה המדויקת ביותר:", code: `class Person:\n    def __init__(self, name="Unknown"):\n        self.name = name\n\np1 = Person()\np2 = Person("Alice")\nprint(p1.name)\nprint(p2.name)`, options: ["התוכנית תקרוס", "יודפס Unknown\\nAlice", "צריך להגדיר המחלקה בקובץ נפרד", "חסרים setters"], correct: 1, explanation: "ברירת מחדל לפרמטר name מאפשרת שימוש ללא ארגומנטים או עם." },
            { id: 11, question: "מה יודפס?", code: `message = "Hello"\n\ndef greet():\n    message = "Goodbye"\n    print(message)\n\nprint(message)\ngreet()`, options: ["Hello\\nGoodbye", "Goodbye\\nHello", "שגיאה", "Hello\\nHello"], correct: 0, explanation: "print(message) מדפיס Hello (גלובלי). greet() יוצר משתנה מקומי 'Goodbye'." },
            { id: 12, question: "מה יודפס?", code: `i = 0\nwhile i < 20:\n    i += 1\n    if i == 7:\n        continue\n    if i % 2 == 0:\n        continue\n    print(i, end=" ")`, options: ["לולאה אינסופית", "כל האי-זוגיים מ-1 עד 19 חוץ מ-7", "שגיאת זמן ריצה", "1 3 5 9 11 13 15 17 19"], correct: 3, explanation: "מודפסים מספרים אי-זוגיים מ-1 עד 19, חוץ מ-7 (שמדולג עליו)." },
            { id: 13, question: "בחרו את הטענה הנכונה:", code: `lst = [1, 5, 9, 13, 17]\nprint(lst[::2])\nprint(lst[1::2])\nprint(lst[::-1])\nprint(lst[-1::-2])`, options: ["שורה 2 מדפיסה [1, 9, 17]", "שורה 3 מדפיסה [5, 13]", "שורה 4 מדפיסה [17, 13, 9, 5, 1]", "שורה 5 מדפיסה [17, 9, 1]"], correct: 3, explanation: "lst[-1::-2] מתחיל מהסוף ועובר בקפיצות של 2 אחורה: [17, 9, 1]." },
            { id: 14, question: "מה יודפס אם הקובץ data.txt לא קיים?", code: `try:\n    f = open("data.txt", "r")\n    content = f.read()\n    print("Good")\nexcept FileNotFoundError:\n    print("Error")\nexcept:\n    print("Oops")\nfinally:\n    print("Done")`, options: ["Oops\\nGood", "Error\\nDone", "Oops\\nError", "Good\\nDone"], correct: 1, explanation: "FileNotFoundError נתפס, מודפס 'Error'. finally תמיד רץ, מודפס 'Done'." },
            { id: 15, question: "מה יודפס?", code: `class Student:\n    def __init__(self, name, inst):\n        self.name = name\n        self.inst = inst\n    def __str__(self):\n        return f"{self.name} at {self.inst}"\n\nclass Employee:\n    def __init__(self, name, company):\n        self.name = name\n        self.company = company\n    def __str__(self):\n        return f"{self.name} at {self.company}"\n\npeople = [Student("Alice", "TAU"), Employee("Bob", "Apple")]\nprint(people[1])`, options: ["Alice at TAU", "Bob at Apple", "שגיאת אינדקס", "Employee object"], correct: 1, explanation: "people[1] הוא האובייקט Employee. __str__ מחזיר 'Bob at Apple'." },
            { id: 16, question: "בחרו את הטענה הלא נכונה על חריגות:", options: ["חייבים תמיד להוסיף בלוק finally", "לא חייבים להוסיף בלוק else", "ניתן לקנן try-except אחד בתוך השני", "אין הגבלה על כמות בלוקי except"], correct: 0, explanation: "finally הוא אופציונלי. אפשר try-except בלי finally." },
            { id: 17, question: "בחרו את הטענה הנכונה על מודולים:", options: ["ניתן לשנות את שם המודול שמייבאים (import X as Y)", "כל קובץ יכול לשמש כמודול גם בלי .py", "ייבוא כפול של מודול גורם לשגיאה", "ייבוא מודול דורס משתנים גלובליים"], correct: 0, explanation: "import X as Y מאפשר לתת alias למודול." },
            { id: 18, question: "בחרו את הטענה הנכונה על Python:", options: ["ניתן להריץ רק שורות נבחרות מקובץ", "קיימות שגיאות קומפילציה בשפה", "לא קיימים טיפוסים שונים בשפה", "חייבים main כדי להריץ"], correct: 0, explanation: "ב-IDE ניתן לסמן ולהריץ רק קטעי קוד נבחרים." },
            { id: 19, question: "בחרו את הטענה הנכונה על sets:", options: ["כל התשובות לא נכונות", "ניתן להגדיר set בתוך set", "add מוסיף את כל האיברים של קבוצה אחרת", "set הוא immutable"], correct: 0, explanation: "set הוא mutable. לא ניתן להכניס set בתוך set (unhashable). add מוסיף איבר אחד." },
            { id: 20, question: "בחרו את הטענה הלא נכונה על OOP:", options: ["ניתן לבצע העמסת בנאים (overloading)", "ניתן ליצור מחלקה ללא בנאי מפורש", "מחלקה יכולה לרשת מ-0 או יותר אבות", "אף תשובה לא נכונה"], correct: 0, explanation: "בפייתון אין constructor overloading כמו בג'אווה. אפשר להשתמש בערכי ברירת מחדל." }
        ]
    },
    exam2: {
        id: "exam2",
        title: "מבחן מסכם 2",
        description: "שאלות על Lambda, Comprehensions, Map/Filter/Reduce ו-Unit Testing",
        difficulty: "גבוהה",
        questions: [
            { id: 1, question: "מה יודפס?", code: `nums = [1, 2, 3, 4, 5]\nresult = list(filter(lambda x: x % 2 == 0, nums))\nprint(result)`, options: ["[1, 3, 5]", "[2, 4]", "[False, True, False, True, False]", "filter object"], correct: 1, explanation: "filter עם lambda x: x % 2 == 0 מחזיר רק מספרים זוגיים: [2, 4]." },
            { id: 2, question: "מה יודפס?", code: `from functools import reduce\nnums = [1, 2, 3, 4]\nresult = reduce(lambda x, y: x * y, nums)\nprint(result)`, options: ["10", "24", "[1, 2, 6, 24]", "4"], correct: 1, explanation: "reduce מכפיל: 1*2=2, 2*3=6, 6*4=24." },
            { id: 3, question: "מה יודפס?", code: `squares = [x**2 for x in range(5)]\nprint(squares)`, options: ["[1, 4, 9, 16, 25]", "[0, 1, 4, 9, 16]", "[0, 2, 4, 6, 8]", "range object"], correct: 1, explanation: "range(5) הוא 0,1,2,3,4. העלאה בריבוע: [0, 1, 4, 9, 16]." },
            { id: 4, question: "מה יודפס?", code: `d = {x: x**2 for x in range(3)}\nprint(d)`, options: ["{1: 1, 2: 4, 3: 9}", "{0: 0, 1: 1, 2: 4}", "[0, 1, 4]", "SyntaxError"], correct: 1, explanation: "Dictionary comprehension עם range(3): {0: 0, 1: 1, 2: 4}." },
            { id: 5, question: "מה יודפס?", code: `s = {x for x in [1, 2, 2, 3, 3, 3]}\nprint(s)`, options: ["{1, 2, 2, 3, 3, 3}", "{1, 2, 3}", "[1, 2, 3]", "6"], correct: 1, explanation: "Set comprehension מסיר כפילויות: {1, 2, 3}." },
            { id: 6, question: "מה יודפס?", code: `f = lambda x, y=10: x + y\nprint(f(5))`, options: ["5", "15", "TypeError", "10"], correct: 1, explanation: "y=10 ברירת מחדל. f(5) מחשב 5+10=15." },
            { id: 7, question: "מה יודפס?", code: `nums = [3, 1, 4, 1, 5]\nsorted_nums = sorted(nums, key=lambda x: -x)\nprint(sorted_nums)`, options: ["[1, 1, 3, 4, 5]", "[5, 4, 3, 1, 1]", "[-5, -4, -3, -1, -1]", "[3, 1, 4, 1, 5]"], correct: 1, explanation: "key=lambda x: -x ממיין בסדר יורד: [5, 4, 3, 1, 1]." },
            { id: 8, question: "מה יודפס?", code: `words = ["ab", "abc", "a"]\nresult = max(words, key=len)\nprint(result)`, options: ["a", "ab", "abc", "3"], correct: 2, explanation: "max עם key=len מחזיר את המחרוזת הארוכה ביותר: 'abc'." },
            { id: 9, question: "מה יודפס?", code: `nums = [1, 2, 3]\nresult = list(map(lambda x: x * 2, nums))\nprint(result)`, options: ["[1, 2, 3, 1, 2, 3]", "[2, 4, 6]", "6", "map object"], correct: 1, explanation: "map מכפיל כל איבר ב-2: [2, 4, 6]." },
            { id: 10, question: "מה יודפס?", code: `nums = [1, 2, 3, 4, 5, 6]\neven_squares = [x**2 for x in nums if x % 2 == 0]\nprint(even_squares)`, options: ["[4, 16, 36]", "[1, 4, 9, 16, 25, 36]", "[2, 4, 6]", "[1, 9, 25]"], correct: 0, explanation: "רק זוגיים (2,4,6) מועלים בריבוע: [4, 16, 36]." },
            { id: 11, question: "איזו טענה נכונה לגבי pytest?", options: ["שמות קבצי בדיקה חייבים להתחיל ב-test_", "חייבים להריץ pytest מתוך PyCharm בלבד", "assert לא עובד עם pytest", "pytest לא תומך במחלקות"], correct: 0, explanation: "pytest מזהה קבצים לפי הקונבנציה test_*.py או *_test.py." },
            { id: 12, question: "מהו הסדר הנכון בדפוס AAA?", options: ["Act, Arrange, Assert", "Assert, Arrange, Act", "Arrange, Act, Assert", "Arrange, Assert, Act"], correct: 2, explanation: "AAA: Arrange (הכנה), Act (הפעלה), Assert (בדיקה)." },
            { id: 13, question: "מה יודפס?", code: `from functools import reduce\nwords = ["a", "b", "c"]\nresult = reduce(lambda x, y: x + y, words)\nprint(result)`, options: ["['a', 'b', 'c']", "abc", "a b c", "3"], correct: 1, explanation: "reduce משרשר: 'a'+'b'='ab', 'ab'+'c'='abc'." },
            { id: 14, question: "מה יודפס?", code: `data = [(1, 'b'), (3, 'a'), (2, 'c')]\nsorted_data = sorted(data, key=lambda x: x[1])\nprint(sorted_data[0])`, options: ["(1, 'b')", "(3, 'a')", "(2, 'c')", "'a'"], correct: 1, explanation: "מיון לפי האיבר השני (האות). 'a' קודם, לכן (3, 'a') ראשון." },
            { id: 15, question: "מה יודפס?", code: `nested = [[1, 2], [3, 4], [5]]\nflat = [x for sublist in nested for x in sublist]\nprint(flat)`, options: ["[[1, 2], [3, 4], [5]]", "[1, 2, 3, 4, 5]", "[[1, 3, 5], [2, 4]]", "[3]"], correct: 1, explanation: "Nested comprehension עושה flatten: [1, 2, 3, 4, 5]." },
            { id: 16, question: "מה התוצאה?", code: `nums = [1, 2, 3]\nresult = list(map(str, nums))\nprint(result)`, options: ["['1', '2', '3']", "[1, 2, 3]", "'123'", "TypeError"], correct: 0, explanation: "map(str, nums) ממיר כל מספר למחרוזת: ['1', '2', '3']." },
            { id: 17, question: "מה יודפס?", code: `f = lambda: "Hello"\nprint(f())`, options: ["Hello", "lambda", "None", "TypeError"], correct: 0, explanation: "lambda ללא פרמטרים מחזיר 'Hello' כשקוראים לה." },
            { id: 18, question: "מה יודפס?", code: `nums = [0, 1, 2, 3]\nresult = list(filter(None, nums))\nprint(result)`, options: ["[0, 1, 2, 3]", "[1, 2, 3]", "[None, None, None, None]", "[]"], correct: 1, explanation: "filter(None, ...) מסנן ערכי falsy. 0 הוא falsy, נשארים [1, 2, 3]." },
            { id: 19, question: "מה עושה assert בפייתון?", options: ["בודק תנאי וזורק AssertionError אם False", "מדפיס הודעה למסך", "יוצר משתנה חדש", "מייבא מודול"], correct: 0, explanation: "assert condition זורק AssertionError אם התנאי False." },
            { id: 20, question: "מה יודפס?", code: `matrix = [[1, 2], [3, 4]]\ntransposed = [[row[i] for row in matrix] for i in range(2)]\nprint(transposed)`, options: ["[[1, 2], [3, 4]]", "[[1, 3], [2, 4]]", "[[4, 3], [2, 1]]", "[[1, 4], [2, 3]]"], correct: 1, explanation: "זה transpose של מטריצה: [[1, 3], [2, 4]]." }
        ]
    },
    exam3: {
        id: "exam3",
        title: "מבחן מסכם 3",
        description: "שאלות על OOP מתקדם, Abstract Classes, Iterators ומתודות מיוחדות",
        difficulty: "גבוהה מאוד",
        questions: [
            { id: 1, question: "מה יודפס?", code: `class A:\n    x = 1\n\nclass B(A):\n    pass\n\nclass C(A):\n    x = 3\n\nprint(A.x, B.x, C.x)`, options: ["1 1 1", "1 1 3", "1 None 3", "שגיאה"], correct: 1, explanation: "A.x=1, B יורש x מ-A לכן B.x=1, C מגדיר x=3 משלו." },
            { id: 2, question: "מה יודפס?", code: `class Counter:\n    count = 0\n    def __init__(self):\n        Counter.count += 1\n\na = Counter()\nb = Counter()\nc = Counter()\nprint(Counter.count)`, options: ["0", "1", "3", "שגיאה"], correct: 2, explanation: "count הוא class variable. כל יצירת אובייקט מגדילה אותו. 3 אובייקטים = 3." },
            { id: 3, question: "מה יודפס?", code: `class A:\n    def greet(self):\n        return "A"\n\nclass B(A):\n    def greet(self):\n        return super().greet() + "B"\n\nprint(B().greet())`, options: ["A", "B", "AB", "BA"], correct: 2, explanation: "super().greet() מחזיר 'A', ואז מוסיפים 'B'. תוצאה: 'AB'." },
            { id: 4, question: "מה יודפס?", code: `class A:\n    def __str__(self):\n        return "str"\n    def __repr__(self):\n        return "repr"\n\na = A()\nprint([a])`, options: ["[str]", "[repr]", "['str']", "[A object]"], correct: 1, explanation: "בהדפסת רשימה, פייתון משתמש ב-__repr__ של האיברים." },
            { id: 5, question: "מה יודפס?", code: `class Box:\n    def __init__(self, val):\n        self.val = val\n    def __add__(self, other):\n        return Box(self.val + other.val)\n\nb1 = Box(5)\nb2 = Box(3)\nb3 = b1 + b2\nprint(b3.val)`, options: ["5", "3", "8", "TypeError"], correct: 2, explanation: "__add__ מאפשר שימוש באופרטור +. 5+3=8." },
            { id: 6, question: "מה יודפס?", code: `class A:\n    def __len__(self):\n        return 0\n\na = A()\nprint(bool(a))`, options: ["True", "False", "0", "TypeError"], correct: 1, explanation: "ללא __bool__, פייתון משתמש ב-__len__. len=0 לכן bool=False." },
            { id: 7, question: "מה נכון לגבי Abstract Methods?", options: ["מחלקה עם abstract method לא יכולה להיות מופעלת ישירות", "abstract method חייב להיות ריק", "לא צריך לממש abstract method במחלקה יורשת", "abstract הוא מילה שמורה בפייתון"], correct: 0, explanation: "מחלקה אבסטרקטית לא יכולה ליצור אובייקטים עד שכל ה-abstract methods ממומשים." },
            { id: 8, question: "מה יודפס?", code: `class A:\n    @staticmethod\n    def foo():\n        return "static"\n\nprint(A.foo())\nprint(A().foo())`, options: ["static\\nstatic", "static\\nTypeError", "TypeError\\nstatic", "None\\nNone"], correct: 0, explanation: "staticmethod ניתן לקרוא גם מהמחלקה וגם מאובייקט." },
            { id: 9, question: "מה יודפס?", code: `class A:\n    @classmethod\n    def foo(cls):\n        return cls.__name__\n\nclass B(A):\n    pass\n\nprint(B.foo())`, options: ["A", "B", "foo", "TypeError"], correct: 1, explanation: "classmethod מקבל את המחלקה שקוראת לו. B.foo() מחזיר 'B'." },
            { id: 10, question: "מה יודפס?", code: `class MyIter:\n    def __init__(self):\n        self.n = 0\n    def __iter__(self):\n        return self\n    def __next__(self):\n        if self.n < 3:\n            self.n += 1\n            return self.n\n        raise StopIteration\n\nprint(list(MyIter()))`, options: ["[0, 1, 2]", "[1, 2, 3]", "[0, 1, 2, 3]", "StopIteration"], correct: 1, explanation: "__next__ מחזיר 1, 2, 3 ואז עוצר. התוצאה: [1, 2, 3]." },
            { id: 11, question: "מה יודפס?", code: `class A:\n    def __init__(self):\n        self._x = 5\n    @property\n    def x(self):\n        return self._x * 2\n\na = A()\nprint(a.x)`, options: ["5", "10", "_x", "TypeError"], correct: 1, explanation: "@property הופך x למתודה שמתנהגת כתכונה. מחזיר 5*2=10." },
            { id: 12, question: "מה יודפס?", code: `class A:\n    pass\n\nclass B(A):\n    pass\n\nprint(issubclass(B, A))\nprint(isinstance(B(), A))`, options: ["True\\nTrue", "True\\nFalse", "False\\nTrue", "False\\nFalse"], correct: 0, explanation: "B יורש מ-A, לכן issubclass=True. B() הוא גם instance של A." },
            { id: 13, question: "מה יודפס?", code: `class A:\n    def __eq__(self, other):\n        return True\n\na = A()\nb = A()\nprint(a == b, a is b)`, options: ["True True", "True False", "False False", "False True"], correct: 1, explanation: "__eq__ מחזיר True לכל השוואה. a is b בודק זהות - אלו אובייקטים שונים." },
            { id: 14, question: "מה יודפס?", code: `class A:\n    def __getitem__(self, key):\n        return key * 2\n\na = A()\nprint(a[3])`, options: ["3", "6", "KeyError", "TypeError"], correct: 1, explanation: "__getitem__ מאפשר גישה באמצעות []. a[3] מחזיר 3*2=6." },
            { id: 15, question: "מהו MRO?", options: ["Method Resolution Order - סדר החיפוש של מתודות בירושה", "Multiple Return Objects", "Main Runtime Operation", "Module Reference Order"], correct: 0, explanation: "MRO קובע את סדר החיפוש של מתודות בהיררכיית ירושה." },
            { id: 16, question: "מה יודפס?", code: `class A:\n    def __call__(self):\n        return "called"\n\na = A()\nprint(a())`, options: ["called", "A object", "None", "TypeError"], correct: 0, explanation: "__call__ מאפשר לקרוא לאובייקט כמו פונקציה. a() מחזיר 'called'." },
            { id: 17, question: "מה יודפס?", code: `class A:\n    def __init__(self, val):\n        self.val = val\n    def __lt__(self, other):\n        return self.val < other.val\n\nlst = [A(3), A(1), A(2)]\nlst.sort()\nprint([x.val for x in lst])`, options: ["[3, 1, 2]", "[1, 2, 3]", "[3, 2, 1]", "TypeError"], correct: 1, explanation: "__lt__ מגדיר את <. sort משתמש בו למיון: [1, 2, 3]." },
            { id: 18, question: "מה יודפס?", code: `class A:\n    count = 0\n    def __init__(self):\n        self.count = 5\n\na = A()\nprint(a.count, A.count)`, options: ["5 5", "0 0", "5 0", "0 5"], correct: 2, explanation: "a.count הוא instance variable (5). A.count הוא class variable (0)." },
            { id: 19, question: "מה יודפס?", code: `class A:\n    def foo(self):\n        return self.bar()\n    def bar(self):\n        return 1\n\nclass B(A):\n    def bar(self):\n        return 2\n\nprint(B().foo())`, options: ["1", "2", "None", "TypeError"], correct: 1, explanation: "זה פולימורפיזם. B().foo() קורא ל-self.bar() שב-B מחזיר 2." },
            { id: 20, question: "מה יודפס?", code: `def decorator(func):\n    def wrapper(*args):\n        return func(*args) + 10\n    return wrapper\n\n@decorator\ndef add(a, b):\n    return a + b\n\nprint(add(3, 4))`, options: ["7", "17", "10", "TypeError"], correct: 1, explanation: "הדקורטור מוסיף 10 לתוצאה. add(3,4)=7, +10=17." }
        ]
    }
};

// Helper function to get exam by ID
export function getFinalExam(examId: string): FinalExam | undefined {
    return finalExams[examId];
}

// Get all exam IDs
export function getFinalExamIds(): string[] {
    return Object.keys(finalExams);
}

// Get all exams as array
export function getAllFinalExams(): FinalExam[] {
    return Object.values(finalExams);
}

// Shuffle answers for a single question
function shuffleAnswers(question: FinalExamQuestion): FinalExamQuestion {
    const indices = [0, 1, 2, 3];
    // Fisher-Yates shuffle
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    const newCorrect = indices.indexOf(question.correct);
    const shuffledOptions = indices.map(i => question.options[i]);

    return {
        ...question,
        options: shuffledOptions,
        correct: newCorrect
    };
}

// Get exam with shuffled answers
export function getShuffledExam(examId: string): FinalExam | undefined {
    const exam = finalExams[examId];
    if (!exam) return undefined;

    return {
        ...exam,
        questions: exam.questions.map(shuffleAnswers)
    };
}

export default finalExams;

