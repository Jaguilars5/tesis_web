export const USER_BASE_URL = "/api/iam/users/";

export const USER_ENDPOINTS = {
  LIST: USER_BASE_URL,
  CREATE: USER_BASE_URL,
  GET: (id: number) => `${USER_BASE_URL}${id}/`,
  UPDATE: (id: number) => `${USER_BASE_URL}${id}/`,
  SOFT_DELETE: (id: number) => `${USER_BASE_URL}${id}/soft-delete/`,
  CHANGE_PASSWORD: (id: number) => `${USER_BASE_URL}${id}/change-password/`,
  PERMISSIONS: (id: number) => `${USER_BASE_URL}${id}/permissions/`,
  SEARCH: `${USER_BASE_URL}search/`,
  TEACHERS: `${USER_BASE_URL}teachers/`,
  STUDENTS: `${USER_BASE_URL}students/`,
  REPRESENTATIVES: `${USER_BASE_URL}representatives/`,
} as const;

export const USER_PERMISSIONS = {
  GET: "iam.view_user",
  CREATE: "iam.create_user",
  UPDATE: "iam.update_user",
  DELETE: "iam.delete_user",
} as const;
