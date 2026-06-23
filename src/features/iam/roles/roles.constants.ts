export const ROLE_ENDPOINTS = {
  LIST: "/api/iam/roles/",
  DETAIL: (id: number) => `/api/iam/roles/${id}/`,
  SOFT_DELETE: (id: number) => `/api/iam/roles/${id}/soft-delete/`,
  ASSIGN_PERMISSIONS: (id: number) => `/api/iam/roles/${id}/assign_permissions/`,
  ADD_PERMISSION: (id: number) => `/api/iam/roles/${id}/add-permission/`,
  REMOVE_PERMISSION: (id: number) => `/api/iam/roles/${id}/remove-permission/`,
} as const;

export const ROLE_PERMISSIONS = {
  GET: "iam.view_role",
  CREATE: "iam.create_role",
  UPDATE: "iam.update_role",
  DELETE: "iam.delete_role",
} as const;
