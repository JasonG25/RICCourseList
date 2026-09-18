package main

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/guozi/RICCourseList/database"
	webservice "github.com/guozi/RICCourseList/webService"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		panic(err)
	}

	router := gin.Default()

	router.Use(cors.Default())

	router.GET("/api/hello", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Hello from Go backend!",
		})
	})

	db, err := database.ConnectToDatabase()
	if err != nil {
		panic(err)
	}
	defer db.Close()

	webservice.RegisterCourses(router, db)
	webservice.RegisterStudents(router, db)

	webservice.RegisterCourseAttendees(router, db)
	webservice.RegisterStudentAttendedClasses(router, db)

	router.Run(":8080")
}
