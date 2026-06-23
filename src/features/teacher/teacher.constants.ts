export const TEACHER_ENDPOINTS = {
  SCHEDULE: "/api/academic/class-schedule/",
  ACTIVITIES: "/api/grading/evaluative-activities/",
  GRADES: "/api/grading/student-notes/",
  TSS: "/api/academic/teacher-subject-section/",
  ENROLLMENTS: "/api/students/enrollments/by-section/",
} as const;

export const TEACHER_PERMISSIONS = {
  VIEW_SCHEDULE: null,
  VIEW_ACTIVITY: "grading.view_evaluative_activity",
  VIEW_NOTE: "grading.view_note",
  CREATE_NOTE: "grading.create_note",
} as const;
