export const TEACHER_SUBJECT_SECTION_ENDPOINTS = { LIST: "/api/academic/teacher-subject-section/" } as const;

export const TEACHER_SUBJECT_SECTION_THUNKS = {
  FETCH: "academic/fetchTeacherSubjectSections",
  CREATE: "academic/createTeacherSubjectSection",
  UPDATE: "academic/updateTeacherSubjectSection",
  DELETE: "academic/deleteTeacherSubjectSection",
} as const;
