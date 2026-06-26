import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";

export interface StudentNoteT {
  id: number;
  enrollment: number;
  enrollment_name: string;
  evaluative_activity: number;
  evaluative_activity_title: string;
  grading_mode: string;
  numeric_score: number | null;
  qualitative_scale: number | null;
  qualitative_scale_name: string;
  manually_overridden: boolean;
  teacher_observation: string;
  created_by: number | null;
  modified_by: number | null;
  sync_status: string;
  created_at: string;
  updated_at: string;
}

export type StudentNoteOrderingT =
  | "enrollment_name"
  | "-enrollment_name"
  | "evaluative_activity_title"
  | "-evaluative_activity_title"
  | "numeric_score"
  | "-numeric_score"
  | "created_at"
  | "-created_at";

export interface StudentNoteListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: StudentNoteOrderingT;
  filters?: Record<string, string | number | boolean>;
}

export type StudentNoteCreateDataT = Omit<
  StudentNoteT,
  "id" | "manually_overridden" | "sync_status" | "enrollment_name" | "evaluative_activity_title" | "qualitative_scale_name" | "created_by" | "modified_by" | "created_at" | "updated_at"
>;

export type StudentNoteCreateParamsT = StudentNoteCreateDataT;

export type StudentNoteUpdateDataT = Partial<StudentNoteCreateDataT>;

export interface StudentNoteUpdateParamsT {
  id: number;
  data: StudentNoteUpdateDataT;
}

export interface StudentNoteGetParamsT {
  id: number;
}

export interface StudentNoteDeleteParamsT {
  id: number;
  confirm?: boolean;
}

export interface StudentNoteServiceT {
  list(params?: StudentNoteListParamsT): Promise<StudentNoteT[]>;
  get(params: StudentNoteGetParamsT): Promise<StudentNoteT>;
  create(data: StudentNoteCreateDataT): Promise<StudentNoteT>;
  update(params: StudentNoteUpdateParamsT): Promise<StudentNoteT>;
  softDelete(params: StudentNoteDeleteParamsT): Promise<SoftDeleteResponseT>;
}

export interface StudentNoteFormValues {
  enrollment: number | "";
  evaluative_activity: number | "";
  grading_mode: string;
  numeric_score: number | null;
  qualitative_scale: number | "";
  teacher_observation: string;
}
