package student

import (
	"errors"
	"strings"
)

type Student struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type StudentQuery struct {
	Name      string
	Current   int
	PageSize  int
	Ascending bool
}

type AttendedClassesQuery struct {
	ID        int
	Current   int
	PageSize  int
	Ascending bool
}

func CreateStudentQuery(name string, current int, pageSize int, ascending bool) (StudentQuery, error) {
	name = strings.TrimSpace(name)

	nameRunes := []rune(name)
	if len(nameRunes) > 100 {
		return StudentQuery{}, errors.New("name is too long")
	}

	if current < 1 {
		return StudentQuery{}, errors.New("current page must be at least 1")
	}

	if pageSize < 5 || pageSize > 100 {
		return StudentQuery{}, errors.New("page size must be between 5 and 100")
	}

	// Escape LIKE special characters
	name = strings.ReplaceAll(name, `\`, `\\`)
	name = strings.ReplaceAll(name, `%`, `\%`)
	name = strings.ReplaceAll(name, `_`, `\_`)

	query := StudentQuery{
		Name:      name,
		Current:   current,
		PageSize:  pageSize,
		Ascending: ascending,
	}

	return query, nil
}

func CreateAttendedClassesQuery(id int, current int, pageSize int, ascending bool) (AttendedClassesQuery, error) {
	if id < 1 {
		return AttendedClassesQuery{}, errors.New("student ID must be at least 1")
	}
	if current < 1 {
		return AttendedClassesQuery{}, errors.New("current page must be at least 1")
	}
	if pageSize < 5 || pageSize > 100 {
		return AttendedClassesQuery{}, errors.New("page size must be between 5 and 100")
	}

	query := AttendedClassesQuery{
		ID:       id,
		Current:  current,
		PageSize: pageSize,
	}
	return query, nil
}
