import type { CourseResponse, StudentResponse } from "./api"

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