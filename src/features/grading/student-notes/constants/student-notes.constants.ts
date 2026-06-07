export const STUDENT_NOTES_THUNK_PREFIX = "grading";
export const STUDENT_NOTES_ENDPOINTS = { LIST: "/api/grading/student-notes/" } as const;
export const STUDENT_NOTES_THUNKS = {
  FETCH: `${STUDENT_NOTES_THUNK_PREFIX}/fetchStudentNotes`,
  GET: `${STUDENT_NOTES_THUNK_PREFIX}/fetchStudentNote`,
  CREATE: `${STUDENT_NOTES_THUNK_PREFIX}/createStudentNote`,
  UPDATE: `${STUDENT_NOTES_THUNK_PREFIX}/updateStudentNote`,
  DELETE: `${STUDENT_NOTES_THUNK_PREFIX}/deleteStudentNote`,
};
