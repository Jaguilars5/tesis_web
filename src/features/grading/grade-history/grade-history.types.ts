import type { PaginatedResult } from "@shared/types/api.response.types";

export interface GradeChangeHistoryT {
  id: number;
  student_note: number;
  student_note_name: string;
  modified_by_user: number | null;
  modified_by_user_name: string;
  created_by: number | null;
  updated_by: number | null;
  previous_score: number;
  new_score: number;
  previous_qualitative: number | null;
  new_qualitative: number | null;
  reason: string;
  reason_code: string;
  origin: string;
  device_origin: string | null;
  modified_at: string;
  created_at: string;
  updated_at: string;
}

export type GradeChangeHistoryOrderingT =
  | "modified_at" | "-modified_at"
  | "previous_score" | "-previous_score"
  | "new_score" | "-new_score";

export interface GradeChangeHistoryListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: GradeChangeHistoryOrderingT;
}

export interface GradeChangeHistoryGetParamsT {
  id: number;
}

export interface GradeHistoryServiceT {
  list(params?: GradeChangeHistoryListParamsT): Promise<PaginatedResult<GradeChangeHistoryT>>;
  get(params: GradeChangeHistoryGetParamsT): Promise<GradeChangeHistoryT>;
}
