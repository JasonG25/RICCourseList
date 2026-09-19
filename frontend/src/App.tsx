import { useEffect, useState } from 'react'
import {
  fetchCourseAttendees,
  fetchCourses,
  type Course,
  type Student,
} from './api/courses'
import {
  fetchStudentAttendedCourses,
  fetchStudents,
} from './api/students'
import './App.css'

type Language = 'en' | 'zh'
type Theme = 'light' | 'dark'

interface Settings {
  pageSize: number
  courseAscending: boolean
  studentAscending: boolean
  caseSensitive: boolean
  codeOnly: boolean
  language: Language
  theme: Theme
}

const defaultSettings: Settings = {
  pageSize: 12,
  courseAscending: true,
  studentAscending: true,
  caseSensitive: false,
  codeOnly: false,
  language: 'en',
  theme: 'light',
}

const copy = {
  en: {
    brand: 'RIC Course List',
    eyebrow: 'Academic directory',
    title: 'Find the right course, faster.',
    subtitle: 'Browse course availability, filter by student, and explore every class roster.',
    studentFilter: 'Student filter',
    chooseStudent: 'Choose a student',
    searchStudents: 'Search students by name',
    allCourses: 'View all courses',
    selected: 'Selected',
    reset: 'Reset view',
    courseSearch: 'Course search',
    searchCourses: 'Search by code or course name',
    results: 'results',
    result: 'result',
    courses: 'courses',
    course: 'course',
    selectedStudent: 'Selected student',
    takes: 'takes',
    settings: 'Settings',
    close: 'Close',
    pageSize: 'Page size',
    sort: 'Sort',
    ascending: 'Ascending',
    descending: 'Descending',
    caseSensitive: 'Case sensitive',
    codeOnly: 'Code only',
    appearance: 'Appearance',
    light: 'Light',
    dark: 'Dark',
    language: 'Language',
    english: 'English',
    chinese: '中文',
    courseDetails: 'Course details',
    attendees: 'Attendees',
    capacity: 'capacity',
    enrolled: 'enrolled',
    seatsLeft: 'seats left',
    noCourses: 'No courses found',
    noCoursesHint: 'Try a different search or reset the current filters.',
    noStudents: 'No students found',
    loading: 'Loading…',
    unable: 'Unable to load data',
    retry: 'Try again',
    page: 'Page',
    of: 'of',
    previous: 'Previous',
    next: 'Next',
    noAttendees: 'No attendees found for this course.',
    closePanel: 'Close settings',
    openPanel: 'Open settings',
  },
  zh: {
    brand: 'RIC 课程列表',
    eyebrow: '学术目录',
    title: '更快找到合适的课程。',
    subtitle: '浏览课程信息，按学生筛选，并查看每门课的学生名单。',
    studentFilter: '学生筛选',
    chooseStudent: '选择学生',
    searchStudents: '按姓名搜索学生',
    allCourses: '查看所有课程',
    selected: '已选择',
    reset: '重置视图',
    courseSearch: '课程搜索',
    searchCourses: '按课程代码或名称搜索',
    results: '条结果',
    result: '条结果',
    courses: '门课程',
    course: '门课程',
    selectedStudent: '已选择学生',
    takes: '修读',
    settings: '设置',
    close: '关闭',
    pageSize: '每页数量',
    sort: '排序',
    ascending: '升序',
    descending: '降序',
    caseSensitive: '区分大小写',
    codeOnly: '仅搜索课程代码',
    appearance: '外观',
    light: '浅色',
    dark: '深色',
    language: '语言',
    english: 'English',
    chinese: '中文',
    courseDetails: '课程详情',
    attendees: '选课学生',
    capacity: '容量',
    enrolled: '已选',
    seatsLeft: '剩余名额',
    noCourses: '没有找到课程',
    noCoursesHint: '请尝试其他关键词，或重置当前筛选条件。',
    noStudents: '没有找到学生',
    loading: '加载中…',
    unable: '数据加载失败',
    retry: '重试',
    page: '第',
    of: '页，共',
    previous: '上一页',
    next: '下一页',
    noAttendees: '这门课程暂时没有选课学生。',
    closePanel: '关闭设置',
    openPanel: '打开设置',
  },
} as const

type Copy = (typeof copy)[Language]

function getStoredSettings(): Settings {
  try {
    const stored = localStorage.getItem('ric-course-settings')
    if (!stored) return defaultSettings
    return { ...defaultSettings, ...JSON.parse(stored) } as Settings
  } catch {
    return defaultSettings
  }
}

function Pagination({
  page,
  totalPages,
  onChange,
  text,
}: {
  page: number
  totalPages: number
  onChange: (page: number) => void
  text: Copy
}) {
  if (totalPages <= 1) return null
  return (
    <nav className="pagination" aria-label="Pagination">
      <button type="button" onClick={() => onChange(page - 1)} disabled={page === 1}>
        ← <span>{text.previous}</span>
      </button>
      <span className="page-indicator">
        {text.page} {page} {text.of} {totalPages}
      </span>
      <button type="button" onClick={() => onChange(page + 1)} disabled={page === totalPages}>
        <span>{text.next}</span> →
      </button>
    </nav>
  )
}

function SortControl({
  ascending,
  onChange,
  text,
}: {
  ascending: boolean
  onChange: () => void
  text: Copy
}) {
  return (
    <button
      type="button"
      className="sort-control"
      onClick={onChange}
      aria-label={ascending ? text.descending : text.ascending}
      title={ascending ? text.descending : text.ascending}
    >
      <span className="sort-arrows">{ascending ? '↑↓' : '↓↑'}</span>
      {ascending ? text.ascending : text.descending}
    </button>
  )
}

function App() {
  const [settings, setSettings] = useState<Settings>(getStoredSettings)
  const text = copy[settings.language]
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [studentPanelOpen, setStudentPanelOpen] = useState(false)
  const [studentQuery, setStudentQuery] = useState('')
  const [studentPage, setStudentPage] = useState(1)
  const [students, setStudents] = useState<Student[]>([])
  const [studentTotal, setStudentTotal] = useState(0)
  const [studentPages, setStudentPages] = useState(0)
  const [studentLoading, setStudentLoading] = useState(false)
  const [studentError, setStudentError] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [courseQuery, setCourseQuery] = useState('')
  const [coursePage, setCoursePage] = useState(1)
  const [courses, setCourses] = useState<Course[]>([])
  const [courseTotal, setCourseTotal] = useState(0)
  const [coursePages, setCoursePages] = useState(0)
  const [courseLoading, setCourseLoading] = useState(false)
  const [courseError, setCourseError] = useState(false)
  const [activeCourse, setActiveCourse] = useState<Course | null>(null)
  const [attendees, setAttendees] = useState<Student[]>([])
  const [attendeePage, setAttendeePage] = useState(1)
  const [attendeeTotal, setAttendeeTotal] = useState(0)
  const [attendeePages, setAttendeePages] = useState(0)
  const [attendeeLoading, setAttendeeLoading] = useState(false)
  const [attendeeError, setAttendeeError] = useState(false)

  useEffect(() => {
    localStorage.setItem('ric-course-settings', JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    let cancelled = false
    const loadStudents = async () => {
      setStudentLoading(true)
      setStudentError(false)
      try {
        const response = await fetchStudents(studentQuery, studentPage, settings.studentAscending, settings.pageSize)
        if (cancelled) return
        setStudents(response.body)
        setStudentTotal(response.meta.total_count)
        setStudentPages(response.meta.number_of_pages)
      } catch {
        if (!cancelled) setStudentError(true)
      } finally {
        if (!cancelled) setStudentLoading(false)
      }
    }
    void loadStudents()
    return () => {
      cancelled = true
    }
  }, [studentQuery, studentPage, settings.pageSize, settings.studentAscending])

  useEffect(() => {
    let cancelled = false
    const loadCourses = async () => {
      setCourseLoading(true)
      setCourseError(false)
      try {
        const response = selectedStudent
          ? await fetchStudentAttendedCourses(
              selectedStudent.id,
              coursePage,
              settings.pageSize,
              settings.courseAscending,
            )
          : await fetchCourses(
              courseQuery,
              coursePage,
              settings.pageSize,
              settings.caseSensitive,
              settings.codeOnly,
              settings.courseAscending,
            )
        if (cancelled) return
        setCourses(response.body)
        setCourseTotal(response.meta.total_count)
        setCoursePages(response.meta.number_of_pages)
      } catch {
        if (!cancelled) setCourseError(true)
      } finally {
        if (!cancelled) setCourseLoading(false)
      }
    }
    void loadCourses()
    return () => {
      cancelled = true
    }
  }, [
    selectedStudent,
    courseQuery,
    coursePage,
    settings.pageSize,
    settings.caseSensitive,
    settings.codeOnly,
    settings.courseAscending,
  ])

  useEffect(() => {
    if (!activeCourse) return
    let cancelled = false
    const loadAttendees = async () => {
      setAttendeeLoading(true)
      setAttendeeError(false)
      try {
        const response = await fetchCourseAttendees(
          activeCourse.id,
          attendeePage,
          settings.pageSize,
          settings.studentAscending,
        )
        if (cancelled) return
        setAttendees(response.body)
        setAttendeeTotal(response.meta.total_count)
        setAttendeePages(response.meta.number_of_pages)
      } catch {
        if (!cancelled) setAttendeeError(true)
      } finally {
        if (!cancelled) setAttendeeLoading(false)
      }
    }
    void loadAttendees()
    return () => {
      cancelled = true
    }
  }, [activeCourse, attendeePage, settings.pageSize, settings.studentAscending])

  const updateSettings = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    if (key === 'pageSize') {
      setStudentPage(1)
      setCoursePage(1)
      setAttendeePage(1)
    }
    setSettings((current) => ({ ...current, [key]: value }))
  }

  const selectStudent = (student: Student | null) => {
    setSelectedStudent(student)
    setCoursePage(1)
    setCourseQuery('')
    setStudentPanelOpen(false)
  }

  const resetView = () => {
    setSelectedStudent(null)
    setCourseQuery('')
    setCoursePage(1)
    setStudentQuery('')
    setStudentPage(1)
    setStudentPanelOpen(false)
  }

  const openCourse = (course: Course) => {
    setActiveCourse(course)
    setAttendeePage(1)
  }

  const availableSeats = (course: Course) => Math.max(course.capacity - course.number_of_students, 0)
  const countLabel = courseTotal === 1 ? text.result : text.results

  return (
    <div className={`app theme-${settings.theme}`}>
      <header className="topbar">
        <a className="brand" href="/" aria-label={text.brand}>
          <span className="brand-mark">R</span>
          <span>{text.brand}</span>
        </a>
        <div className="topbar-actions">
          <span className="live-dot"><i /> {settings.language === 'zh' ? '实时目录' : 'Live directory'}</span>
          <button
            type="button"
            className="icon-button settings-trigger"
            onClick={() => setSettingsOpen(true)}
            aria-label={text.openPanel}
            title={text.openPanel}
          >
            <span>☷</span>
          </button>
        </div>
      </header>

      <main className="page-shell">
        <section className="intro">
          <div>
            <p className="eyebrow">{text.eyebrow}</p>
            <h1>{text.title}</h1>
            <p className="subtitle">{text.subtitle}</p>
          </div>
          <div className="intro-stat">
            <strong>{courseTotal.toLocaleString()}</strong>
            <span>{selectedStudent ? text.courses : countLabel}</span>
          </div>
        </section>

        <section className="control-card">
          <div className="control-row student-row">
            <div className="field-group student-field">
              <label htmlFor="student-search">{text.studentFilter}</label>
              <div className="input-with-icon">
                <span className="field-icon">⌕</span>
                <input
                  id="student-search"
                  value={studentQuery}
                  onFocus={() => setStudentPanelOpen(true)}
                  onChange={(event) => {
                    setStudentQuery(event.target.value)
                    setStudentPage(1)
                    setSelectedStudent(null)
                    setCoursePage(1)
                  }}
                  placeholder={selectedStudent ? selectedStudent.name : text.searchStudents}
                  aria-expanded={studentPanelOpen}
                  aria-controls="student-results"
                />
                {selectedStudent && (
                  <button type="button" className="clear-input" onClick={() => selectStudent(null)} aria-label={text.reset}>×</button>
                )}
              </div>
              {selectedStudent && (
                <div className="selected-pill">
                  <span className="pill-dot" />
                  {text.selectedStudent}: <strong>{selectedStudent.name}</strong>
                </div>
              )}
              {studentPanelOpen && (
                <div className="dropdown-panel" id="student-results">
                  <button type="button" className={`all-courses-option ${selectedStudent === null ? 'active' : ''}`} onClick={() => selectStudent(null)}>
                    <span className="option-icon">⌘</span>
                    <span>
                      <strong>{text.allCourses}</strong>
                      <small>{text.reset}</small>
                    </span>
                    {selectedStudent === null && <b>✓</b>}
                  </button>
                  <div className="dropdown-divider" />
                  {studentLoading && <div className="dropdown-message">{text.loading}</div>}
                  {studentError && (
                    <div className="dropdown-message error-message">
                      {text.unable} <button type="button" onClick={() => setStudentPage(studentPage)}>{text.retry}</button>
                    </div>
                  )}
                  {!studentLoading && !studentError && students.length === 0 && (
                    <div className="dropdown-message">{text.noStudents}</div>
                  )}
                  {!studentLoading && !studentError && students.map((student) => (
                    <button
                      type="button"
                      className="student-option"
                      key={student.id}
                      onClick={() => selectStudent(student)}
                    >
                      <span className="avatar">{student.name.charAt(0).toUpperCase()}</span>
                      <span><strong>{student.name}</strong><small>ID · {student.id}</small></span>
                      {selectedStudent?.id === student.id && <b>✓</b>}
                    </button>
                  ))}
                  <div className="dropdown-footer">
                    <span>{studentTotal.toLocaleString()} {settings.language === 'zh' ? '名学生' : 'students'}</span>
                    <Pagination page={studentPage} totalPages={studentPages} onChange={setStudentPage} text={text} />
                  </div>
                </div>
              )}
            </div>
            <div className="row-divider" />
            <div className="sort-block">
              <span className="control-label">{text.sort}</span>
              <SortControl
                ascending={settings.studentAscending}
                onChange={() => {
                  updateSettings('studentAscending', !settings.studentAscending)
                  setStudentPage(1)
                }}
                text={text}
              />
            </div>
            <button type="button" className="reset-button" onClick={resetView}>↺ {text.reset}</button>
          </div>

          <div className="control-row course-row">
            <div className="field-group course-field">
              <label htmlFor="course-search">{text.courseSearch}</label>
              <div className="course-search-line">
                <div className="input-with-icon course-input">
                  <span className="field-icon">⌕</span>
                  <input
                    id="course-search"
                    value={courseQuery}
                    onChange={(event) => {
                      setCourseQuery(event.target.value)
                      setCoursePage(1)
                    }}
                    placeholder={text.searchCourses}
                    disabled={Boolean(selectedStudent)}
                  />
                  {courseQuery && !selectedStudent && (
                    <button type="button" className="clear-input" onClick={() => { setCourseQuery(''); setCoursePage(1) }} aria-label={text.reset}>×</button>
                  )}
                </div>
                <SortControl
                  ascending={settings.courseAscending}
                  onChange={() => {
                    updateSettings('courseAscending', !settings.courseAscending)
                    setCoursePage(1)
                  }}
                  text={text}
                />
              </div>
              <div className="search-footnote">
                <span>{courseTotal.toLocaleString()} {countLabel}</span>
                {selectedStudent && <span className="disabled-note">{settings.language === 'zh' ? '已选择学生，课程搜索已关闭' : 'Course search is disabled while a student is selected'}</span>}
              </div>
            </div>
            <div className="search-options">
              <label className={`toggle-label ${selectedStudent ? 'is-disabled' : ''}`}>
                <input
                  type="checkbox"
                  checked={settings.caseSensitive}
                  disabled={Boolean(selectedStudent)}
                  onChange={(event) => { updateSettings('caseSensitive', event.target.checked); setCoursePage(1) }}
                />
                <span className="toggle" /><span>{text.caseSensitive}</span>
              </label>
              <label className={`toggle-label ${selectedStudent ? 'is-disabled' : ''}`}>
                <input
                  type="checkbox"
                  checked={settings.codeOnly}
                  disabled={Boolean(selectedStudent)}
                  onChange={(event) => { updateSettings('codeOnly', event.target.checked); setCoursePage(1) }}
                />
                <span className="toggle" /><span>{text.codeOnly}</span>
              </label>
            </div>
          </div>
        </section>

        {courseError && (
          <div className="alert error-message">{text.unable}. <button type="button" onClick={() => setCoursePage(coursePage)}>{text.retry}</button></div>
        )}
        {courseLoading ? (
          <div className="course-grid loading-grid" aria-live="polite">
            {Array.from({ length: 6 }, (_, index) => <div className="course-skeleton" key={index} />)}
          </div>
        ) : courses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">⌁</div>
            <h2>{text.noCourses}</h2>
            <p>{text.noCoursesHint}</p>
          </div>
        ) : (
          <div className="course-grid">
            {courses.map((course, index) => (
              <button type="button" className="course-card" key={course.id} onClick={() => openCourse(course)}>
                <div className="course-card-top">
                  <span className="course-index">{String(index + 1 + (coursePage - 1) * settings.pageSize).padStart(2, '0')}</span>
                  <span className="course-code">{course.code}</span>
                  <span className="open-arrow">↗</span>
                </div>
                <div className="course-card-main">
                  <h2>{course.name}</h2>
                  <div className="enrollment-bar"><span style={{ width: `${Math.min((course.number_of_students / Math.max(course.capacity, 1)) * 100, 100)}%` }} /></div>
                  <div className="course-stats">
                    <span><strong>{course.number_of_students}</strong> {text.enrolled}</span>
                    <span><strong>{availableSeats(course)}</strong> {text.seatsLeft}</span>
                  </div>
                </div>
                <div className="course-card-bottom">
                  <span>{text.capacity} {course.capacity}</span>
                  <span className={availableSeats(course) === 0 ? 'full-label' : ''}>{availableSeats(course) === 0 ? (settings.language === 'zh' ? '已满' : 'Full') : (settings.language === 'zh' ? '有空位' : 'Available')}</span>
                </div>
              </button>
            ))}
          </div>
        )}
        <Pagination page={coursePage} totalPages={coursePages} onChange={setCoursePage} text={text} />
      </main>

      {settingsOpen && (
        <div className="drawer-backdrop" onMouseDown={() => setSettingsOpen(false)}>
          <aside className="settings-drawer" onMouseDown={(event) => event.stopPropagation()} aria-label={text.settings}>
            <div className="drawer-header">
              <div><p className="eyebrow">{text.settings}</p><h2>{settings.language === 'zh' ? '调整你的浏览体验' : 'Tune your browsing experience'}</h2></div>
              <button type="button" className="icon-button" onClick={() => setSettingsOpen(false)} aria-label={text.close}>×</button>
            </div>
            <div className="drawer-content">
              <section className="setting-section">
                <h3>{text.pageSize}</h3>
                <div className="range-value"><strong>{settings.pageSize}</strong><span>{settings.language === 'zh' ? '每页' : 'per page'}</span></div>
                <input type="range" min="5" max="100" step="1" value={settings.pageSize} onChange={(event) => updateSettings('pageSize', Number(event.target.value))} />
                <div className="range-labels"><span>5</span><span>100</span></div>
              </section>
              <section className="setting-section">
                <h3>{text.appearance}</h3>
                <div className="segmented-control">
                  <button type="button" className={settings.theme === 'light' ? 'active' : ''} onClick={() => updateSettings('theme', 'light')}>☼ {text.light}</button>
                  <button type="button" className={settings.theme === 'dark' ? 'active' : ''} onClick={() => updateSettings('theme', 'dark')}>◐ {text.dark}</button>
                </div>
              </section>
              <section className="setting-section">
                <h3>{text.language}</h3>
                <div className="segmented-control">
                  <button type="button" className={settings.language === 'en' ? 'active' : ''} onClick={() => updateSettings('language', 'en')}>EN {text.english}</button>
                  <button type="button" className={settings.language === 'zh' ? 'active' : ''} onClick={() => updateSettings('language', 'zh')}>中 {text.chinese}</button>
                </div>
              </section>
              <div className="drawer-note">
                <span>⌘</span>
                <p>{settings.language === 'zh' ? '你的偏好会保存在此浏览器中。' : 'Your preferences are saved in this browser.'}</p>
              </div>
            </div>
          </aside>
        </div>
      )}

      {activeCourse && (
        <div className="modal-backdrop" onMouseDown={() => setActiveCourse(null)}>
          <section className="course-modal" onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={text.courseDetails}>
            <div className="modal-header">
              <div>
                <span className="course-code modal-code">{activeCourse.code}</span>
                <h2>{activeCourse.name}</h2>
                <p>{activeCourse.number_of_students} {text.enrolled} · {activeCourse.capacity} {text.capacity}</p>
              </div>
              <button type="button" className="icon-button" onClick={() => setActiveCourse(null)} aria-label={text.close}>×</button>
            </div>
            <div className="modal-summary">
              <div><span>{text.enrolled}</span><strong>{activeCourse.number_of_students}</strong></div>
              <div><span>{text.seatsLeft}</span><strong>{availableSeats(activeCourse)}</strong></div>
              <div><span>{text.capacity}</span><strong>{activeCourse.capacity}</strong></div>
            </div>
            <div className="attendee-heading"><h3>{text.attendees}</h3><span>{attendeeTotal} {settings.language === 'zh' ? '人' : 'people'}</span></div>
            {attendeeError && <div className="alert error-message">{text.unable}. <button type="button" onClick={() => setAttendeePage(attendeePage)}>{text.retry}</button></div>}
            {attendeeLoading ? <div className="attendee-loading">{text.loading}</div> : attendees.length === 0 ? <div className="modal-empty">{text.noAttendees}</div> : (
              <div className="attendee-list">
                {attendees.map((attendee, index) => (
                  <div className="attendee" key={attendee.id}>
                    <span className="avatar">{attendee.name.charAt(0).toUpperCase()}</span>
                    <span><strong>{attendee.name}</strong><small>ID · {attendee.id}</small></span>
                    <span className="attendee-number">{String(index + 1 + (attendeePage - 1) * settings.pageSize).padStart(2, '0')}</span>
                  </div>
                ))}
              </div>
            )}
            <Pagination page={attendeePage} totalPages={attendeePages} onChange={setAttendeePage} text={text} />
          </section>
        </div>
      )}
    </div>
  )
}

export default App