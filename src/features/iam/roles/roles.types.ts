import type { PermissionT } from "../permission/permission.types";

export interface RolePermissionT {
  id: number;
  role: number;
  permission: PermissionT;
  permission_code?: string;
}

export interface RoleT {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  role_permissions?: RolePermissionT[];
}

export type RoleOrderingT = "name" | "-name" | "created_at" | "-created_at";

export interface RoleListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: RoleOrderingT;
  filters?: Record<string, string | number | boolean>;
}

export type RoleCreateDataT = Omit<RoleT, "id" | "is_active" | "created_at" | "role_permissions">;
export type RoleCreateParamsT = RoleCreateDataT;
export type RoleUpdateDataT = Partial<Omit<RoleT, "id">>;
export interface RoleUpdateParamsT { id: number; data: RoleUpdateDataT; }
export type RoleGetParamsT = number;
export type RoleDeleteParamsT = number;

export interface RoleServiceT {
  list(params?: RoleListParamsT): Promise<RoleT[]>;
  get(id: RoleGetParamsT): Promise<RoleT>;
  create(data: RoleCreateDataT): Promise<RoleT>;
  update(params: RoleUpdateParamsT): Promise<RoleT>;
  softDelete(id: RoleDeleteParamsT): Promise<{ id: number }>;
}

export interface RoleFormValues {
  name: string;
  description: string;
  is_active: boolean;
}

export interface RoleAssignPermissionsDataT {
  permission_codes: string[];
}
