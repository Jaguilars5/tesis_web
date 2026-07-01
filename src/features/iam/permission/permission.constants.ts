export const PERMISSION_BASE_URL = "/api/iam/permissions/";

export const PERMISSION_ENDPOINTS = {
  LIST: PERMISSION_BASE_URL,
  CREATE: PERMISSION_BASE_URL,
  GET: (id: number) => `${PERMISSION_BASE_URL}${id}/`,
  UPDATE: (id: number) => `${PERMISSION_BASE_URL}${id}/`,
} as const;

export const PERMISSION_PERMISSIONS = {
  GET: "iam.view_permission",
  CREATE: "iam.create_permission",
  UPDATE: "iam.update_permission",
} as const;
