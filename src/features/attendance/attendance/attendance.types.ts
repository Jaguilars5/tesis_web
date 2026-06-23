export interface AttendanceT {
  id: number;
  enrollment: number;
  enrollment_name: string;
  teacher_subject_section: number;
  teacher_subject_section_name: string;
  academic_period: number;
  academic_period_name: string;
  attendance_status: number;
  attendance_status_name: string;
  absence_type: number | null;
  attendance_date: string;
  observation: string;
  uuid: string;
  sync_version: number;
  created_at: string;
  updated_at: string;
}

export type AttendanceOrderingT = "attendance_date" | "-attendance_date";

export interface AttendanceListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: AttendanceOrderingT;
}

export type AttendanceCreateDataT = Omit<AttendanceT, "id" | "enrollment_name" | "teacher_subject_section_name" | "academic_period_name" | "attendance_status_name" | "uuid" | "sync_version" | "created_at" | "updated_at">;
export type AttendanceCreateParamsT = AttendanceCreateDataT;
export type AttendanceUpdateDataT = Partial<Omit<AttendanceT, "id" | "uuid" | "sync_version" | "created_at" | "updated_at">>;
export interface AttendanceUpdateParamsT { id: number; data: AttendanceUpdateDataT; }
export type AttendanceGetParamsT = number;

export interface AttendanceServiceT {
  list(params?: AttendanceListParamsT): Promise<AttendanceT[]>;
  get(id: AttendanceGetParamsT): Promise<AttendanceT>;
  create(data: AttendanceCreateDataT): Promise<AttendanceT>;
  update(params: AttendanceUpdateParamsT): Promise<AttendanceT>;
}

export interface AttendanceFormValues {
  enrollment: number | null;
  teacher_subject_section: number | null;
  academic_period: number | null;
  attendance_status: number | null;
  absence_type: number | null;
  attendance_date: string;
  observation: string;
}
