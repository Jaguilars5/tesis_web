export const SPECIAL_NEEDS_TYPE_ENDPOINTS = {
  LIST: "/api/students/special-needs-types/",
  DETAIL: (id: number) => `/api/students/special-needs-types/${id}/`,
} as const;

export const SPECIAL_NEEDS_TYPE_PERMISSIONS = {
  GET: "students.view_special_needs_type",
} as const;
