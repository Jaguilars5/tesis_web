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

export type AbsenceTypeCreateDataT = Omit<AbsenceTypeT, "id" | "is_active" | "created_at" | "updated_at">;
export type AbsenceTypeCreateParamsT = AbsenceTypeCreateDataT;
export type AbsenceTypeUpdateDataT = Partial<Omit<AbsenceTypeT, "id">>;
export interface AbsenceTypeUpdateParamsT { id: number; data: AbsenceTypeUpdateDataT; }
export type AbsenceTypeGetParamsT = number;
export type AbsenceTypeDeleteParamsT = number;

export interface AbsenceTypeServiceT {
  list(params?: AbsenceTypeListParamsT): Promise<AbsenceTypeT[]>;
  get(id: AbsenceTypeGetParamsT): Promise<AbsenceTypeT>;
  create(data: AbsenceTypeCreateDataT): Promise<AbsenceTypeT>;
  update(params: AbsenceTypeUpdateParamsT): Promise<AbsenceTypeT>;
  delete(id: AbsenceTypeDeleteParamsT): Promise<{ id: number }>;
}

export interface AbsenceTypeFormValues {
  code: string;
  name: string;
  description: string;
  is_active: boolean;
}
