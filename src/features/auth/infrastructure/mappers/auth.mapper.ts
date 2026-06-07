import type { AuthResponseT, AuthResultT, AuthUserT, RefreshResponseT } from "../../domain/entities/auth.types";
import type { ResponseApi } from "@shared/types/api.response.types";

export const mapLoginResponse = (response: ResponseApi<AuthResponseT>): AuthResultT => ({
  token: response.data.access,
  user: response.data.user,
});

export const mapRefreshResponse = (response: ResponseApi<RefreshResponseT>): AuthResultT => ({
  token: response.data.access,
  user: response.data.user,
});

export const mapUserResponse = (data: AuthUserT): AuthUserT => data;
