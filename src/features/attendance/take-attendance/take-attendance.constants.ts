export const TAKE_ATTENDANCE_BASE_URL = "/api/attendance/attendances/";

export const TAKE_ATTENDANCE_ENDPOINTS = {
  BATCH: `${TAKE_ATTENDANCE_BASE_URL}batch/`,
  GET_ROSTER: (classScheduleId: number, date: string) =>
    TAKE_ATTENDANCE_BASE_URL + `take_by_schedule/?class_schedule_id=${classScheduleId}&date=${date}`,
  SAVE_ROSTER: TAKE_ATTENDANCE_BASE_URL + "take_by_schedule/",
} as const;

export const TAKE_ATTENDANCE_PERMISSIONS = {
  GET: "attendance.view_attendance",
  CREATE: "attendance.create_attendance",
  UPDATE: "attendance.update_attendance",
  DELETE: "attendance.delete_attendance",
} as const;
