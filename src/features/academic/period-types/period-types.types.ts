export interface PeriodTypeT {
  id: number;
  code: string;
  name: string;
  description: string;
  divisions_per_year: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PeriodTypeFormValues {
  code: string;
  name: string;
  description: string;
  divisions_per_year: number;
  is_active: boolean;
}

export type PeriodTypeOrderingT = "name" | "-name" | "code" | "-code";

export interface PeriodTypeListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: PeriodTypeOrderingT;
}

export type PeriodTypeCreateParamsT = PeriodTypeFormValues;

export type PeriodTypeUpdateDataT = Partial<PeriodTypeFormValues>;

export interface PeriodTypeUpdateParamsT {
  id: number;
  data: PeriodTypeUpdateDataT;
}

export interface PeriodTypeGetParamsT {
  id: number;
}

import type { SoftDeleteParamsT, SoftDeleteResponseT } from "@shared/types/soft-delete.types";
import type { PaginatedResult } from "@shared/types/api.response.types";

export type PeriodTypeDeleteParamsT = SoftDeleteParamsT;

export interface PeriodTypeServiceT {
  list(params?: PeriodTypeListParamsT): Promise<PaginatedResult<PeriodTypeT>>;
  get(params: PeriodTypeGetParamsT): Promise<PeriodTypeT>;
  create(params: PeriodTypeCreateParamsT): Promise<PeriodTypeT>;
  update(params: PeriodTypeUpdateParamsT): Promise<PeriodTypeT>;
  softDelete(params: PeriodTypeDeleteParamsT): Promise<SoftDeleteResponseT>;
}
