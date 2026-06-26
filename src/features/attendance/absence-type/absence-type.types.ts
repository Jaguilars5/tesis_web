import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";

export interface AbsenceTypeT {
  id: number;
  code: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type AbsenceTypeOrderingT = "name" | "-name" | "code" | "-code";

export interface AbsenceTypeListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: AbsenceTypeOrderingT;
}

export interface AbsenceTypeFormValues {
  code: string;
  name: string;
  description: string;
}

export type AbsenceTypeCreateParamsT = AbsenceTypeFormValues;
export type AbsenceTypeUpdateDataT = Partial<AbsenceTypeFormValues>;
export interface AbsenceTypeUpdateParamsT {
  id: number;
  data: AbsenceTypeUpdateDataT;
}
export interface AbsenceTypeGetParamsT {
  id: number;
}
export interface AbsenceTypeDeleteParamsT {
  id: number;
  confirm?: boolean;
}

export interface AbsenceTypeServiceT {
  list(params?: AbsenceTypeListParamsT): Promise<AbsenceTypeT[]>;
  get(params: AbsenceTypeGetParamsT): Promise<AbsenceTypeT>;
  create(params: AbsenceTypeCreateParamsT): Promise<AbsenceTypeT>;
  update(params: AbsenceTypeUpdateParamsT): Promise<AbsenceTypeT>;
  softDelete(params: AbsenceTypeDeleteParamsT): Promise<SoftDeleteResponseT>;
}
