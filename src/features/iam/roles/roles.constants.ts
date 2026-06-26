export const ROLE_BASE_URL = "/api/iam/roles/";

export const ROLE_ENDPOINTS = {
  LIST: ROLE_BASE_URL,
  CREATE: ROLE_BASE_URL,
  GET: (id: number) => `${ROLE_BASE_URL}${id}/`,
  UPDATE: (id: number) => `${ROLE_BASE_URL}${id}/`,
  SOFT_DELETE: (id: number) => `${ROLE_BASE_URL}${id}/soft-delete/`,
  ASSIGN_PERMISSIONS: (id: number) => `${ROLE_BASE_URL}${id}/assign_permissions/`,
  ADD_PERMISSION: (id: number) => `${ROLE_BASE_URL}${id}/add-permission/`,
  REMOVE_PERMISSION: (id: number) => `${ROLE_BASE_URL}${id}/remove-permission/`,
} as const;

export const ROLE_PERMISSIONS = {
  GET: "iam.view_role",
  CREATE: "iam.create_role",
  UPDATE: "iam.update_role",
  DELETE: "iam.delete_role",
} as const;
