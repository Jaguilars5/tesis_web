export const DAY_OF_WEEK_OPTIONS = [
  { label: "Lunes", value: "1" },
  { label: "Martes", value: "2" },
  { label: "Miércoles", value: "3" },
  { label: "Jueves", value: "4" },
  { label: "Viernes", value: "5" },
  { label: "Sábado", value: "6" },
  { label: "Domingo", value: "7" },
] as const;

export const CLASS_SCHEDULE_BASE_URL = "/api/academic/class-schedules/";

export const CLASS_SCHEDULE_ENDPOINTS = {
  GET: (id: number) => `${CLASS_SCHEDULE_BASE_URL}${id}/`,
  LIST: CLASS_SCHEDULE_BASE_URL,
  CREATE: CLASS_SCHEDULE_BASE_URL,
  UPDATE: (id: number) => `${CLASS_SCHEDULE_BASE_URL}${id}/`,
  SOFT_DELETE: (id: number) => `${CLASS_SCHEDULE_BASE_URL}${id}/soft-delete/`,
} as const;

export const CLASS_SCHEDULE_PERMISSIONS = {
  GET: "academic.view_class_schedule",
  CREATE: "academic.create_class_schedule",
  UPDATE: "academic.update_class_schedule",
  DELETE: "academic.delete_class_schedule",
} as const;
