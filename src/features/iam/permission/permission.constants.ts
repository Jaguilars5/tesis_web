export const PERMISSION_ENDPOINTS = {
  LIST: "/api/iam/permissions/",
  DETAIL: (id: number) => `/api/iam/permissions/${id}/`,
} as const;

export const PERMISSION_PERMISSIONS = {
  GET: "iam.view_permission",
  CREATE: "iam.create_permission",
  UPDATE: "iam.update_permission",
  DELETE: "iam.delete_permission",
} as const;
