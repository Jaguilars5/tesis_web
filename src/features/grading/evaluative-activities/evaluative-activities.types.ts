export interface EvaluativeActivityT { id: number; block_component: number; block_component_name: string; teacher_subject_section: number; teacher_subject_section_name: string; title: string; activity_type: number | null; max_score: string; due_date: string; internal_weight: string; is_active: boolean; created_at: string; updated_at: string; }
export type EvaluativeActivityOrderingT = "title" | "-title" | "due_date" | "-due_date";
export interface EvaluativeActivityListParamsT { page?: number; pageSize?: number; search?: string; ordering?: EvaluativeActivityOrderingT; filters?: Record<string, string | number | boolean>; }
export type EvaluativeActivityCreateDataT = Omit<EvaluativeActivityT, "id" | "is_active" | "block_component_name" | "teacher_subject_section_name" | "created_at" | "updated_at">;
export type EvaluativeActivityCreateParamsT = EvaluativeActivityCreateDataT;
export type EvaluativeActivityUpdateDataT = Partial<Omit<EvaluativeActivityT, "id">>;
export interface EvaluativeActivityUpdateParamsT { id: number; data: EvaluativeActivityUpdateDataT; }
export type EvaluativeActivityGetParamsT = number;
export type EvaluativeActivityDeleteParamsT = number;
export interface EvaluativeActivityServiceT { list(p?: EvaluativeActivityListParamsT): Promise<EvaluativeActivityT[]>; get(id: EvaluativeActivityGetParamsT): Promise<EvaluativeActivityT>; create(d: EvaluativeActivityCreateDataT): Promise<EvaluativeActivityT>; update(p: EvaluativeActivityUpdateParamsT): Promise<EvaluativeActivityT>; softDelete(id: EvaluativeActivityDeleteParamsT): Promise<{ id: number }>; }
export interface EvaluativeActivityFormValues { title: string; teacher_subject_section: number; activity_type: number | null; max_score: string; due_date: string; is_active: boolean; block_component: number; internal_weight: string; }
