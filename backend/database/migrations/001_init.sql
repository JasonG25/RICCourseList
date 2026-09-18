CREATE TABLE courses (
    id INTEGER PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    capacity INTEGER NOT NULL
);

CREATE TABLE students (
    id INTEGER PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE student_courses (
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    PRIMARY KEY (student_id, course_id),
    CONSTRAINT fk_student
        FOREIGN KEY (student_id)
        REFERENCES students(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_course
        FOREIGN KEY (course_id)
        REFERENCES courses(id)
        ON DELETE CASCADE
);

INSERT INTO courses (id, code, name, capacity) VALUES
    (1, 'COMP1117', 'Computer programming', 30),
    (2, 'COMP2119', 'Introduction to data structures and algorithms', 30),
    (3, 'COMP2121', 'Discrete mathematics', 30),
    (4, 'COMP2396', 'Object-oriented programming and Java', 30),
    (5, 'COMP2501', 'Introduction to data science', 30),
    (6, 'ENGG1300', 'Fundamental mechanics', 30),
    (7, 'ENGG1310', 'Electricity and electronics', 30),
    (8, 'FINA1310', 'Corporate finance', 30),
    (9, 'FINA2312', 'Advanced corporate finance', 30),
    (10, 'FINA2320', 'Investments and portfolio analysis', 30);

INSERT INTO students (id, name) VALUES
    (1, '一号'),
    (2, '二号'),
    (3, '三号'),
    (4, '四号'),
    (5, '五号');

INSERT INTO student_courses (student_id, course_id) VALUES
    (1, 1),
    (1, 2),
    (1, 3),
    (1, 4),

    (2, 1),
    (2, 5),
    (2, 6),

    (3, 2),
    (3, 3),
    (3, 7),
    (3, 8),

    (4, 1),
    (4, 4),
    (4, 9),

    (5, 2),
    (5, 5),
    (5, 10);