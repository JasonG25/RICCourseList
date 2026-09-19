export interface Course {
  id: number
  code: string
  name: string
  capacity: number
  number_of_students: number
}

export interface CourseResponse {
  body: Course[]
  meta: {
    total_count: number
    number_of_pages: number
  }
}

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

export async function fetchCourses(
  search: string,
  current: number,
  pageSize: number,
  caseSensitive: boolean,
  codeOnly: boolean,
  ascending: boolean
): Promise<CourseResponse> {
  const response = await fetch(
    `http://localhost:8080/api/courses?search=${encodeURIComponent(search)}&current=${current}&page_size=${pageSize}&case_sensitive=${caseSensitive}&code_only=${codeOnly}&ascending=${ascending}`
  )
  if (!response.ok) throw new Error(`Course request failed (${response.status})`)
  return response.json()
}

export async function fetchCourseAttendees(
  courseID: number,
  current: number,
  pageSize: number,
  ascending: boolean
): Promise<StudentResponse> {
  const response = await fetch(
    `http://localhost:8080/api/courses/${courseID}/attendees?current=${current}&page_size=${pageSize}&ascending=${ascending}`
  )
  if (!response.ok) throw new Error(`Attendee request failed (${response.status})`)
  return response.json()
}