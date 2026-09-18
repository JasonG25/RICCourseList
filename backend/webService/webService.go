package webservice

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/guozi/RICCourseList/course"
	"github.com/guozi/RICCourseList/database"
	"github.com/guozi/RICCourseList/student"
)

func RegisterCourses(router *gin.Engine, db *database.DatabaseService) {
	router.GET("/api/courses", func(c *gin.Context) {
		search := c.Query("search")
		current := c.Query("current")
		pageSize := c.Query("page_size")
		caseSensitive := c.Query("case_sensitive")
		codeOnly := c.Query("code_only")
		ascending := c.Query("ascending")

		currentInt, err := strconv.Atoi(current)
		if err != nil {
			c.JSON(400, gin.H{"error": "Invalid current page number"})
			return
		}
		pageSizeInt, err := strconv.Atoi(pageSize)
		if err != nil {
			c.JSON(400, gin.H{"error": "Invalid page size"})
			return
		}

		caseSensitiveBool, err := strconv.ParseBool(caseSensitive)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid case_sensitive",
			})
			return
		}

		codeOnlyBool, err := strconv.ParseBool(codeOnly)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid code_only",
			})
			return
		}

		ascendingBool, err := strconv.ParseBool(ascending)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid ascending",
			})
			return
		}

		query, err := course.CreateCourseQuery(
			search,
			currentInt,
			pageSizeInt,
			caseSensitiveBool,
			codeOnlyBool,
			ascendingBool,
		)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		courses, meta, err := db.QueryCourses(query)
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"meta": meta, "body": courses})
	})
}

func RegisterStudents(router *gin.Engine, db *database.DatabaseService) {
	router.GET("/api/students", func(c *gin.Context) {
		name := c.Query("name")
		current := c.Query("current")
		pageSize := c.Query("page_size")

		currentInt, err := strconv.Atoi(current)
		if err != nil {
			c.JSON(400, gin.H{"error": "Invalid current page number"})
			return
		}
		pageSizeInt, err := strconv.Atoi(pageSize)
		if err != nil {
			c.JSON(400, gin.H{"error": "Invalid page size"})
			return
		}

		query, err := student.CreateStudentQuery(
			name,
			currentInt,
			pageSizeInt,
		)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		students, meta, err := db.QueryStudents(query)
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"meta": meta, "body": students})
	})
}

func RegisterCourseAttendees(router *gin.Engine, db *database.DatabaseService) {
	router.GET("/api/courses/:id/attendees", func(c *gin.Context) {
		courseID := c.Param("id")
		current := c.Query("current")
		pageSize := c.Query("page_size")
		ascending := c.Query("ascending")

		courseIDInt, err := strconv.Atoi(courseID)
		if err != nil {
			c.JSON(400, gin.H{"error": "Invalid course ID"})
			return
		}

		currentInt, err := strconv.Atoi(current)
		if err != nil {
			c.JSON(400, gin.H{"error": "Invalid current page number"})
			return
		}
		pageSizeInt, err := strconv.Atoi(pageSize)
		if err != nil {
			c.JSON(400, gin.H{"error": "Invalid page size"})
			return
		}

		ascendingBool, err := strconv.ParseBool(ascending)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid ascending",
			})
			return
		}

		query, err := course.CreateAttendeeQuery(
			courseIDInt,
			currentInt,
			pageSizeInt,
			ascendingBool,
		)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		students, meta, err := db.QueryCourseAttendees(query)
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"meta": meta, "body": students})
	})
}

func RegisterStudentAttendedClasses(router *gin.Engine, db *database.DatabaseService) {
	router.GET("/api/students/:id/attended-classes", func(c *gin.Context) {
		studentID := c.Param("id")
		current := c.Query("current")
		pageSize := c.Query("page_size")
		ascending := c.Query("ascending")

		studentIDInt, err := strconv.Atoi(studentID)
		if err != nil {
			c.JSON(400, gin.H{"error": "Invalid student ID"})
			return
		}

		currentInt, err := strconv.Atoi(current)
		if err != nil {
			c.JSON(400, gin.H{"error": "Invalid current page number"})
			return
		}
		pageSizeInt, err := strconv.Atoi(pageSize)
		if err != nil {
			c.JSON(400, gin.H{"error": "Invalid page size"})
			return
		}

		ascendingBool, err := strconv.ParseBool(ascending)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid ascending",
			})
			return
		}

		query, err := student.CreateAttendedClassesQuery(
			studentIDInt,
			currentInt,
			pageSizeInt,
			ascendingBool,
		)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		courses, meta, err := db.QueryAttendedClasses(query)
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"meta": meta, "body": courses})
	})
}
