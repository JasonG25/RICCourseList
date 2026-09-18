package database

import (
	"context"
	"os"

	"github.com/guozi/RICCourseList/course"
	"github.com/guozi/RICCourseList/student"
	"github.com/jackc/pgx/v5"
)

type DatabaseService struct {
	Conn *pgx.Conn
}

func ConnectToDatabase() (*DatabaseService, error) {
	conn, err := pgx.Connect(
		context.Background(),
		os.Getenv("DATABASE_URL"),
	)
	if err != nil {
		return nil, err
	}
	return &DatabaseService{Conn: conn}, nil
}

func (db *DatabaseService) Close() {
	db.Conn.Close(context.Background())
}

func (db *DatabaseService) QueryCourses(q course.CourseQuery) ([]course.Course, error) {

	// Decide whether the search should be case-sensitive
	operator := "ILIKE"
	if q.CaseSensitive {
		operator = "LIKE"
	}

	// Decide which columns to search
	condition := "c.code " + operator + " $1 OR c.name " + operator + " $1"
	if q.CodeOnly {
		condition = "c.code " + operator + " $1"
	}

	// Decide the sorting order
	order := "ASC"
	if !q.Ascending {
		order = "DESC"
	}

	query := `
        SELECT 
            c.id, 
            c.code, 
            c.name,
            c.capacity,
            COUNT(sc.student_id) AS attendee_count
        FROM courses c
        LEFT JOIN student_courses sc
            ON c.id = sc.course_id
        WHERE ` + condition + `
        ESCAPE '\'
        GROUP BY c.id, c.code, c.name, c.capacity
        ORDER BY c.code ` + order + `
        LIMIT $2 OFFSET $3
    `

	rows, err := db.Query(
		query,
		"%"+q.Search+"%",
		q.PageSize,
		(q.Current-1)*q.PageSize,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	courses := []course.Course{}

	for rows.Next() {
		var c course.Course

		err := rows.Scan(
			&c.ID,
			&c.Code,
			&c.Name,
			&c.Capacity,
			&c.NumberOfStudents,
		)
		if err != nil {
			return nil, err
		}

		courses = append(courses, c)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return courses, nil
}

func (db *DatabaseService) QueryStudents(q student.StudentQuery) ([]student.Student, error) {
	rows, err := db.Query(
		`
        SELECT id, name
        FROM students
        WHERE name ILIKE $1
		ESCAPE '\'
        ORDER BY name ASC
        LIMIT $2 OFFSET $3
        `,
		"%"+q.Name+"%",
		q.PageSize,
		(q.Current-1)*q.PageSize,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	students := []student.Student{}

	for rows.Next() {
		var s student.Student

		err := rows.Scan(&s.ID, &s.Name)
		if err != nil {
			return nil, err
		}

		students = append(students, s)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return students, nil
}

func (db *DatabaseService) QueryCourseAttendees(q course.CourseAttendeeQuery) ([]student.Student, error) {

	order := "ASC"

	if !q.Ascending {
		order = "DESC"
	}

	query := `
        SELECT s.id, s.name
        FROM students s
        JOIN student_courses sc
            ON s.id = sc.student_id
        WHERE sc.course_id = $1
        ORDER BY s.id ` + order + `
        LIMIT $2 OFFSET $3
    `

	rows, err := db.Query(
		query,
		q.CourseID,
		q.PageSize,
		(q.Current-1)*q.PageSize,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	students := []student.Student{}

	for rows.Next() {
		var s student.Student

		err := rows.Scan(&s.ID, &s.Name)
		if err != nil {
			return nil, err
		}

		students = append(students, s)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return students, nil
}

func (db *DatabaseService) QueryAttendedClasses(q student.AttendedClassesQuery) ([]course.Course, error) {

	order := "ASC"

	if !q.Ascending {
		order = "DESC"
	}

	query := `
		SELECT 
			c.id, 
			c.code, 
			c.name, 
			c.capacity, 
			COUNT(sc_all.student_id) AS attendee_count
		FROM courses c

		JOIN student_courses sc_student
			ON c.id = sc_student.course_id

		LEFT JOIN student_courses sc_all
			ON c.id = sc_all.course_id

		WHERE sc_student.student_id = $1

		GROUP BY c.id, c.code, c.name, c.capacity

		ORDER BY c.code ` + order + `

		LIMIT $2 OFFSET $3
	`

	rows, err := db.Query(
		query,
		q.ID,
		q.PageSize,
		(q.Current-1)*q.PageSize,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	courses := []course.Course{}

	for rows.Next() {
		var c course.Course

		err := rows.Scan(
			&c.ID,
			&c.Code,
			&c.Name,
			&c.Capacity,
			&c.NumberOfStudents,
		)
		if err != nil {
			return nil, err
		}

		courses = append(courses, c)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return courses, nil
}

func (db *DatabaseService) Query(query string, args ...interface{}) (pgx.Rows, error) {
	return db.Conn.Query(context.Background(), query, args...)
}
