import type { CourseResponse, StudentResponse } from './api'

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
): Promise<CourseResponse> {
  const response = await fetch(
    `http://localhost:8080/api/students/${studentID}/attended_classes?current=${current}&page_size=${pageSize}&ascending=${ascending}`
  )
  if (!response.ok) throw new Error(`Attended-course request failed (${response.status})`)
  return response.json()
}