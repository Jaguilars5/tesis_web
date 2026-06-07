export const SECTION_THUNK_PREFIX = "institutions";

export const SECTION_ENDPOINTS = {
  LIST: "/api/institutions/section/",
} as const;

export const SECTION_THUNKS = {
  FETCH: `${SECTION_THUNK_PREFIX}/fetchSections`,
  GET: `${SECTION_THUNK_PREFIX}/fetchSection`,
  CREATE: `${SECTION_THUNK_PREFIX}/createSection`,
  UPDATE: `${SECTION_THUNK_PREFIX}/updateSection`,
  DELETE: `${SECTION_THUNK_PREFIX}/deleteSection`,
};
