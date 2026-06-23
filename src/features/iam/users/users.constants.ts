export const USER_ENDPOINTS = {
  LIST: "/api/iam/users/",
  DETAIL: (id: number) => `/api/iam/users/${id}/`,
  CHANGE_PASSWORD: (id: number) => `/api/iam/users/${id}/change-password/`,
  PERMISSIONS: (id: number) => `/api/iam/users/${id}/permissions/`,
  SEARCH: "/api/iam/users/search/",
  TEACHERS: "/api/iam/users/teachers/",
  STUDENTS: "/api/iam/users/students/",
  REPRESENTATIVES: "/api/iam/users/representatives/",
} as const;

export const USER_PERMISSIONS = {
  GET: "iam.view_user",
  CREATE: "iam.create_user",
  UPDATE: "iam.update_user",
  DELETE: "iam.delete_user",
} as const;
