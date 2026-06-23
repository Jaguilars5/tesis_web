export interface GradeChangeHistoryT { id: number; student_note: number; student_note_name: string; modified_by_user: number | null; modified_by_user_name: string; created_by: number | null; previous_score: number; new_score: number; reason: string; reason_code: string; origin: string; device_origin: string | null; modified_at: string; created_at: string; updated_at: string; }
export type GradeChangeHistoryOrderingT = "student_note_name" | "-student_note_name" | "modified_by_user_name" | "-modified_by_user_name" | "modified_at" | "-modified_at" | "previous_score" | "-previous_score" | "new_score" | "-new_score";
export interface GradeChangeHistoryListParamsT { page?: number; pageSize?: number; search?: string; ordering?: GradeChangeHistoryOrderingT; }
export type GradeChangeHistoryGetParamsT = number;
export interface GradeHistoryServiceT { list(p?: GradeChangeHistoryListParamsT): Promise<GradeChangeHistoryT[]>; get(id: GradeChangeHistoryGetParamsT): Promise<GradeChangeHistoryT>; }
