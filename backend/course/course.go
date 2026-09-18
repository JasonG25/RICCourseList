package course

import (
	"errors"
	"strings"
)

type Course struct {
	ID               int    `json:"id"`
	Code             string `json:"code"`
	Name             string `json:"name"`
	Capacity         int    `json:"capacity"`
	NumberOfStudents int    `json:"number_of_students"`
}

type CourseAttendeeQuery struct {
	CourseID  int
	Current   int
	PageSize  int
	Ascending bool
}

type CourseQuery struct {
	Search        string
	Current       int
	PageSize      int
	CaseSensitive bool
	CodeOnly      bool
	Ascending     bool
}

func CreateCourseQuery(
	search string,
	current int,
	pageSize int,
	caseSensitive bool,
	codeOnly bool,
	ascending bool,
) (CourseQuery, error) {

	search = strings.TrimSpace(search)

	searchRunes := []rune(search)
	if len(searchRunes) > 100 {
		return CourseQuery{}, errors.New("search is too long")
	}

	if current < 1 {
		return CourseQuery{}, errors.New("current page must be at least 1")
	}

	if pageSize < 5 || pageSize > 100 {
		return CourseQuery{}, errors.New("page size must be between 5 and 100")
	}

	// Escape LIKE special characters
	search = strings.ReplaceAll(search, `\`, `\\`)
	search = strings.ReplaceAll(search, `%`, `\%`)
	search = strings.ReplaceAll(search, `_`, `\_`)

	query := CourseQuery{
		Search:        search,
		Current:       current,
		PageSize:      pageSize,
		CaseSensitive: caseSensitive,
		CodeOnly:      codeOnly,
		Ascending:     ascending,
	}

	return query, nil
}

func CreateAttendeeQuery(
	courseID int,
	current int,
	pageSize int,
	ascending bool) (CourseAttendeeQuery, error) {
	if courseID < 1 {
		return CourseAttendeeQuery{}, errors.New("course ID must be at least 1")
	}
	if current < 1 {
		return CourseAttendeeQuery{}, errors.New("current page must be at least 1")
	}
	if pageSize < 5 || pageSize > 100 {
		return CourseAttendeeQuery{}, errors.New("page size must be between 5 and 100")
	}

	query := CourseAttendeeQuery{
		CourseID:  courseID,
		Current:   current,
		PageSize:  pageSize,
		Ascending: ascending,
	}
	return query, nil
}
