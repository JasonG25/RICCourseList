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
    `http://localhost:8080/api/students?name=${encodeURIComponent(name)}&current=${current}&page_size=${pageSize}&ascending=${ascending}`
  )
  if (!response.ok) throw new Error(`Student request failed (${response.status})`)
  return response.json()
}

export async function fetchStudentAttendedCourses(
  studentID: number,
  current: number,
  pageSize: number,
  ascending: boolean
): Promise<import('./courses').CourseResponse> {
  const response = await fetch(
    `http://localhost:8080/api/students/${studentID}/attended_classes?current=${current}&page_size=${pageSize}&ascending=${ascending}`
  )
  if (!response.ok) throw new Error(`Attended-course request failed (${response.status})`)
  return response.json()
}