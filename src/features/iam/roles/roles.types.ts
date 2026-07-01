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
export type RoleUpdateDataT = Partial<RoleCreateDataT>;

export interface RoleUpdateParamsT {
  id: number;
  data: RoleUpdateDataT;
}

export interface RoleGetParamsT {
  id: number;
}

export interface RoleServiceT {
  list(params?: RoleListParamsT): Promise<RoleT[]>;
  get(params: RoleGetParamsT): Promise<RoleT>;
  create(data: RoleCreateDataT): Promise<RoleT>;
  update(params: RoleUpdateParamsT): Promise<RoleT>;
}

export interface RoleFormValues {
  name: string;
  description: string;
}

export interface RoleAssignPermissionsDataT {
  permission_codes: string[];
}
