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

type QueryResultMeta struct {
	TotalCount    int `json:"total_count"`
	NumberOfPages int `json:"number_of_pages"`
}

func createQueryResultMeta(totalCount int, pageSize int) QueryResultMeta {
	numberOfPages := 0
	if totalCount > 0 {
		numberOfPages = (totalCount + pageSize - 1) / pageSize
	}

	return QueryResultMeta{TotalCount: totalCount, NumberOfPages: numberOfPages}
}

func ConnectToDatabase() (*DatabaseService, error) {
	conn, err := pgx.Connect(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		return nil, err
	}
	return &DatabaseService{Conn: conn}, nil
}

func (db *DatabaseService) Close() {
	db.Conn.Close(context.Background())
}

func (db *DatabaseService) QueryCourses(q course.CourseQuery) ([]course.Course, QueryResultMeta, error) {
	operator := "ILIKE"
	if q.CaseSensitive {
		operator = "LIKE"
	}

	condition := "c.code " + operator + " $1 OR c.name " + operator + " $1"
	if q.CodeOnly {
		condition = "c.code " + operator + " $1"
	}

	order := "ASC"
	if !q.Ascending {
		order = "DESC"
	}

	searchPattern := "%" + q.Search + "%"
	var totalCount int
	countQuery := `SELECT COUNT(*) FROM courses c WHERE ` + condition + ` ESCAPE '\'`
	if err := db.Conn.QueryRow(context.Background(), countQuery, searchPattern).Scan(&totalCount); err != nil {
		return nil, QueryResultMeta{}, err
	}

	query := `
        SELECT c.id, c.code, c.name, c.capacity,
            COUNT(sc.student_id) AS attendee_count
        FROM courses c
        LEFT JOIN student_courses sc ON c.id = sc.course_id
        WHERE ` + condition + `
        ESCAPE '\'
        GROUP BY c.id, c.code, c.name, c.capacity
        ORDER BY c.code ` + order + `
        LIMIT $2 OFFSET $3
    `
	rows, err := db.Query(query, searchPattern, q.PageSize, (q.Current-1)*q.PageSize)
	if err != nil {
		return nil, QueryResultMeta{}, err
	}
	defer rows.Close()

	courses := []course.Course{}
	for rows.Next() {
		var c course.Course
		if err := rows.Scan(&c.ID, &c.Code, &c.Name, &c.Capacity, &c.NumberOfStudents); err != nil {
			return nil, QueryResultMeta{}, err
		}
		courses = append(courses, c)
	}
	if err := rows.Err(); err != nil {
		return nil, QueryResultMeta{}, err
	}

	return courses, createQueryResultMeta(totalCount, q.PageSize), nil
}

func (db *DatabaseService) QueryStudents(q student.StudentQuery) ([]student.Student, QueryResultMeta, error) {
	searchPattern := "%" + q.Name + "%"
	var totalCount int
	if err := db.Conn.QueryRow(
		context.Background(),
		`SELECT COUNT(*) FROM students WHERE name ILIKE $1 ESCAPE '\'`,
		searchPattern,
	).Scan(&totalCount); err != nil {
		return nil, QueryResultMeta{}, err
	}

	order := "ASC"
	if !q.Ascending {
		order = "DESC"
	}

	rows, err := db.Query(`
        SELECT id, name FROM students
        WHERE name ILIKE $1 ESCAPE '\'
        ORDER BY name `+order+` LIMIT $2 OFFSET $3`,
		searchPattern, q.PageSize, (q.Current-1)*q.PageSize,
	)
	if err != nil {
		return nil, QueryResultMeta{}, err
	}
	defer rows.Close()

	students := []student.Student{}
	for rows.Next() {
		var s student.Student
		if err := rows.Scan(&s.ID, &s.Name); err != nil {
			return nil, QueryResultMeta{}, err
		}
		students = append(students, s)
	}
	if err := rows.Err(); err != nil {
		return nil, QueryResultMeta{}, err
	}

	return students, createQueryResultMeta(totalCount, q.PageSize), nil
}

func (db *DatabaseService) QueryCourseAttendees(q course.CourseAttendeeQuery) ([]student.Student, QueryResultMeta, error) {
	order := "ASC"
	if !q.Ascending {
		order = "DESC"
	}

	var totalCount int
	if err := db.Conn.QueryRow(
		context.Background(),
		`SELECT COUNT(*) FROM student_courses WHERE course_id = $1`,
		q.CourseID,
	).Scan(&totalCount); err != nil {
		return nil, QueryResultMeta{}, err
	}

	query := `
        SELECT s.id, s.name
        FROM students s JOIN student_courses sc ON s.id = sc.student_id
        WHERE sc.course_id = $1
        ORDER BY s.id ` + order + ` LIMIT $2 OFFSET $3
    `
	rows, err := db.Query(query, q.CourseID, q.PageSize, (q.Current-1)*q.PageSize)
	if err != nil {
		return nil, QueryResultMeta{}, err
	}
	defer rows.Close()

	students := []student.Student{}
	for rows.Next() {
		var s student.Student
		if err := rows.Scan(&s.ID, &s.Name); err != nil {
			return nil, QueryResultMeta{}, err
		}
		students = append(students, s)
	}
	if err := rows.Err(); err != nil {
		return nil, QueryResultMeta{}, err
	}

	return students, createQueryResultMeta(totalCount, q.PageSize), nil
}

func (db *DatabaseService) QueryAttendedClasses(q student.AttendedClassesQuery) ([]course.Course, QueryResultMeta, error) {
	order := "ASC"
	if !q.Ascending {
		order = "DESC"
	}

	var totalCount int
	if err := db.Conn.QueryRow(
		context.Background(),
		`SELECT COUNT(*) FROM student_courses WHERE student_id = $1`,
		q.ID,
	).Scan(&totalCount); err != nil {
		return nil, QueryResultMeta{}, err
	}

	query := `
        SELECT c.id, c.code, c.name, c.capacity,
            COUNT(sc_all.student_id) AS attendee_count
        FROM courses c
        JOIN student_courses sc_student ON c.id = sc_student.course_id
        LEFT JOIN student_courses sc_all ON c.id = sc_all.course_id
        WHERE sc_student.student_id = $1
        GROUP BY c.id, c.code, c.name, c.capacity
        ORDER BY c.code ` + order + ` LIMIT $2 OFFSET $3
    `
	rows, err := db.Query(query, q.ID, q.PageSize, (q.Current-1)*q.PageSize)
	if err != nil {
		return nil, QueryResultMeta{}, err
	}
	defer rows.Close()

	courses := []course.Course{}
	for rows.Next() {
		var c course.Course
		if err := rows.Scan(&c.ID, &c.Code, &c.Name, &c.Capacity, &c.NumberOfStudents); err != nil {
			return nil, QueryResultMeta{}, err
		}
		courses = append(courses, c)
	}
	if err := rows.Err(); err != nil {
		return nil, QueryResultMeta{}, err
	}

	return courses, createQueryResultMeta(totalCount, q.PageSize), nil
}

func (db *DatabaseService) Query(query string, args ...interface{}) (pgx.Rows, error) {
	return db.Conn.Query(context.Background(), query, args...)
}
