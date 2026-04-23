import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

// Admin login:   admin@cptedindia.com / Admin@1234
// Student login: student@cptedindia.com / Student@1234

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

// async function main() {
//   console.log("🌱 Seed running");

//   const users = await prisma.user.findMany();

//   console.log("Users:", users.length);
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });


async function main() {
  console.log("🌱 Seeding CPTEDINDIA database...");
  console.log(process.env.DATABASE_URL);

  // ─── USERS ────────────────────────────────────────────────────────────────

  const adminPassword = await bcrypt.hash("Admin@1234", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@cptedindia.com" },
    update: {},
    create: {
      name: "System Administrator",
      username: "admin",
      email: "admin@cptedindia.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const studentPassword = await bcrypt.hash("Student@1234", 12);
  const student = await prisma.user.upsert({
    where: { email: "student@cptedindia.com" },
    update: {},
    create: {
      name: "Demo Student",
      username: "demostudent",
      email: "student@cptedindia.com",
      password: studentPassword,
      role: "STUDENT",
    },
  });

  // ─── COURSE 1: Python Programming Fundamentals (FEATURED) ────────────────

  const course1 = await prisma.course.upsert({
    where: { slug: "python-fundamentals" },
    update: {},
    create: {
      title: "Python Programming Fundamentals",
      slug: "python-fundamentals",
      shortDescription: "Master Python from scratch with hands-on projects and real-world examples.",
      fullDescription: `<h2>About This Course</h2><p>This comprehensive Python course is designed for absolute beginners and covers everything you need to know to start programming with Python — the world's most popular and versatile programming language.</p><h3>What You'll Learn</h3><ul><li>Python syntax, data types, and variables</li><li>Control flow: if statements, loops, and iteration</li><li>Functions, modules, and code organization</li><li>Data structures: lists, dictionaries, tuples, and sets</li><li>Object-oriented programming fundamentals</li><li>File handling and exception management</li></ul><blockquote>"Python is the most versatile and beginner-friendly programming language in the world. Learning Python opens doors to web development, data science, AI, and automation."</blockquote><h3>Who Is This Course For?</h3><p>This course is designed for complete beginners with no prior programming experience. Whether you're a student, a professional looking to upskill, or someone curious about programming, this course will give you a solid foundation in Python.</p><h3>Prerequisites</h3><p>No programming experience required. Just a computer with an internet connection and the desire to learn!</p>`,
      price: 4999,
      level: "BEGINNER",
      estimatedDuration: "24 hours",
      tags: ["Python", "Programming", "Beginner", "Data Science", "Automation"],
      featured: true,
      published: true,
    },
  });

  // Module 1.1
  const py_m1 = await prisma.module.create({ data: { courseId: course1.id, title: "Introduction to Python", order: 0 } });

  await prisma.lesson.createMany({
    data: [
      { moduleId: py_m1.id, title: "What is Python?", order: 0, content: `<h1>What is Python?</h1><p>Python is a high-level, interpreted programming language created by <strong>Guido van Rossum</strong> and first released in 1991. Named after the British comedy group Monty Python, it has grown into one of the world's most popular programming languages.</p><h2>Key Features of Python</h2><ul><li><strong>Readable Syntax</strong> — Python code reads almost like English, making it easier to learn and maintain</li><li><strong>Interpreted</strong> — Code runs line by line, making debugging straightforward</li><li><strong>Versatile</strong> — Used in web development, data science, AI, automation, scripting, and more</li><li><strong>Large Standard Library</strong> — Comes with batteries included — thousands of built-in modules</li><li><strong>Active Community</strong> — Millions of developers worldwide contribute to Python's ecosystem</li></ul><h2>Where Is Python Used?</h2><p>Python powers some of the world's biggest platforms and most exciting technologies:</p><ul><li>Instagram, YouTube, Spotify — web backends</li><li>Netflix, Airbnb — data pipelines and analytics</li><li>Google, OpenAI — machine learning and AI research</li><li>NASA, CERN — scientific computing</li></ul><h2>Your First Python Program</h2><pre><code>print("Hello, World!")</code></pre><p>That single line outputs text to the console. Python's simplicity means you can start writing meaningful programs immediately.</p><blockquote>"Python is an experiment in how much freedom programmers need. Too much freedom and nobody can read anyone else's code; too little and expressiveness is endangered." — Guido van Rossum</blockquote>` },
      { moduleId: py_m1.id, title: "Installing Python and Setting Up Your Environment", order: 1, content: `<h1>Setting Up Your Python Environment</h1><p>Before we write our first real program, we need Python installed on your computer. Follow these steps carefully.</p><h2>Step 1: Download Python</h2><ol><li>Visit <strong>python.org/downloads</strong></li><li>Click the big yellow "Download Python 3.x.x" button</li><li>Save the installer to your computer</li></ol><h2>Step 2: Install Python</h2><h3>On Windows:</h3><ol><li>Run the downloaded installer</li><li><strong>Important:</strong> Check "Add Python to PATH" before clicking Install</li><li>Click "Install Now"</li></ol><h3>On macOS:</h3><ol><li>Open the downloaded .pkg file</li><li>Follow the installation wizard</li></ol><h3>On Linux:</h3><pre><code>sudo apt-get update
sudo apt-get install python3 python3-pip</code></pre><h2>Step 3: Verify Installation</h2><p>Open a terminal/command prompt and type:</p><pre><code>python --version
# Should show: Python 3.x.x</code></pre><h2>Choosing a Code Editor</h2><p>We recommend one of these excellent options:</p><ul><li><strong>VS Code</strong> — Free, lightweight, excellent Python extension (recommended for beginners)</li><li><strong>PyCharm Community Edition</strong> — Full-featured Python IDE, free version available</li><li><strong>Jupyter Notebook</strong> — Interactive environment, great for data science</li><li><strong>Thonny</strong> — Designed specifically for beginners</li></ul>` },
      { moduleId: py_m1.id, title: "Python Syntax and Your First Program", order: 2, content: `<h1>Python Syntax and Your First Program</h1><p>Python has a clean, elegant syntax designed for readability. Unlike many languages, Python uses <strong>indentation</strong> instead of curly braces to define code blocks.</p><h2>The print() Function</h2><p>The most fundamental function in Python outputs text to the screen:</p><pre><code>print("Hello, World!")
print("My name is Alice")
print(42)
print(3.14)</code></pre><h2>Variables</h2><p>Variables store data. In Python, you don't need to declare types explicitly:</p><pre><code>name = "Alice"          # String
age = 25               # Integer
height = 5.9           # Float
is_student = True      # Boolean
favorite_color = None  # None (null)</code></pre><h2>Python is Case-Sensitive</h2><pre><code>name = "Alice"
Name = "Bob"    # This is a DIFFERENT variable
NAME = "Charlie" # Yet another different variable</code></pre><h2>Comments</h2><p>Use <code>#</code> for comments that Python ignores:</p><pre><code># This entire line is a comment
x = 10  # This is an inline comment — code runs, then comment is ignored

"""
This is a multi-line string
often used as a docstring
to document functions and classes
"""</code></pre><h2>Basic Arithmetic</h2><pre><code>a = 10
b = 3

print(a + b)   # Addition: 13
print(a - b)   # Subtraction: 7
print(a * b)   # Multiplication: 30
print(a / b)   # Division: 3.333...
print(a // b)  # Floor division: 3
print(a % b)   # Modulo (remainder): 1
print(a ** b)  # Exponentiation: 1000</code></pre>` },
    ],
  });

  await prisma.quiz.create({
    data: {
      moduleId: py_m1.id,
      title: "Introduction to Python Quiz",
      questions: {
        create: [
          { text: "Who created Python?", optionA: "James Gosling", optionB: "Guido van Rossum", optionC: "Bjarne Stroustrup", optionD: "Dennis Ritchie", correctAnswer: "B", explanation: "Python was created by Guido van Rossum and first released in 1991.", order: 0 },
          { text: "What does Python use instead of curly braces to define code blocks?", optionA: "Parentheses", optionB: "Square brackets", optionC: "Indentation", optionD: "Semicolons", correctAnswer: "C", explanation: "Python uses indentation (whitespace) to define code blocks, which enforces readable code.", order: 1 },
          { text: "Which function outputs text to the console in Python?", optionA: "echo()", optionB: "console.log()", optionC: "printf()", optionD: "print()", correctAnswer: "D", explanation: "The print() function is used to display output in Python.", order: 2 },
          { text: "What symbol starts a single-line comment in Python?", optionA: "//", optionB: "--", optionC: "#", optionD: "/*", correctAnswer: "C", explanation: "The hash (#) symbol starts a single-line comment in Python.", order: 3 },
          { text: "What type of language is Python?", optionA: "Compiled", optionB: "Interpreted", optionC: "Assembly", optionD: "Machine code", correctAnswer: "B", explanation: "Python is an interpreted language — code is executed line-by-line at runtime rather than compiled ahead of time.", order: 4 },
        ],
      },
    },
  });

  // Module 1.2
  const py_m2 = await prisma.module.create({ data: { courseId: course1.id, title: "Control Flow and Functions", order: 1 } });

  await prisma.lesson.createMany({
    data: [
      { moduleId: py_m2.id, title: "Conditional Statements", order: 0, content: `<h1>Conditional Statements in Python</h1><p>Conditional statements let your program make decisions based on whether conditions are true or false.</p><h2>The if Statement</h2><pre><code>temperature = 35

if temperature > 30:
    print("It's hot outside!")
    print("Stay hydrated!")</code></pre><h2>if-else</h2><pre><code>age = 17

if age >= 18:
    print("You can vote!")
else:
    print("You must wait", 18 - age, "more years.")</code></pre><h2>if-elif-else (Multiple Conditions)</h2><pre><code>score = 82

if score >= 90:
    grade = "A"
    message = "Excellent!"
elif score >= 80:
    grade = "B"
    message = "Good job!"
elif score >= 70:
    grade = "C"
    message = "Keep it up!"
elif score >= 60:
    grade = "D"
    message = "You passed."
else:
    grade = "F"
    message = "Please review the material."

print(f"Grade: {grade} — {message}")</code></pre><h2>Comparison Operators</h2><pre><code>x = 10
y = 20

print(x == y)   # Equal: False
print(x != y)   # Not equal: True
print(x < y)    # Less than: True
print(x > y)    # Greater than: False
print(x <= 10)  # Less than or equal: True
print(x >= 10)  # Greater than or equal: True</code></pre><h2>Logical Operators</h2><pre><code>age = 25
income = 50000

# and: both conditions must be True
if age >= 18 and income >= 30000:
    print("Loan approved!")

# or: at least one condition must be True
if age < 13 or age > 65:
    print("Special pricing available")

# not: inverts the condition
is_raining = True
if not is_raining:
    print("Go for a walk!")</code></pre>` },
      { moduleId: py_m2.id, title: "Loops", order: 1, content: `<h1>Loops in Python</h1><p>Loops allow you to repeat a block of code multiple times — a fundamental concept in all programming.</p><h2>The for Loop</h2><pre><code># Looping over a range of numbers
for i in range(5):
    print(i)  # Prints: 0, 1, 2, 3, 4

# Looping over a list
fruits = ["apple", "banana", "cherry", "date"]
for fruit in fruits:
    print(f"I like {fruit}!")

# Looping with index using enumerate()
for index, fruit in enumerate(fruits):
    print(f"{index + 1}. {fruit}")</code></pre><h2>The while Loop</h2><pre><code>count = 0
while count < 5:
    print(f"Count: {count}")
    count += 1  # Equivalent to: count = count + 1

# Infinite loop with break
while True:
    user_input = input("Enter 'quit' to exit: ")
    if user_input == "quit":
        break
    print(f"You entered: {user_input}")</code></pre><h2>Loop Control Statements</h2><pre><code># break — exit the loop immediately
for i in range(10):
    if i == 5:
        break
    print(i)  # Prints 0, 1, 2, 3, 4

# continue — skip to next iteration
for i in range(10):
    if i % 2 == 0:
        continue  # Skip even numbers
    print(i)  # Prints 1, 3, 5, 7, 9

# pass — do nothing (placeholder)
for i in range(5):
    pass  # Will add code here later</code></pre><h2>Nested Loops</h2><pre><code>for i in range(1, 4):
    for j in range(1, 4):
        print(f"{i} × {j} = {i * j}")</code></pre>` },
      { moduleId: py_m2.id, title: "Functions", order: 2, content: `<h1>Functions in Python</h1><p>Functions are reusable blocks of code that perform a specific task. They are the building blocks of well-organized programs.</p><h2>Defining and Calling Functions</h2><pre><code>def greet():
    print("Hello! Welcome to Python.")

# Call the function
greet()  # Output: Hello! Welcome to Python.</code></pre><h2>Functions with Parameters</h2><pre><code>def greet(name):
    print(f"Hello, {name}! Welcome to Python.")

greet("Alice")  # Hello, Alice! Welcome to Python.
greet("Bob")    # Hello, Bob! Welcome to Python.</code></pre><h2>Return Values</h2><pre><code>def add(a, b):
    return a + b

result = add(3, 4)
print(result)  # 7

def get_circle_area(radius):
    import math
    return math.pi * radius ** 2

area = get_circle_area(5)
print(f"Area: {area:.2f}")  # Area: 78.54</code></pre><h2>Default Parameters</h2><pre><code>def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet("Alice"))           # Hello, Alice!
print(greet("Bob", "Hi there")) # Hi there, Bob!</code></pre><h2>Variable Number of Arguments</h2><pre><code>def sum_all(*numbers):
    return sum(numbers)

print(sum_all(1, 2, 3))        # 6
print(sum_all(1, 2, 3, 4, 5)) # 15</code></pre><h2>Lambda Functions</h2><pre><code># Short anonymous functions
square = lambda x: x ** 2
double = lambda x: x * 2

print(square(5))  # 25
print(double(7))  # 14

# Useful with map() and filter()
numbers = [1, 2, 3, 4, 5]
squares = list(map(lambda x: x**2, numbers))
evens = list(filter(lambda x: x % 2 == 0, numbers))</code></pre>` },
    ],
  });

  await prisma.quiz.create({
    data: {
      moduleId: py_m2.id,
      title: "Control Flow and Functions Quiz",
      questions: {
        create: [
          { text: "What keyword exits a loop immediately in Python?", optionA: "exit", optionB: "stop", optionC: "break", optionD: "return", correctAnswer: "C", explanation: "The 'break' keyword immediately exits the current loop.", order: 0 },
          { text: "How do you define a function in Python?", optionA: "function myFunc():", optionB: "def myFunc():", optionC: "create myFunc():", optionD: "func myFunc():", correctAnswer: "B", explanation: "Python uses the 'def' keyword to define functions.", order: 1 },
          { text: "What does range(5) produce?", optionA: "1, 2, 3, 4, 5", optionB: "0, 1, 2, 3, 4, 5", optionC: "0, 1, 2, 3, 4", optionD: "1, 2, 3, 4", correctAnswer: "C", explanation: "range(5) produces numbers 0 through 4 — 5 numbers starting at 0.", order: 2 },
          { text: "What keyword returns a value from a function?", optionA: "yield", optionB: "output", optionC: "send", optionD: "return", correctAnswer: "D", explanation: "The 'return' keyword sends a value back from a function to the caller.", order: 3 },
          { text: "What does the 'continue' statement do in a loop?", optionA: "Exits the loop", optionB: "Pauses the loop", optionC: "Skips to the next iteration", optionD: "Restarts the loop from the beginning", correctAnswer: "C", explanation: "continue skips the rest of the current iteration and moves to the next one.", order: 4 },
        ],
      },
    },
  });

  // Module 1.3
  const py_m3 = await prisma.module.create({ data: { courseId: course1.id, title: "Data Structures", order: 2 } });

  await prisma.lesson.createMany({
    data: [
      { moduleId: py_m3.id, title: "Lists and Tuples", order: 0, content: `<h1>Lists and Tuples</h1><p>Python provides several powerful built-in data structures for storing collections of data.</p><h2>Lists</h2><p>Lists are <strong>ordered, mutable</strong> collections — you can change them after creation:</p><pre><code>fruits = ["apple", "banana", "cherry"]

# Accessing elements (0-indexed)
print(fruits[0])    # apple (first)
print(fruits[-1])   # cherry (last)
print(fruits[1:3])  # ['banana', 'cherry'] (slice)

# Modifying lists
fruits.append("date")           # Add to end
fruits.insert(1, "avocado")     # Insert at index 1
fruits[0] = "apricot"           # Replace element
fruits.remove("banana")         # Remove first occurrence
popped = fruits.pop()           # Remove and return last
del fruits[0]                   # Delete by index

# Useful list methods
numbers = [3, 1, 4, 1, 5, 9, 2, 6]
numbers.sort()           # Sort in place
numbers.reverse()        # Reverse in place
print(len(numbers))      # Length: 8
print(numbers.count(1))  # Count occurrences: 2
print(sum(numbers))      # Sum all numbers</code></pre><h2>Tuples</h2><p>Tuples are <strong>ordered but immutable</strong> — they cannot be changed after creation:</p><pre><code>coordinates = (10.5, 20.3)
rgb_color = (255, 128, 0)
person = ("Alice", 30, "Engineer")

# Access same as lists
print(coordinates[0])  # 10.5
print(person[-1])      # Engineer

# Tuple unpacking
x, y = coordinates
name, age, job = person
print(name)  # Alice

# Why use tuples?
# - Faster than lists for read-only data
# - Can be used as dictionary keys
# - Signal to other developers: "this data shouldn't change"</code></pre>` },
      { moduleId: py_m3.id, title: "Dictionaries and Sets", order: 1, content: `<h1>Dictionaries and Sets</h1><h2>Dictionaries</h2><p>Dictionaries store <strong>key-value pairs</strong> and are one of Python's most powerful data structures:</p><pre><code>student = {
    "name": "Alice",
    "age": 20,
    "grade": "A",
    "courses": ["Math", "Science", "English"]
}

# Accessing values
print(student["name"])      # Alice
print(student.get("age"))   # 20
print(student.get("gpa", 0.0))  # 0.0 (default if key missing)

# Modifying dictionaries
student["age"] = 21                    # Update existing key
student["major"] = "Computer Science"  # Add new key
del student["grade"]                   # Delete a key

# Looping through dictionaries
for key in student:
    print(key)

for key, value in student.items():
    print(f"{key}: {value}")

for value in student.values():
    print(value)

# Dictionary comprehension
squares = {x: x**2 for x in range(5)}
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}</code></pre><h2>Sets</h2><p>Sets store <strong>unique, unordered</strong> elements:</p><pre><code>colors = {"red", "green", "blue", "red"}  # Duplicate removed!
print(colors)  # {'red', 'green', 'blue'}

# Adding and removing
colors.add("yellow")
colors.discard("red")  # Safe remove (no error if missing)

# Set operations
a = {1, 2, 3, 4, 5}
b = {4, 5, 6, 7, 8}

print(a & b)  # Intersection: {4, 5}
print(a | b)  # Union: {1, 2, 3, 4, 5, 6, 7, 8}
print(a - b)  # Difference: {1, 2, 3}
print(a ^ b)  # Symmetric difference: {1, 2, 3, 6, 7, 8}</code></pre>` },
      { moduleId: py_m3.id, title: "List Comprehensions and Advanced Iteration", order: 2, content: `<h1>List Comprehensions and Advanced Iteration</h1><p>List comprehensions provide a concise, Pythonic way to create and transform lists.</p><h2>Basic List Comprehension</h2><pre><code># Traditional approach
squares = []
for i in range(10):
    squares.append(i ** 2)

# Equivalent list comprehension (much cleaner!)
squares = [i ** 2 for i in range(10)]
print(squares)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]</code></pre><h2>With Filtering Conditions</h2><pre><code># Only even numbers
evens = [i for i in range(20) if i % 2 == 0]

# Squares of only odd numbers
odd_squares = [i**2 for i in range(10) if i % 2 != 0]

# String transformations
words = ["hello", "WORLD", "Python", "PROGRAMMING"]
normalized = [w.lower().strip() for w in words]</code></pre><h2>Dictionary and Set Comprehensions</h2><pre><code># Dictionary comprehension
word_lengths = {word: len(word) for word in ["cat", "elephant", "bee"]}
# {'cat': 3, 'elephant': 8, 'bee': 3}

# Set comprehension (unique values)
unique_lengths = {len(word) for word in ["cat", "dog", "bee", "elephant"]}</code></pre><h2>The zip() Function</h2><pre><code>names = ["Alice", "Bob", "Charlie"]
scores = [95, 82, 78]

# Pair up two lists
for name, score in zip(names, scores):
    print(f"{name}: {score}")

# Create dictionary from two lists
grade_book = dict(zip(names, scores))</code></pre><h2>Generator Expressions</h2><pre><code># Like list comprehensions but memory-efficient (lazy evaluation)
large_sum = sum(i**2 for i in range(1000000))  # Doesn't create a million-element list</code></pre>` },
    ],
  });

  await prisma.quiz.create({
    data: {
      moduleId: py_m3.id,
      title: "Data Structures Quiz",
      questions: {
        create: [
          { text: "Which Python data structure is immutable?", optionA: "List", optionB: "Dictionary", optionC: "Tuple", optionD: "Set", correctAnswer: "C", explanation: "Tuples are immutable — their contents cannot be changed after creation.", order: 0 },
          { text: "How do you add an element to the end of a list?", optionA: "list.add(item)", optionB: "list.push(item)", optionC: "list.append(item)", optionD: "list.insert(0, item)", correctAnswer: "C", explanation: "The append() method adds an element to the end of a list.", order: 1 },
          { text: "What is the output of len({1, 2, 2, 3, 3, 3})?", optionA: "6", optionB: "3", optionC: "1", optionD: "2", correctAnswer: "B", explanation: "Sets only store unique values. {1, 2, 2, 3, 3, 3} becomes {1, 2, 3} — length 3.", order: 2 },
          { text: "How do you safely access a dictionary key that might not exist?", optionA: "dict[key]", optionB: "dict.fetch(key)", optionC: "dict.get(key)", optionD: "dict.find(key)", correctAnswer: "C", explanation: "dict.get(key) returns None (or a default value) if the key doesn't exist, avoiding KeyError.", order: 3 },
          { text: "What does [x**2 for x in range(3)] evaluate to?", optionA: "[1, 4, 9]", optionB: "[0, 1, 4]", optionC: "[0, 1, 2]", optionD: "[1, 2, 3]", correctAnswer: "B", explanation: "range(3) gives 0, 1, 2. Squaring each: 0²=0, 1²=1, 2²=4.", order: 4 },
        ],
      },
    },
  });

  // ─── COURSE 2: Modern Web Development with React ──────────────────────────

  const course2 = await prisma.course.upsert({
    where: { slug: "react-web-development" },
    update: {},
    create: {
      title: "Modern Web Development with React",
      slug: "react-web-development",
      shortDescription: "Build dynamic, modern web applications using React, hooks, and industry best practices.",
      fullDescription: `<h2>Master React Development</h2><p>React is the world's most popular JavaScript library for building user interfaces. Used by Facebook, Instagram, Netflix, Airbnb, and thousands of other companies, React is an essential skill for any frontend developer.</p><h3>What You Will Build</h3><p>Throughout this course, you'll build three complete real-world projects:</p><ol><li><strong>Task Manager App</strong> — CRUD operations, local storage, filtering</li><li><strong>E-Commerce Product Catalog</strong> — API integration, cart functionality, routing</li><li><strong>Social Media Dashboard</strong> — Complex state management, real-time updates</li></ol><h3>Course Highlights</h3><ul><li>React fundamentals and JSX syntax</li><li>Functional components and hooks (useState, useEffect, useContext, useReducer)</li><li>Component architecture and reusability patterns</li><li>React Router for multi-page applications</li><li>State management with Context API and Redux Toolkit</li><li>Testing with React Testing Library and Jest</li><li>Performance optimization techniques</li></ul>`,
      price: 6999,
      level: "INTERMEDIATE",
      estimatedDuration: "36 hours",
      tags: ["React", "JavaScript", "Frontend", "Web Development", "Hooks"],
      featured: false,
      published: true,
    },
  });

  const react_m1 = await prisma.module.create({ data: { courseId: course2.id, title: "React Fundamentals", order: 0 } });
  await prisma.lesson.createMany({
    data: [
      { moduleId: react_m1.id, title: "Introduction to React and JSX", order: 0, content: `<h1>Introduction to React and JSX</h1><p>React is a <strong>JavaScript library</strong> for building user interfaces. Developed by Facebook in 2013, it revolutionized how we build web applications.</p><h2>Core Concepts</h2><ul><li><strong>Component-Based</strong> — Build encapsulated components that manage their own state</li><li><strong>Declarative</strong> — Describe what the UI should look like, React handles the updates</li><li><strong>Virtual DOM</strong> — React keeps a lightweight copy of the DOM for efficient updates</li></ul><h2>JSX — JavaScript XML</h2><p>JSX lets you write HTML-like syntax inside JavaScript:</p><pre><code>// JSX syntax
const element = &lt;h1&gt;Hello, World!&lt;/h1&gt;;

// This compiles to:
const element = React.createElement("h1", null, "Hello, World!");</code></pre><h2>Your First Component</h2><pre><code>function Welcome({ name }) {
  return (
    &lt;div&gt;
      &lt;h1&gt;Hello, {name}!&lt;/h1&gt;
      &lt;p&gt;Welcome to React.&lt;/p&gt;
    &lt;/div&gt;
  );
}

// Usage
&lt;Welcome name="Alice" /&gt;</code></pre>` },
      { moduleId: react_m1.id, title: "Components and Props", order: 1, content: `<h1>Components and Props</h1><p>Components are the building blocks of React applications. Props (properties) are how you pass data between components.</p><h2>Functional Components</h2><pre><code>// Simple functional component
function Button({ text, onClick, variant = "primary" }) {
  return (
    &lt;button
      onClick={onClick}
      className={variant === "primary" ? "btn-primary" : "btn-secondary"}
    &gt;
      {text}
    &lt;/button&gt;
  );
}

// Using the component
&lt;Button text="Click me" onClick={() =&gt; alert("Clicked!")} /&gt;
&lt;Button text="Cancel" variant="secondary" /&gt;</code></pre><h2>Props Rules</h2><ul><li>Props flow one direction: parent → child</li><li>Props are read-only — never modify them</li><li>Any valid JS value can be a prop: string, number, array, object, function</li></ul>` },
      { moduleId: react_m1.id, title: "State with useState", order: 2, content: `<h1>Managing State with useState</h1><p>State is data that changes over time. When state changes, React re-renders the component to reflect the new state.</p><h2>The useState Hook</h2><pre><code>import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0); // Initial value: 0

  return (
    &lt;div&gt;
      &lt;p&gt;Count: {count}&lt;/p&gt;
      &lt;button onClick={() =&gt; setCount(count + 1)}&gt;+&lt;/button&gt;
      &lt;button onClick={() =&gt; setCount(count - 1)}&gt;-&lt;/button&gt;
      &lt;button onClick={() =&gt; setCount(0)}&gt;Reset&lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre><h2>State with Objects</h2><pre><code>function ProfileForm() {
  const [user, setUser] = useState({ name: "", email: "" });

  const handleChange = (field, value) =&gt; {
    setUser(prev =&gt; ({ ...prev, [field]: value }));
  };

  return (
    &lt;form&gt;
      &lt;input value={user.name} onChange={e =&gt; handleChange("name", e.target.value)} /&gt;
      &lt;input value={user.email} onChange={e =&gt; handleChange("email", e.target.value)} /&gt;
    &lt;/form&gt;
  );
}</code></pre>` },
    ],
  });

  await prisma.quiz.create({
    data: { moduleId: react_m1.id, title: "React Fundamentals Quiz",
      questions: { create: [
        { text: "What is JSX?", optionA: "A database language", optionB: "A syntax extension letting you write HTML in JavaScript", optionC: "A JavaScript framework", optionD: "A CSS preprocessor", correctAnswer: "B", explanation: "JSX is a syntax extension for JavaScript that allows writing HTML-like markup inside JS files.", order: 0 },
        { text: "What hook manages component state?", optionA: "useEffect", optionB: "useContext", optionC: "useState", optionD: "useRef", correctAnswer: "C", explanation: "useState is the hook for adding and managing state in functional components.", order: 1 },
        { text: "Who developed React?", optionA: "Google", optionB: "Microsoft", optionC: "Facebook/Meta", optionD: "Twitter", correctAnswer: "C", explanation: "React was created by Jordan Walke at Facebook and released as open source in 2013.", order: 2 },
        { text: "What are props in React?", optionA: "Internal component state", optionB: "Styling properties", optionC: "Data passed from parent to child components", optionD: "React lifecycle methods", correctAnswer: "C", explanation: "Props are how parent components pass data down to child components.", order: 3 },
        { text: "What is the Virtual DOM?", optionA: "The actual browser DOM", optionB: "A server-side DOM implementation", optionC: "A lightweight in-memory representation of the real DOM", optionD: "A CSS rendering engine", correctAnswer: "C", explanation: "The Virtual DOM is React's lightweight copy of the real DOM used for efficient diffing and updating.", order: 4 },
      ] },
    },
  });

  const react_m2 = await prisma.module.create({ data: { courseId: course2.id, title: "React Hooks In Depth", order: 1 } });
  await prisma.lesson.createMany({
    data: [
      { moduleId: react_m2.id, title: "useEffect for Side Effects", order: 0, content: `<h1>useEffect for Side Effects</h1><p>useEffect lets you perform side effects in functional components — things like fetching data, subscriptions, or directly manipulating the DOM.</p><pre><code>import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() =&gt; {
    setLoading(true);
    fetch(\`/api/users/\${userId}\`)
      .then(res =&gt; res.json())
      .then(data =&gt; {
        setUser(data);
        setLoading(false);
      });
  }, [userId]); // Re-run when userId changes

  if (loading) return &lt;p&gt;Loading...&lt;/p&gt;;
  return &lt;div&gt;{user?.name}&lt;/div&gt;;
}</code></pre>` },
      { moduleId: react_m2.id, title: "useContext and useReducer", order: 1, content: `<h1>useContext and useReducer</h1><h2>useContext</h2><p>Avoids prop drilling by sharing data across the component tree:</p><pre><code>const ThemeContext = createContext('light');

function App() {
  return (
    &lt;ThemeContext.Provider value="dark"&gt;
      &lt;Page /&gt;
    &lt;/ThemeContext.Provider&gt;
  );
}

function Button() {
  const theme = useContext(ThemeContext); // Access anywhere in tree
  return &lt;button className={theme}&gt;Click&lt;/button&gt;;
}</code></pre><h2>useReducer</h2><p>For complex state logic with multiple sub-values:</p><pre><code>function reducer(state, action) {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 };
    case 'decrement': return { count: state.count - 1 };
    case 'reset': return { count: 0 };
    default: return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return (
    &lt;div&gt;
      {state.count}
      &lt;button onClick={() =&gt; dispatch({ type: 'increment' })}&gt;+&lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>` },
      { moduleId: react_m2.id, title: "Custom Hooks", order: 2, content: `<h1>Custom Hooks</h1><p>Custom hooks let you extract stateful logic into reusable functions. They must start with "use".</p><pre><code>// Custom hook for data fetching
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() =&gt; {
    fetch(url)
      .then(res =&gt; res.json())
      .then(setData)
      .catch(setError)
      .finally(() =&gt; setLoading(false));
  }, [url]);

  return { data, loading, error };
}

// Usage
function Posts() {
  const { data: posts, loading } = useFetch('/api/posts');
  if (loading) return &lt;Spinner /&gt;;
  return posts.map(post =&gt; &lt;Post key={post.id} {...post} /&gt;);
}</code></pre>` },
    ],
  });

  await prisma.quiz.create({
    data: { moduleId: react_m2.id, title: "React Hooks Quiz",
      questions: { create: [
        { text: "When does useEffect with an empty dependency array [] run?", optionA: "On every render", optionB: "Never", optionC: "Only once when the component mounts", optionD: "On component unmount only", correctAnswer: "C", explanation: "An empty dependency array means the effect runs once after the initial render (mount).", order: 0 },
        { text: "Custom hooks must start with which prefix?", optionA: "hook", optionB: "use", optionC: "custom", optionD: "react", correctAnswer: "B", explanation: "React requires custom hooks to start with 'use' — this enables React to apply the rules of hooks correctly.", order: 1 },
        { text: "What problem does useContext solve?", optionA: "State management", optionB: "Data fetching", optionC: "Prop drilling across many component levels", optionD: "Performance optimization", correctAnswer: "C", explanation: "useContext makes shared data accessible without passing props through every level of the tree.", order: 2 },
        { text: "useReducer is best suited for?", optionA: "Simple boolean toggles", optionB: "Fetching data", optionC: "Complex state with multiple related values", optionD: "DOM manipulation", correctAnswer: "C", explanation: "useReducer shines when state has multiple sub-values and the next state depends on the current one.", order: 3 },
        { text: "What is the first argument to useReducer?", optionA: "The initial state", optionB: "An action object", optionC: "A reducer function", optionD: "A dispatch function", correctAnswer: "C", explanation: "useReducer takes a reducer function as its first argument and the initial state as its second.", order: 4 },
      ] },
    },
  });

  const react_m3 = await prisma.module.create({ data: { courseId: course2.id, title: "Building Real Applications", order: 2 } });
  await prisma.lesson.createMany({
    data: [
      { moduleId: react_m3.id, title: "React Router for Navigation", order: 0, content: `<h1>React Router</h1><p>React Router enables navigation between pages without full page reloads.</p><pre><code>import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';

function App() {
  return (
    &lt;BrowserRouter&gt;
      &lt;nav&gt;
        &lt;Link to="/"&gt;Home&lt;/Link&gt;
        &lt;Link to="/about"&gt;About&lt;/Link&gt;
      &lt;/nav&gt;
      &lt;Routes&gt;
        &lt;Route path="/" element={&lt;Home /&gt;} /&gt;
        &lt;Route path="/about" element={&lt;About /&gt;} /&gt;
        &lt;Route path="/users/:id" element={&lt;UserDetail /&gt;} /&gt;
      &lt;/Routes&gt;
    &lt;/BrowserRouter&gt;
  );
}

function UserDetail() {
  const { id } = useParams();
  return &lt;div&gt;User ID: {id}&lt;/div&gt;;
}</code></pre>` },
      { moduleId: react_m3.id, title: "Fetching and Managing API Data", order: 1, content: `<h1>API Data Management</h1><p>Most React apps fetch data from APIs. Here's how to do it properly.</p><pre><code>function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() =&gt; {
    setLoading(true);
    fetch('https://api.example.com/products')
      .then(res =&gt; {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data =&gt; setProducts(data))
      .catch(err =&gt; setError(err.message))
      .finally(() =&gt; setLoading(false));
  }, []);

  if (loading) return &lt;LoadingSpinner /&gt;;
  if (error) return &lt;ErrorMessage message={error} /&gt;;

  return (
    &lt;div&gt;
      {products.map(product =&gt; (
        &lt;ProductCard key={product.id} product={product} /&gt;
      ))}
    &lt;/div&gt;
  );
}</code></pre>` },
      { moduleId: react_m3.id, title: "Performance Optimization", order: 2, content: `<h1>Performance Optimization</h1><p>React is fast by default, but as your app grows, optimization becomes important.</p><h2>React.memo</h2><pre><code>// Prevents re-render if props haven't changed
const ExpensiveComponent = React.memo(function({ data }) {
  return &lt;div&gt;{processData(data)}&lt;/div&gt;;
});</code></pre><h2>useMemo</h2><pre><code>function ProductList({ products, filter }) {
  // Only recompute when products or filter changes
  const filtered = useMemo(() =&gt;
    products.filter(p =&gt; p.category === filter),
    [products, filter]
  );
  return filtered.map(p =&gt; &lt;Product key={p.id} {...p} /&gt;);
}</code></pre><h2>useCallback</h2><pre><code>function Parent() {
  const [count, setCount] = useState(0);

  // Stable function reference — won't cause child re-renders
  const handleClick = useCallback(() =&gt; {
    setCount(c =&gt; c + 1);
  }, []);

  return &lt;Child onClick={handleClick} /&gt;;
}</code></pre><h2>Code Splitting with React.lazy</h2><pre><code>const AdminPanel = React.lazy(() =&gt; import('./AdminPanel'));

function App() {
  return (
    &lt;Suspense fallback={&lt;Loading /&gt;}&gt;
      &lt;AdminPanel /&gt;
    &lt;/Suspense&gt;
  );
}</code></pre>` },
    ],
  });

  await prisma.quiz.create({
    data: { moduleId: react_m3.id, title: "Building Real Applications Quiz",
      questions: { create: [
        { text: "What does React.memo do?", optionA: "Creates a memo notepad", optionB: "Prevents unnecessary re-renders when props haven't changed", optionC: "Memoizes API call results", optionD: "Creates a context", correctAnswer: "B", explanation: "React.memo is a HOC that prevents a component from re-rendering if its props are the same.", order: 0 },
        { text: "useMemo is used to memoize?", optionA: "Functions", optionB: "Components", optionC: "API calls", optionD: "Computed values", correctAnswer: "D", explanation: "useMemo caches expensive computed values and only recomputes when dependencies change.", order: 1 },
        { text: "useCallback memoizes?", optionA: "Values", optionB: "Functions", optionC: "Components", optionD: "State", correctAnswer: "B", explanation: "useCallback returns a memoized version of a callback function.", order: 2 },
        { text: "What is code splitting?", optionA: "Breaking CSS into multiple files", optionB: "Splitting state across multiple components", optionC: "Lazy-loading parts of the JavaScript bundle on demand", optionD: "Dividing a component into smaller components", correctAnswer: "C", explanation: "Code splitting lets you load parts of your app on demand, improving initial load time.", order: 3 },
        { text: "Which hook from React Router reads URL parameters?", optionA: "useRoute", optionB: "useURL", optionC: "useParams", optionD: "usePath", correctAnswer: "C", explanation: "useParams() returns an object of key/value pairs of URL parameters.", order: 4 },
      ] },
    },
  });

  // ─── COURSE 3: Data Analysis with Pandas ─────────────────────────────────

  const course3 = await prisma.course.upsert({
    where: { slug: "data-analysis-pandas" },
    update: {},
    create: {
      title: "Data Analysis with Python and Pandas",
      slug: "data-analysis-pandas",
      shortDescription: "Analyze, visualize, and interpret real-world datasets using Python, Pandas, and Matplotlib.",
      fullDescription: `<h2>Become a Data Analyst</h2><p>Data analysis is one of the most in-demand and highest-paying skills in today's job market. This course teaches you to work with real datasets using Python's powerful data science ecosystem.</p><h3>Tools You'll Master</h3><ul><li><strong>NumPy</strong> — Numerical computing with arrays</li><li><strong>Pandas</strong> — Data manipulation and analysis</li><li><strong>Matplotlib</strong> — Creating visualizations</li><li><strong>Seaborn</strong> — Statistical data visualization</li><li><strong>Jupyter Notebooks</strong> — Interactive analysis environment</li></ul><h3>Real-World Projects</h3><p>You will complete three hands-on projects using real datasets:</p><ol><li>Analyzing global COVID-19 data to identify trends</li><li>Exploring a retail sales dataset to find business insights</li><li>Building an interactive dashboard with Plotly</li></ol><blockquote>"Data is the new oil — and Pandas is your refinery." — Every data scientist ever</blockquote>`,
      price: 5999,
      level: "INTERMEDIATE",
      estimatedDuration: "28 hours",
      tags: ["Python", "Data Science", "Pandas", "Analytics", "Visualization"],
      featured: false,
      published: true,
    },
  });

  const pd_m1 = await prisma.module.create({ data: { courseId: course3.id, title: "Introduction to Pandas and NumPy", order: 0 } });
  await prisma.lesson.createMany({
    data: [
      { moduleId: pd_m1.id, title: "NumPy Arrays", order: 0, content: `<h1>NumPy Arrays</h1><p>NumPy is the foundation of Python's data science stack. It provides fast, efficient N-dimensional arrays.</p><pre><code>import numpy as np

# Creating arrays
a = np.array([1, 2, 3, 4, 5])
b = np.zeros((3, 4))        # 3x4 array of zeros
c = np.ones((2, 2))         # 2x2 array of ones
d = np.arange(0, 10, 0.5)  # Like range() but for floats
e = np.linspace(0, 1, 11)  # 11 evenly spaced points

# Array operations (vectorized — no loops needed!)
print(a * 2)      # [2, 4, 6, 8, 10]
print(a ** 2)     # [1, 4, 9, 16, 25]
print(np.sqrt(a)) # [1., 1.41, 1.73, 2., 2.24]

# Array statistics
print(a.mean())   # 3.0
print(a.std())    # Standard deviation
print(a.sum())    # 15
print(a.max())    # 5</code></pre>` },
      { moduleId: pd_m1.id, title: "DataFrames and Series", order: 1, content: `<h1>Pandas DataFrames and Series</h1><p>Pandas is built on top of NumPy and provides labeled, flexible data structures.</p><h2>Series</h2><p>A Series is a one-dimensional labeled array:</p><pre><code>import pandas as pd

s = pd.Series([10, 20, 30, 40], index=["a", "b", "c", "d"])
print(s["a"])   # 10
print(s[["a", "c"]])  # Both values</code></pre><h2>DataFrame</h2><p>A DataFrame is a 2D labeled data structure — like an Excel spreadsheet in Python:</p><pre><code>data = {
    "Name": ["Alice", "Bob", "Charlie"],
    "Age": [25, 30, 35],
    "Salary": [50000, 75000, 90000],
    "City": ["Mumbai", "Delhi", "Bangalore"]
}

df = pd.DataFrame(data)
print(df.head())      # First 5 rows
print(df.shape)       # (3, 4)
print(df.dtypes)      # Column data types
print(df.describe())  # Statistical summary</code></pre>` },
      { moduleId: pd_m1.id, title: "Loading and Exploring Real Data", order: 2, content: `<h1>Loading and Exploring Real Data</h1><h2>Reading Data</h2><pre><code># From CSV (most common)
df = pd.read_csv("sales_data.csv")

# From Excel
df = pd.read_excel("report.xlsx", sheet_name="Sheet1")

# From JSON
df = pd.read_json("data.json")

# From a URL directly!
url = "https://raw.githubusercontent.com/example/data.csv"
df = pd.read_csv(url)</code></pre><h2>Initial Exploration</h2><pre><code>df.head(10)       # First 10 rows
df.tail(5)        # Last 5 rows
df.info()         # Column names, types, non-null counts
df.describe()     # Stats for numeric columns
df.shape          # (rows, columns)
df.columns        # List of column names
df.dtypes         # Data type of each column
df.isnull().sum() # Missing values per column
df.duplicated().sum()  # Number of duplicate rows</code></pre>` },
    ],
  });

  await prisma.quiz.create({
    data: { moduleId: pd_m1.id, title: "Pandas and NumPy Fundamentals Quiz",
      questions: { create: [
        { text: "What is a Pandas DataFrame?", optionA: "A Python function", optionB: "A 2D labeled tabular data structure", optionC: "A database connection", optionD: "A chart type", correctAnswer: "B", explanation: "A DataFrame is Pandas' primary 2D data structure — like an in-memory spreadsheet with labels.", order: 0 },
        { text: "How do you load a CSV file into a DataFrame?", optionA: "pd.open_csv('file.csv')", optionB: "pd.load_csv('file.csv')", optionC: "pd.read_csv('file.csv')", optionD: "pd.import_csv('file.csv')", correctAnswer: "C", explanation: "pd.read_csv() is the standard Pandas function for loading CSV files.", order: 1 },
        { text: "What does df.head() return by default?", optionA: "The last 5 rows", optionB: "The first 5 rows", optionC: "Column names only", optionD: "Data types of all columns", correctAnswer: "B", explanation: "head() returns the first 5 rows of the DataFrame (can be customized with a number argument).", order: 2 },
        { text: "A Pandas Series is:", optionA: "A 2D array with labels", optionB: "A dictionary of DataFrames", optionC: "A 1D labeled array", optionD: "A NumPy matrix", correctAnswer: "C", explanation: "A Series is a one-dimensional labeled array — like a single column of a DataFrame.", order: 3 },
        { text: "What does np.zeros((3, 4)) create?", optionA: "A 4x3 array of ones", optionB: "A 3x4 array of zeros", optionC: "A list with 12 zeros", optionD: "An empty DataFrame", correctAnswer: "B", explanation: "np.zeros((rows, cols)) creates an array of the given shape filled with zeros.", order: 4 },
      ] },
    },
  });

  const pd_m2 = await prisma.module.create({ data: { courseId: course3.id, title: "Data Cleaning and Transformation", order: 1 } });
  await prisma.lesson.createMany({
    data: [
      { moduleId: pd_m2.id, title: "Handling Missing Data", order: 0, content: `<h1>Handling Missing Data</h1><p>Real-world data is messy. Missing values are ubiquitous and must be handled carefully.</p><h2>Detecting Missing Values</h2><pre><code>import pandas as pd

df.isnull()           # Boolean DataFrame — True where NaN
df.isnull().sum()     # Count missing per column
df.isnull().sum() / len(df) * 100  # Missing percentage

# Find rows with any missing value
df[df.isnull().any(axis=1)]</code></pre><h2>Dropping Missing Values</h2><pre><code>df.dropna()                    # Drop rows with ANY missing value
df.dropna(subset=["salary"])   # Drop rows where 'salary' is missing
df.dropna(thresh=5)            # Keep rows with at least 5 non-NaN values
df.dropna(axis=1)              # Drop columns with any missing value</code></pre><h2>Filling Missing Values</h2><pre><code>df.fillna(0)                        # Fill all NaN with 0
df["age"].fillna(df["age"].mean())  # Fill with column mean
df["city"].fillna("Unknown")        # Fill strings with placeholder
df.fillna(method="ffill")           # Forward fill (use previous value)
df.fillna(method="bfill")           # Backward fill</code></pre>` },
      { moduleId: pd_m2.id, title: "Filtering, Sorting, and Grouping", order: 1, content: `<h1>Filtering, Sorting, and Grouping</h1><h2>Boolean Filtering</h2><pre><code># Single condition
df[df["age"] > 30]
df[df["city"] == "Mumbai"]

# Multiple conditions — use & (and), | (or)
df[(df["age"] > 25) & (df["salary"] > 50000)]
df[(df["city"] == "Mumbai") | (df["city"] == "Delhi")]

# isin() for multiple values
df[df["city"].isin(["Mumbai", "Delhi", "Bangalore"])]

# String filtering
df[df["name"].str.contains("Ali")]
df[df["email"].str.endswith("@gmail.com")]</code></pre><h2>Sorting</h2><pre><code>df.sort_values("salary")                           # Ascending
df.sort_values("salary", ascending=False)          # Descending
df.sort_values(["city", "salary"], ascending=[True, False])  # Multi-column</code></pre><h2>GroupBy</h2><pre><code># Average salary by city
df.groupby("city")["salary"].mean()

# Multiple aggregations
df.groupby("department").agg({
    "salary": ["mean", "min", "max"],
    "age": "mean"
})

# Count employees per city
df.groupby("city").size()</code></pre>` },
      { moduleId: pd_m2.id, title: "Merging and Reshaping Data", order: 2, content: `<h1>Merging and Reshaping Data</h1><h2>Merging DataFrames</h2><pre><code># Like SQL JOINs
employees = pd.DataFrame({"id": [1,2,3], "name": ["Alice","Bob","Charlie"]})
departments = pd.DataFrame({"emp_id": [1,2,3], "dept": ["HR","IT","Finance"]})

# Inner join (only matching rows)
merged = pd.merge(employees, departments, left_on="id", right_on="emp_id")

# Left join (all rows from left)
merged = pd.merge(employees, departments, left_on="id", right_on="emp_id", how="left")</code></pre><h2>Pivot Tables</h2><pre><code># Create pivot table — like Excel pivot tables
pivot = df.pivot_table(
    values="sales",
    index="region",
    columns="product_category",
    aggfunc="sum",
    fill_value=0
)</code></pre><h2>Melt (Wide to Long)</h2><pre><code># Transform wide format to long format
df_long = pd.melt(df_wide, id_vars=["name"], var_name="month", value_name="sales")</code></pre>` },
    ],
  });

  await prisma.quiz.create({
    data: { moduleId: pd_m2.id, title: "Data Cleaning Quiz",
      questions: { create: [
        { text: "How do you count missing values per column?", optionA: "df.missing()", optionB: "df.isnull().sum()", optionC: "df.count_null()", optionD: "df.na.count()", correctAnswer: "B", explanation: "isnull() creates a boolean mask, and .sum() counts True values per column.", order: 0 },
        { text: "Which method removes rows with missing values?", optionA: "df.remove_null()", optionB: "df.clean()", optionC: "df.dropna()", optionD: "df.delete_missing()", correctAnswer: "C", explanation: "dropna() removes rows (or columns) containing NaN values.", order: 1 },
        { text: "What does groupby() do?", optionA: "Sorts rows by a column", optionB: "Groups rows by unique values in one or more columns for aggregation", optionC: "Removes duplicate rows", optionD: "Merges two DataFrames", correctAnswer: "B", explanation: "groupby() splits the data into groups based on column values, then you apply aggregation functions.", order: 2 },
        { text: "Which merge type keeps all rows from the left DataFrame?", optionA: "inner", optionB: "outer", optionC: "right", optionD: "left", correctAnswer: "D", explanation: "how='left' performs a left join — all rows from the left DataFrame are kept, NaN for unmatched right rows.", order: 3 },
        { text: "df.fillna(method='ffill') fills missing values with?", optionA: "Zero", optionB: "The column mean", optionC: "The previous valid value", optionD: "The next valid value", correctAnswer: "C", explanation: "Forward fill (ffill) propagates the last valid observation forward to fill NaN values.", order: 4 },
      ] },
    },
  });

  const pd_m3 = await prisma.module.create({ data: { courseId: course3.id, title: "Data Visualization", order: 2 } });
  await prisma.lesson.createMany({
    data: [
      { moduleId: pd_m3.id, title: "Matplotlib Fundamentals", order: 0, content: `<h1>Matplotlib Fundamentals</h1><p>Matplotlib is Python's foundational plotting library, providing full control over every aspect of your charts.</p><pre><code>import matplotlib.pyplot as plt
import numpy as np

# Line plot
x = np.linspace(0, 10, 100)
y = np.sin(x)

plt.figure(figsize=(10, 5))
plt.plot(x, y, color="blue", linewidth=2, label="sin(x)")
plt.xlabel("X axis")
plt.ylabel("Y axis")
plt.title("Sine Wave")
plt.legend()
plt.grid(True)
plt.show()

# Multiple subplots
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
ax1.bar(["A", "B", "C"], [10, 25, 15], color="steelblue")
ax1.set_title("Bar Chart")
ax2.scatter(x[:50], y[:50], alpha=0.6)
ax2.set_title("Scatter Plot")
plt.tight_layout()
plt.show()</code></pre>` },
      { moduleId: pd_m3.id, title: "Pandas Built-in Visualization", order: 1, content: `<h1>Pandas Visualization</h1><p>Pandas integrates with Matplotlib to provide convenient plot methods directly on DataFrames.</p><pre><code>import pandas as pd

df = pd.DataFrame({
    "Month": ["Jan","Feb","Mar","Apr","May","Jun"],
    "Sales": [45000, 52000, 48000, 61000, 73000, 68000],
    "Expenses": [32000, 35000, 31000, 42000, 51000, 49000]
})

# Line chart
df.plot(x="Month", y=["Sales","Expenses"], kind="line", figsize=(10,5), marker="o")

# Bar chart
df.plot(x="Month", y="Sales", kind="bar", color="steelblue", figsize=(8,5))

# From a Series
monthly_avg = df.groupby("Month")["Sales"].mean()
monthly_avg.plot(kind="barh", color="coral")  # Horizontal bars

# Histogram
df["Sales"].plot(kind="hist", bins=10, edgecolor="black")</code></pre>` },
      { moduleId: pd_m3.id, title: "Seaborn for Statistical Visualization", order: 2, content: `<h1>Seaborn for Statistical Visualization</h1><p>Seaborn builds on Matplotlib with a higher-level interface and beautiful default styles for statistical plots.</p><pre><code>import seaborn as sns
import matplotlib.pyplot as plt

# Set a clean style
sns.set_theme(style="whitegrid")

# Scatter plot with regression line
sns.regplot(data=df, x="age", y="salary")

# Box plot — shows distribution and outliers
sns.boxplot(data=df, x="department", y="salary", palette="Set2")

# Violin plot — combines box plot with kernel density
sns.violinplot(data=df, x="city", y="age")

# Heatmap — great for correlation matrices
correlation_matrix = df.corr(numeric_only=True)
sns.heatmap(correlation_matrix, annot=True, cmap="coolwarm", fmt=".2f")
plt.title("Feature Correlations")
plt.show()

# Pair plot — scatter matrix of all numeric features
sns.pairplot(df[["age", "salary", "experience"]], hue="city")</code></pre>` },
    ],
  });

  await prisma.quiz.create({
    data: { moduleId: pd_m3.id, title: "Data Visualization Quiz",
      questions: { create: [
        { text: "Which library is Python's foundational plotting library?", optionA: "Seaborn", optionB: "Plotly", optionC: "Matplotlib", optionD: "Bokeh", correctAnswer: "C", explanation: "Matplotlib is the foundational plotting library that most others (including Seaborn) build on.", order: 0 },
        { text: "What does plt.show() do?", optionA: "Saves the figure to disk", optionB: "Clears the current figure", optionC: "Displays the current figure", optionD: "Returns the figure as bytes", correctAnswer: "C", explanation: "plt.show() renders and displays all open figures.", order: 1 },
        { text: "A heatmap is best for showing?", optionA: "Time series trends", optionB: "Correlation between variables", optionC: "Distribution of a single variable", optionD: "Geographic patterns", correctAnswer: "B", explanation: "Heatmaps visualize correlation matrices extremely well — colors show strength of relationships.", order: 2 },
        { text: "Seaborn is built on top of?", optionA: "Plotly", optionB: "NumPy directly", optionC: "Pandas only", optionD: "Matplotlib", correctAnswer: "D", explanation: "Seaborn is built on top of Matplotlib and provides a higher-level statistical visualization API.", order: 3 },
        { text: "Which plot type shows distribution, median, quartiles, and outliers together?", optionA: "Line chart", optionB: "Pie chart", optionC: "Box plot", optionD: "Scatter plot", correctAnswer: "C", explanation: "Box plots display the median, IQR (box), whiskers (range), and outliers — the full distribution summary.", order: 4 },
      ] },
    },
  });

  // ─── EMAIL TEMPLATES ──────────────────────────────────────────────────────

  await prisma.emailTemplate.upsert({
    where: { name: "Welcome Email" },
    update: {},
    create: {
      name: "Welcome Email",
      subject: "Welcome to CPTEDINDIA, {{user_name}}!",
      body: `<h2>Welcome to CPTEDINDIA!</h2><p>Dear {{user_name}},</p><p>We're thrilled to have you join the CPTEDINDIA learning community. Your account has been created successfully and you're ready to start your learning journey.</p><h3>What's Next?</h3><ul><li>Browse our catalogue of expert-curated courses</li><li>Get your course access from your administrator</li><li>Start learning at your own pace</li><li>Earn verified certificates upon completion</li></ul><p>If you have any questions, reach out to us anytime.</p><p>Happy Learning!<br><strong>The CPTEDINDIA Team</strong></p>`,
    },
  });

  await prisma.emailTemplate.upsert({
    where: { name: "Course Access Granted" },
    update: {},
    create: {
      name: "Course Access Granted",
      subject: "You now have access to: {{course_title}}",
      body: `<h2>Course Access Granted</h2><p>Dear {{user_name}},</p><p>Great news! You now have full access to <strong>{{course_title}}</strong>.</p><p><strong>Access Details:</strong></p><ul><li>Course: {{course_title}}</li><li>Granted on: {{grant_date}}</li></ul><p>Log in to your CPTEDINDIA account to start learning right away. Your progress is automatically saved as you go.</p><p>Best of luck with your studies!<br><strong>The CPTEDINDIA Team</strong></p>`,
    },
  });

  await prisma.emailTemplate.upsert({
    where: { name: "Certificate Issued" },
    update: {},
    create: {
      name: "Certificate Issued",
      subject: "🎓 Congratulations! Your certificate for {{course_title}} is ready",
      body: `<h2>Certificate of Completion Issued</h2><p>Dear {{user_name}},</p><p>Congratulations on completing <strong>{{course_title}}</strong>! You've demonstrated dedication and commitment to your learning.</p><p><strong>Certificate Details:</strong></p><ul><li>Course: {{course_title}}</li><li>Certificate Number: {{certificate_number}}</li></ul><p>You can download your certificate from the Certificates section of your dashboard. Share it with your employer or on LinkedIn to showcase your achievement.</p><p>Keep up the great work!<br><strong>The CPTEDINDIA Team</strong></p>`,
    },
  });

  console.log("✅ Database seeded successfully!");
  console.log("─────────────────────────────────────────");
  console.log("Admin login:   admin@cptedindia.com / Admin@1234");
  console.log("Student login: student@cptedindia.com / Student@1234");
  console.log("─────────────────────────────────────────");
  console.log(`Created courses: Python Fundamentals (featured), React Web Dev, Data Analysis`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
