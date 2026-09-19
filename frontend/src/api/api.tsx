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