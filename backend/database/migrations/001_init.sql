DROP TABLE IF EXISTS student_courses;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS courses;

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

    (6, 'COMP3111', 'Software engineering', 40),
    (7, 'COMP3314', 'Machine learning', 35),
    (8, 'COMP3322', 'Modern technologies on web and mobile platforms', 40),
    (9, 'COMP3230', 'Computer architecture', 35),
    (10, 'COMP3278', 'Introduction to database management systems', 40),
    (11, 'COMP3297', 'Software engineering', 30),
    (12, 'COMP3330', 'Computer networks', 35),
    (13, 'COMP3410', 'Computer graphics', 30),
    (14, 'COMP3511', 'Operating systems', 40),
    (15, 'COMP3523', 'Artificial intelligence', 35),
    (16, 'COMP3901', 'Special topics in computer science', 20),
    (17, 'COMP3902', 'Advanced algorithms', 25),
    (18, 'COMP4101', 'Advanced computer architecture', 25),
    (19, 'COMP4131', 'Natural language processing', 30),
    (20, 'COMP4211', 'Machine learning systems', 30),

    (21, 'ENGG1003', 'Engineering mathematics I', 50),
    (22, 'ENGG1004', 'Engineering mathematics II', 50),
    (23, 'ENGG1300', 'Fundamental mechanics', 30),
    (24, 'ENGG1310', 'Electricity and electronics', 30),
    (25, 'ENGG1320', 'Engineering materials', 35),
    (26, 'ENGG2002', 'Engineering probability and statistics', 40),
    (27, 'ENGG2300', 'Thermodynamics', 30),
    (28, 'ENGG2320', 'Fluid mechanics', 30),
    (29, 'ENGG2340', 'Control systems', 35),
    (30, 'ENGG2400', 'Signals and systems', 35),

    (31, 'FINA1310', 'Corporate finance', 30),
    (32, 'FINA1311', 'Financial accounting', 40),
    (33, 'FINA2312', 'Advanced corporate finance', 30),
    (34, 'FINA2320', 'Investments and portfolio analysis', 35),
    (35, 'FINA2322', 'Financial markets', 40),
    (36, 'FINA3101', 'Derivatives and risk management', 25),
    (37, 'FINA3203', 'International financial management', 30),

    (38, 'ECON1210', 'Introduction to economics', 60),
    (39, 'ECON1220', 'Principles of microeconomics', 60),
    (40, 'ECON2210', 'Intermediate microeconomics', 40),
    (41, 'ECON2220', 'Intermediate macroeconomics', 40),
    (42, 'ECON3230', 'Econometrics', 35),
    (43, 'ECON4301', 'Game theory', 30),

    (44, 'STAT1600', 'Introduction to statistics', 50),
    (45, 'STAT2601', 'Probability theory', 35),
    (46, 'STAT2602', 'Statistical inference', 35),
    (47, 'STAT3600', 'Applied regression analysis', 30),

    (48, 'ELEC1601', 'Introduction to electrical engineering', 40),
    (49, 'ELEC2100', 'Digital systems', 35),
    (50, 'ELEC2540', 'Microprocessors and microcontrollers', 30),

    (51, 'MECH2101', 'Engineering design', 30),
    (52, 'MECH2301', 'Robotics fundamentals', 30),
    (53, 'MECH3301', 'Robot perception and control', 25),

    (54, 'PHYS1050', 'University physics I', 60),
    (55, 'PHYS1051', 'University physics II', 60),

    (56, 'MATH1001', 'Calculus I', 80),
    (57, 'MATH1002', 'Calculus II', 80),
    (58, 'MATH2011', 'Linear algebra', 60),
    (59, 'MATH2101', 'Numerical methods', 40),
    (60, 'MATH3101', 'Optimization', 30);

-- ------------------------------------------------------------
-- Students
-- ------------------------------------------------------------

INSERT INTO students (id, name) VALUES
    (1, '一号'),
    (2, '二号'),
    (3, '三号'),
    (4, '四号'),
    (5, '五号'),

    (6, 'Alice'),
    (7, 'Bob'),
    (8, 'Charlie'),
    (9, 'David'),
    (10, 'Emma'),
    (11, 'Frank'),
    (12, 'Grace'),
    (13, 'Henry'),
    (14, 'Iris'),
    (15, 'Jack'),
    (16, 'Kevin'),
    (17, 'Linda'),
    (18, 'Michael'),
    (19, 'Nancy'),
    (20, 'Oliver'),
    (21, 'Peter'),
    (22, 'Quinn'),
    (23, 'Rachel'),
    (24, 'Sarah'),
    (25, 'Thomas'),
    (26, 'Victoria'),
    (27, 'William'),
    (28, 'Yvonne'),
    (29, 'Zachary'),
    (30, 'Aaron'),
    (31, 'Bella'),
    (32, 'Catherine'),
    (33, 'Daniel'),
    (34, 'Emily'),
    (35, 'Felix'),
    (36, 'George'),
    (37, 'Hannah'),
    (38, 'Ian'),
    (39, 'Julia'),
    (40, 'Kyle'),
    (41, 'Laura'),
    (42, 'Matthew'),
    (43, 'Nora'),
    (44, 'Oscar'),
    (45, 'Patricia'),
    (46, 'Ryan'),
    (47, 'Samantha'),
    (48, 'Timothy'),
    (49, 'Uma'),
    (50, 'Vincent'),

    (51, '王小明'),
    (52, '李小红'),
    (53, '张伟'),
    (54, '刘洋'),
    (55, '陈晨'),
    (56, '杨阳'),
    (57, '黄杰'),
    (58, '周子轩'),
    (59, '吴雨桐'),
    (60, '徐浩然'),
    (61, '孙嘉怡'),
    (62, '胡文博'),
    (63, '朱思远'),
    (64, '高子涵'),
    (65, '林俊杰'),
    (66, '何宇轩'),
    (67, '郭子豪'),
    (68, '马思涵'),
    (69, '罗一鸣'),
    (70, '梁诗琪'),

    (71, 'James Anderson'),
    (72, 'Emily Johnson'),
    (73, 'Michael Williams'),
    (74, 'Sarah Brown'),
    (75, 'David Jones'),
    (76, 'Jessica Garcia'),
    (77, 'Daniel Miller'),
    (78, 'Sophia Davis'),
    (79, 'Matthew Wilson'),
    (80, 'Olivia Moore'),
    (81, 'Christopher Taylor'),
    (82, 'Isabella Anderson'),
    (83, 'Andrew Thomas'),
    (84, 'Mia Jackson'),
    (85, 'Joshua White'),
    (86, 'Charlotte Harris'),
    (87, 'Ethan Martin'),
    (88, 'Amelia Thompson'),
    (89, 'Alexander Garcia'),
    (90, 'Harper Martinez'),

    (91, '张子轩'),
    (92, '李浩然'),
    (93, '王子涵'),
    (94, '陈雨桐'),
    (95, '刘思远'),
    (96, '杨浩宇'),
    (97, '赵欣怡'),
    (98, '黄俊杰'),
    (99, '周佳琪'),
    (100, '吴俊豪');

-- ------------------------------------------------------------
-- Student-Course relationships
-- ------------------------------------------------------------

-- First few students: hand-written data
INSERT INTO student_courses (student_id, course_id) VALUES
    (1, 1), (1, 2), (1, 3), (1, 4),
    (2, 1), (2, 5), (2, 6),
    (3, 2), (3, 3), (3, 7), (3, 8),
    (4, 1), (4, 4), (4, 9),
    (5, 2), (5, 5), (5, 10);

-- ------------------------------------------------------------
-- Generate additional relationships
--
-- PostgreSQL-specific:
-- generate_series() generates large amounts of test data.
-- ------------------------------------------------------------

-- Every student 6-100 takes several COMP courses.
INSERT INTO student_courses (student_id, course_id)
SELECT
    s.id,
    6 + ((s.id * 7 + x.n) % 15)
FROM generate_series(6, 100) AS s(id)
CROSS JOIN generate_series(0, 3) AS x(n)
ON CONFLICT DO NOTHING;

-- Students 6-100 also take some general courses.
INSERT INTO student_courses (student_id, course_id)
SELECT
    s.id,
    38 + ((s.id * 3 + x.n) % 10)
FROM generate_series(6, 100) AS s(id)
CROSS JOIN generate_series(0, 1) AS x(n)
ON CONFLICT DO NOTHING;

-- Some students take engineering courses.
INSERT INTO student_courses (student_id, course_id)
SELECT
    s.id,
    21 + ((s.id * 5 + x.n) % 10)
FROM generate_series(20, 100) AS s(id)
CROSS JOIN generate_series(0, 1) AS x(n)
ON CONFLICT DO NOTHING;

-- Some students take finance courses.
INSERT INTO student_courses (student_id, course_id)
SELECT
    s.id,
    31 + ((s.id * 11 + x.n) % 7)
FROM generate_series(30, 100) AS s(id)
CROSS JOIN generate_series(0, 1) AS x(n)
ON CONFLICT DO NOTHING;

-- Some students take math / physics / electrical courses.
INSERT INTO student_courses (student_id, course_id)
SELECT
    s.id,
    44 + ((s.id * 13 + x.n) % 17)
FROM generate_series(40, 100) AS s(id)
CROSS JOIN generate_series(0, 1) AS x(n)
ON CONFLICT DO NOTHING;