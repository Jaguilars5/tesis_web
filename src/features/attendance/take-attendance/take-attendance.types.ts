import type { ClassScheduleT } from "@features/academic/class-schedule";
import type { AttendanceT } from "@features/attendance/attendance";

export interface RosterEntryT {
  enrollmentId: number;
  studentName: string;
  attendanceId: number | null;
  attendanceStatusId: number | null;
  absenceTypeId: number | null;
  observation: string;
}

export interface TakeAttendanceStateT {
  teacherSubjectSectionId: number | null;
  academicPeriodId: number | null;
  attendanceDate: string;
  schedules: ClassScheduleT[];
  allowedDays: number[];
  /** Bloque horario seleccionado (cuando hay varios el mismo día). */
  selectedScheduleId: number | null;
  loadingSchedule: boolean;
  roster: RosterEntryT[];
  loadingRoster: boolean;
  saving: boolean;
  loaded: boolean;
  error: string | null;
  success: boolean;
}

/** Estudiante devuelto por el endpoint `take_by_schedule`. */
export interface ScheduleStudentT {
  enrollment_id: number;
  student_id: number;
  student_name: string;
  attendance: AttendanceT | null;
}

/** Respuesta del endpoint `take_by_schedule`. */
export interface TakeByScheduleResponseT {
  class_schedule: {
    id: number;
    day_of_week: number;
    start_time: string;
    end_time: string;
  };
  date: string;
  students: ScheduleStudentT[];
}

export interface BatchAttendanceRecordT {
  enrollment: number;
  teacher_subject_section: number;
  academic_period: number;
  attendance_date: string;
  attendance_status: number;
  absence_type: number | null;
  observation: string;
}

/** Un registro dentro del payload de `take_by_schedule` (POST). */
export interface TakeByScheduleRecordT {
  enrollment: number;
  attendance_status: number;
  absence_type: number | null;
  observation: string;
}

/** Payload de guardado de asistencia por horario. */
export interface TakeByScheduleSavePayloadT {
  class_schedule_id: number;
  date: string;
  academic_period: number;
  teacher_subject_section: number;
  records: TakeByScheduleRecordT[];
}

/** Error individual devuelto por el backend en guardados parciales. */
export interface AttendanceSaveErrorT {
  index: number;
  error: string;
  record: unknown;
}

/**
 * Resultado del POST `take_by_schedule`. Si todo salió bien es un arreglo de
 * asistencias; si algunos fallaron, el backend devuelve `{ created, errors }`.
 */
export type TakeByScheduleSaveResultT =
  | AttendanceT[]
  | { created: AttendanceT[]; errors: AttendanceSaveErrorT[] };
