import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";

export interface PermissionT {
  id: number;
  code: string;
  description: string;
  module: string;
  created_at: string;
  updated_at: string;
}

export type PermissionOrderingT = "code" | "-code" | "module" | "-module" | "created_at" | "-created_at";

export interface PermissionListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: PermissionOrderingT;
  filters?: Record<string, string | number | boolean>;
}

export type PermissionCreateDataT = Omit<PermissionT, "id" | "created_at" | "updated_at">;
export type PermissionCreateParamsT = PermissionCreateDataT;
export type PermissionUpdateDataT = Partial<PermissionCreateDataT>;

export interface PermissionUpdateParamsT {
  id: number;
  data: PermissionUpdateDataT;
}

export interface PermissionGetParamsT {
  id: number;
}

export interface PermissionDeleteParamsT {
  id: number;
  confirm?: boolean;
}

export interface PermissionServiceT {
  list(params?: PermissionListParamsT): Promise<PermissionT[]>;
  get(params: PermissionGetParamsT): Promise<PermissionT>;
  create(data: PermissionCreateDataT): Promise<PermissionT>;
  update(params: PermissionUpdateParamsT): Promise<PermissionT>;
  softDelete(params: PermissionDeleteParamsT): Promise<SoftDeleteResponseT>;
}

export interface PermissionFormValues {
  code: string;
  description: string;
  module: string;
}
