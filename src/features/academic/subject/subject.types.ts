export interface SubjectT {
  id: number;
  name: string;
  code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubjectFormValues {
  name: string;
  code: string;
  is_active: boolean;
}

export type SubjectOrderingT = "name" | "-name" | "code" | "-code";

export interface SubjectListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: SubjectOrderingT;
}

export type SubjectCreateParamsT = SubjectFormValues;

export type SubjectUpdateDataT = Partial<SubjectFormValues>;

export interface SubjectUpdateParamsT {
  id: number;
  data: SubjectUpdateDataT;
}

export interface SubjectGetParamsT {
  id: number;
}

import type { PaginatedResult } from "@shared/types/api.response.types";
import type { SoftDeleteParamsT, SoftDeleteResponseT } from "@shared/types/soft-delete.types";

export type SubjectDeleteParamsT = SoftDeleteParamsT;

export interface SubjectServiceT {
  list(params?: SubjectListParamsT): Promise<PaginatedResult<SubjectT>>;
  get(params: SubjectGetParamsT): Promise<SubjectT>;
  create(params: SubjectCreateParamsT): Promise<SubjectT>;
  update(params: SubjectUpdateParamsT): Promise<SubjectT>;
  softDelete(params: SubjectDeleteParamsT): Promise<SoftDeleteResponseT>;
}
