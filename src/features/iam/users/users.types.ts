export interface UserT {
  id: number;
  username: string;
  dni: string;
  names: string;
  last_names: string;
  email: string;
  role: number;
  role_name?: string;
  is_active: boolean;
  created_at: string;
}

export type UserOrderingT = "username" | "-username" | "created_at" | "-created_at";

export interface UserListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: UserOrderingT;
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
  is_active: boolean;
}>;

export interface UserUpdateParamsT { id: number; data: UserUpdateDataT; }
export type UserGetParamsT = number;
export type UserDeleteParamsT = number;

export interface UserServiceT {
  list(params?: UserListParamsT): Promise<UserT[]>;
  get(id: UserGetParamsT): Promise<UserT>;
  create(data: UserCreateDataT): Promise<UserT>;
  update(params: UserUpdateParamsT): Promise<UserT>;
  softDelete(id: UserDeleteParamsT): Promise<{ id: number }>;
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
  is_active: boolean;
}
