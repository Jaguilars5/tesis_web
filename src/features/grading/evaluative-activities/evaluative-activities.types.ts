import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";

export interface EvaluativeActivityT {
  id: number;
  block_component: number;
  block_component_name: string;
  teacher_subject_section: number;
  teacher_subject_section_name: string;
  title: string;
  activity_type: number | null;
  max_score: string;
  due_date: string;
  internal_weight: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type EvaluativeActivityOrderingT = "title" | "-title" | "due_date" | "-due_date";

export interface EvaluativeActivityListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: EvaluativeActivityOrderingT;
  filters?: {
    teacher_subject_section?: number;
    academic_period?: number;
  };
}

export type EvaluativeActivityCreateParamsT = Omit<EvaluativeActivityT, "id" | "is_active" | "block_component_name" | "teacher_subject_section_name" | "created_at" | "updated_at">;
export type EvaluativeActivityUpdateDataT = Partial<EvaluativeActivityCreateParamsT>;
export interface EvaluativeActivityUpdateParamsT {
  id: number;
  data: EvaluativeActivityUpdateDataT;
}
export interface EvaluativeActivityGetParamsT {
  id: number;
}
export interface EvaluativeActivityDeleteParamsT {
  id: number;
  confirm?: boolean;
}

export interface EvaluativeActivityServiceT {
  list(params?: EvaluativeActivityListParamsT): Promise<EvaluativeActivityT[]>;
  get(params: EvaluativeActivityGetParamsT): Promise<EvaluativeActivityT>;
  create(params: EvaluativeActivityCreateParamsT): Promise<EvaluativeActivityT>;
  update(params: EvaluativeActivityUpdateParamsT): Promise<EvaluativeActivityT>;
  softDelete(params: EvaluativeActivityDeleteParamsT): Promise<SoftDeleteResponseT>;
}

export interface EvaluativeActivityFormValues {
  title: string;
  teacher_subject_section: number;
  activity_type: number | null;
  max_score: string;
  due_date: string;
  block_component: number;
  internal_weight: string;
}
