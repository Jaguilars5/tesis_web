export const ABSENCE_TYPE_BASE_URL = "/api/attendance/absence-types/";

export const ABSENCE_TYPE_ENDPOINTS = {
  LIST: ABSENCE_TYPE_BASE_URL,
  CREATE: ABSENCE_TYPE_BASE_URL,
  GET: (id: number) => `${ABSENCE_TYPE_BASE_URL}${id}/`,
  UPDATE: (id: number) => `${ABSENCE_TYPE_BASE_URL}${id}/`,
  SOFT_DELETE: (id: number) => `${ABSENCE_TYPE_BASE_URL}${id}/soft-delete/`,
} as const;

export const ABSENCE_TYPE_PERMISSIONS = {
  GET: "attendance.view_absence_type",
  CREATE: "attendance.create_absence_type",
  UPDATE: "attendance.update_absence_type",
  DELETE: "attendance.delete_absence_type",
} as const;
