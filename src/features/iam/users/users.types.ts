import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";

export interface UserT {
  id: number;
  username: string;
  dni: string;
  names: string;
  last_names: string;
  email: string;
  role: string | null;
  role_id: number | null;
  is_active: boolean;
  created_at: string;
}

export type UserOrderingT = "username" | "-username" | "created_at" | "-created_at";

export interface UserListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: UserOrderingT;
  filters?: Record<string, string | number | boolean>;
}

export interface UserCreateDataT {
  document_number: string;
  names: string;
  last_names: string;
  email: string;
  password: string;
  role_id: number;
}

export type UserCreateParamsT = UserCreateDataT;

export type UserUpdateDataT = Partial<{
  email: string;
  role_id: number;
}>;

export interface UserUpdateParamsT {
  id: number;
  data: UserUpdateDataT;
}

export interface UserGetParamsT {
  id: number;
}

export interface UserDeleteParamsT {
  id: number;
  confirm?: boolean;
}

export interface UserServiceT {
  list(params?: UserListParamsT): Promise<UserT[]>;
  get(params: UserGetParamsT): Promise<UserT>;
  create(data: UserCreateDataT): Promise<UserT>;
  update(params: UserUpdateParamsT): Promise<UserT>;
  softDelete(params: UserDeleteParamsT): Promise<SoftDeleteResponseT>;
}

export interface UserCreateFormValues {
  document_number: string;
  names: string;
  last_names: string;
  email: string;
  password: string;
  role_id: number;
}

export interface UserEditFormValues {
  email: string;
  role_id: number;
}
