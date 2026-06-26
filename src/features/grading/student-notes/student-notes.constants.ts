export const STUDENT_NOTES_BASE_URL = "/api/grading/student-notes/";

export const STUDENT_NOTES_ENDPOINTS = {
  LIST: STUDENT_NOTES_BASE_URL,
  CREATE: STUDENT_NOTES_BASE_URL,
  GET: (id: number) => `${STUDENT_NOTES_BASE_URL}${id}/`,
  UPDATE: (id: number) => `${STUDENT_NOTES_BASE_URL}${id}/`,
  SOFT_DELETE: (id: number) => `${STUDENT_NOTES_BASE_URL}${id}/soft-delete/`,
} as const;

export const STUDENT_NOTES_PERMISSIONS = {
  GET: "grading.view_note",
  CREATE: "grading.create_note",
  UPDATE: "grading.update_note",
  DELETE: "grading.delete_note",
} as const;
