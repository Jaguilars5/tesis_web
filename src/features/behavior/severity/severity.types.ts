import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";

export interface SeverityT {
  id: number;
  code: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type SeverityOrderingT = "name" | "-name" | "code" | "-code";

export interface SeverityListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: SeverityOrderingT;
}

export interface SeverityFormValues {
  code: string;
  name: string;
  description: string;
}

export type SeverityCreateParamsT = SeverityFormValues;
export type SeverityUpdateDataT = Partial<SeverityFormValues>;
export interface SeverityUpdateParamsT {
  id: number;
  data: SeverityUpdateDataT;
}
export interface SeverityGetParamsT {
  id: number;
}
export interface SeverityDeleteParamsT {
  id: number;
  confirm?: boolean;
}

export interface SeverityServiceT {
  list(params?: SeverityListParamsT): Promise<SeverityT[]>;
  get(params: SeverityGetParamsT): Promise<SeverityT>;
  create(params: SeverityCreateParamsT): Promise<SeverityT>;
  update(params: SeverityUpdateParamsT): Promise<SeverityT>;
  softDelete(params: SeverityDeleteParamsT): Promise<SoftDeleteResponseT>;
}
