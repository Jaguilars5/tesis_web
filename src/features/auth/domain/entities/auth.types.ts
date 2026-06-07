import type { UserRoleEnum } from "../../constants/auth.constants";

export type UserRoleT = (typeof UserRoleEnum)[keyof typeof UserRoleEnum];

export interface AuthUserT {
  id: number;
  username: string;
  dni: string;
  names: string;
  last_names: string;
  email: string;
  role: UserRoleT;
  role_id: number;
  is_active: boolean;
  permissions: string[];
}

export interface AuthResultT {
  token: string;
  user: AuthUserT;
}

export interface LoginParamsT {
  username: string;
  password: string;
}

export interface AuthResponseT {
  access: string;
  refresh: string;
  user: AuthUserT;
}

export interface RefreshParamsT {
  refresh: string;
}

export interface RefreshResponseT {
  access: string;
  user: AuthUserT;
}

export interface AppJwtPayloadT {
  exp?: number;
  iat?: number;
  email?: string;
  name?: string;
  fullName?: string;
  username?: string;
  role?: UserRoleT;
  sub?: string;
  dni?: string;
  last_names?: string;
  role_id?: number;
  institution?: string;
  institution_id?: number;
}
