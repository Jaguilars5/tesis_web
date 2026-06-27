import type { PaginatedResult } from "@shared/types/api.response.types";
import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";

export interface EvaluationBlockT {
  id: number;
  code: string;
  academic_period: number;
  academic_period_name: string;
  subject_offering: number;
  subject_offering_name: string;
  name: string;
  block_type: string | null;
  weight_percentage: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type EvaluationBlockOrderingT =
  | "name" | "-name"
  | "weight_percentage" | "-weight_percentage"
  | "block_type" | "-block_type";

export interface EvaluationBlockListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: EvaluationBlockOrderingT;
  filters?: {
    academic_period?: number;
    subject_offering?: number;
    block_type?: string;
    is_active?: boolean;
  };
}

export interface EvaluationBlockFormValues {
  code: string;
  name: string;
  weight_percentage: number;
  academic_period: number;
  subject_offering: number;
  block_type: string | null;
}

export type EvaluationBlockCreateParamsT = EvaluationBlockFormValues;
export type EvaluationBlockUpdateDataT = Partial<EvaluationBlockFormValues>;
export interface EvaluationBlockUpdateParamsT {
  id: number;
  data: EvaluationBlockUpdateDataT;
}
export interface EvaluationBlockGetParamsT {
  id: number;
}
export interface EvaluationBlockDeleteParamsT {
  id: number;
  confirm?: boolean;
}

export interface EvaluationBlockServiceT {
  list(params?: EvaluationBlockListParamsT): Promise<PaginatedResult<EvaluationBlockT>>;
  get(params: EvaluationBlockGetParamsT): Promise<EvaluationBlockT>;
  create(params: EvaluationBlockCreateParamsT): Promise<EvaluationBlockT>;
  update(params: EvaluationBlockUpdateParamsT): Promise<EvaluationBlockT>;
  softDelete(params: EvaluationBlockDeleteParamsT): Promise<SoftDeleteResponseT>;
}
