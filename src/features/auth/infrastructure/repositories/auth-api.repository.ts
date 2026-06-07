import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { ResponseApi } from "@shared/types/api.response.types";
import { AUTH_ENDPOINTS } from "../../constants/auth.constants";
import type { AuthRepositoryT } from "../../domain/repositories/auth.repository";
import type { AuthResponseT, LoginParamsT, RefreshResponseT } from "../../domain/entities/auth.types";
import { mapLoginResponse, mapRefreshResponse } from "../mappers/auth.mapper";
import { tokenManager } from "./auth-token.repository";

export const authApiRepository: AuthRepositoryT = {
  async login(credentials: LoginParamsT) {
    try {
      const { data } = await apiClient.post<ResponseApi<AuthResponseT>>(
        AUTH_ENDPOINTS.LOGIN,
        credentials,
      );
      const result = mapLoginResponse(data);
      tokenManager.setTokens(data.data.access, data.data.refresh);
      return result;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async refreshTokens(refreshToken: string) {
    try {
      const { data } = await apiClient.post<ResponseApi<RefreshResponseT>>(
        AUTH_ENDPOINTS.REFRESH,
        { refresh: refreshToken },
      );
      const result = mapRefreshResponse(data);
      tokenManager.updateAccessToken(data.data.access);
      return result;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async logout() {
    try {
      await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
    } finally {
      tokenManager.clearTokens();
    }
  },
};
