import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";

export interface IncidentTypeT {
  id: number;
  code: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type IncidentTypeOrderingT = "name" | "-name" | "code" | "-code";

export interface IncidentTypeListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: IncidentTypeOrderingT;
}

export interface IncidentTypeFormValues {
  code: string;
  name: string;
  description: string;
}

export type IncidentTypeCreateParamsT = IncidentTypeFormValues;
export type IncidentTypeUpdateDataT = Partial<IncidentTypeFormValues>;
export interface IncidentTypeUpdateParamsT {
  id: number;
  data: IncidentTypeUpdateDataT;
}
export interface IncidentTypeGetParamsT {
  id: number;
}
export interface IncidentTypeDeleteParamsT {
  id: number;
  confirm?: boolean;
}

export interface IncidentTypeServiceT {
  list(params?: IncidentTypeListParamsT): Promise<IncidentTypeT[]>;
  get(params: IncidentTypeGetParamsT): Promise<IncidentTypeT>;
  create(params: IncidentTypeCreateParamsT): Promise<IncidentTypeT>;
  update(params: IncidentTypeUpdateParamsT): Promise<IncidentTypeT>;
  softDelete(params: IncidentTypeDeleteParamsT): Promise<SoftDeleteResponseT>;
}
