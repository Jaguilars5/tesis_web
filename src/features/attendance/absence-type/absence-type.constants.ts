export const ABSENCE_TYPE_ENDPOINTS = {
  LIST: "/api/attendance/absence-types/",
  DETAIL: (id: number) => `/api/attendance/absence-types/${id}/`,
} as const;

export const ABSENCE_TYPE_PERMISSIONS = {
  GET: "attendance.view_absence_type",
  CREATE: "attendance.create_absence_type",
  UPDATE: "attendance.update_absence_type",
  DELETE: "attendance.delete_absence_type",
} as const;
