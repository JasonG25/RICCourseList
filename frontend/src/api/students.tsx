export interface Student {
  id: number
  name: string
}

export interface StudentResponse {
  body: Student[]
  meta: {
    total_count: number
    number_of_pages: number
  }
}

export async function fetchStudents(
  name: string,
  current: number,
  ascending: boolean,
  pageSize: number
): Promise<StudentResponse> {
  const response = await fetch(
    `http://localhost:8080/api/students?name=${name}&current=${current}&page_size=${pageSize}&ascending=${ascending}`
  )
  return response.json()
}

export async function fetchStudentAttendedCourses(
  studentID: number,
  current: number,
  pageSize: number,
  ascending: boolean
): Promise<StudentResponse> {
  const response = await fetch(
    `http://localhost:8080/api/students/${studentID}/attended_classes?current=${current}&page_size=${pageSize}&ascending=${ascending}`
  )
  return response.json()
}