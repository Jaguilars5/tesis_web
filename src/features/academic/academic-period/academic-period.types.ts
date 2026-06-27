import type { PaginatedResult } from "@shared/types/api.response.types";
import type { SoftDeleteParamsT, SoftDeleteResponseT } from "@shared/types/soft-delete.types";

export interface AcademicPeriodT {
  id: number;
  code: string;
  name: string;
  period_type: number;
  period_type_name: string;
  start_date: string;
  end_date: string;
  year_weight: number | null;
  is_regular_period: boolean;
  school_year: number;
  school_year_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AcademicPeriodFormValues {
  code: string;
  name: string;
  period_type: number;
  start_date: string;
  end_date: string;
  year_weight: number | null;
  is_regular_period: boolean;
  school_year: number;
  is_active: boolean;
}

export type AcademicPeriodOrderingT =
  | "name"
  | "-name"
  | "start_date"
  | "-start_date"
  | "end_date"
  | "-end_date"
  | "year_weight"
  | "-year_weight";

export interface AcademicPeriodListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  filters?: {
    school_year?: number;
    period_type?: number;
  };
  ordering?: AcademicPeriodOrderingT;
}

export type AcademicPeriodCreateParamsT = AcademicPeriodFormValues;

export type AcademicPeriodUpdateDataT = Partial<AcademicPeriodFormValues>;

export interface AcademicPeriodUpdateParamsT {
  id: number;
  data: AcademicPeriodUpdateDataT;
}

export interface AcademicPeriodGetParamsT {
  id: number;
}

export type AcademicPeriodDeleteParamsT = SoftDeleteParamsT;

export interface BulkCreatePeriodErrorT {
  index: number;
  errors: Record<string, string>;
}

export interface BulkCreateResponseT {
  created: AcademicPeriodT[];
  errors: BulkCreatePeriodErrorT[];
}

export interface AcademicPeriodServiceT {
  list(params?: AcademicPeriodListParamsT): Promise<PaginatedResult<AcademicPeriodT>>;
  get(params: AcademicPeriodGetParamsT): Promise<AcademicPeriodT>;
  create(params: AcademicPeriodCreateParamsT): Promise<AcademicPeriodT>;
  update(params: AcademicPeriodUpdateParamsT): Promise<AcademicPeriodT>;
  bulkCreate(periods: AcademicPeriodCreateParamsT[]): Promise<BulkCreateResponseT>;
  softDelete(params: AcademicPeriodDeleteParamsT): Promise<SoftDeleteResponseT>;
}
