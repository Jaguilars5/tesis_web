import type { PaginatedResult } from "@shared/types/api.response.types";

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
  absence_type_name: string | null;
  class_schedule: number | null;
  class_schedule_name: string | null;
  attendance_date: string;
  observation: string;
  uuid: string;
  sync_status: string | null;
  sync_version: number;
  synced_at: string | null;
  device_origin: string | null;
  conflict_resolved: boolean | null;
  conflict_notes: string | null;
  created_at: string;
  updated_at: string;
}

export type AttendanceOrderingT =
  | "attendance_date"
  | "-attendance_date"
  | "created_at"
  | "-created_at";

export interface AttendanceListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: AttendanceOrderingT;
  filters?: {
    enrollment?: number;
    teacher_subject_section?: number;
    attendance_date?: string;
    attendance_date_after?: string;
    attendance_date_before?: string;
    academic_period?: number;
    attendance_status?: number;
    absence_type?: number;
  };
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

export type AttendanceCreateParamsT = Omit<AttendanceT, "id" | "enrollment_name" | "teacher_subject_section_name" | "academic_period_name" | "attendance_status_name" | "absence_type_name" | "class_schedule" | "class_schedule_name" | "uuid" | "sync_status" | "sync_version" | "synced_at" | "device_origin" | "conflict_resolved" | "conflict_notes" | "created_at" | "updated_at">;
export type AttendanceUpdateDataT = Partial<Omit<AttendanceT, "id" | "uuid" | "sync_status" | "sync_version" | "synced_at" | "device_origin" | "conflict_resolved" | "conflict_notes" | "created_at" | "updated_at">>;
export interface AttendanceUpdateParamsT { id: number; data: AttendanceUpdateDataT; }
export interface AttendanceGetParamsT { id: number; }

export interface AttendanceServiceT {
  list(params?: AttendanceListParamsT): Promise<PaginatedResult<AttendanceT>>;
  get(params: AttendanceGetParamsT): Promise<AttendanceT>;
  create(params: AttendanceCreateParamsT): Promise<AttendanceT>;
  update(params: AttendanceUpdateParamsT): Promise<AttendanceT>;
}
