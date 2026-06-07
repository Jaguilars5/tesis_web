export const PROJECT_NOTES_THUNK_PREFIX = "grading";
export const PROJECT_NOTES_ENDPOINTS = { LIST: "/api/grading/project-notes/" } as const;
export const PROJECT_NOTES_THUNKS = {
  FETCH: `${PROJECT_NOTES_THUNK_PREFIX}/fetchProjectNotes`,
  GET: `${PROJECT_NOTES_THUNK_PREFIX}/fetchProjectNote`,
  CREATE: `${PROJECT_NOTES_THUNK_PREFIX}/createProjectNote`,
  UPDATE: `${PROJECT_NOTES_THUNK_PREFIX}/updateProjectNote`,
  DELETE: `${PROJECT_NOTES_THUNK_PREFIX}/deleteProjectNote`,
};
