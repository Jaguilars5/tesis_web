import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import { AUTH_ENDPOINTS } from "./auth.constants";
import { tokenManager } from "./auth-token.manager";
import type {
  AuthResponseT,
  AuthResultT,
  LoginParamsT,
  RefreshResponseT,
} from "./auth.types";

const mapLoginResponse = (response: {
  data: { access: string; refresh: string; user: AuthResultT["user"] };
}): AuthResultT => ({
  token: response.data.access,
  user: response.data.user,
});

class AuthService {
  async login(credentials: LoginParamsT): Promise<AuthResultT> {
    try {
      const { data } = await apiClient.post<{
        ok: boolean;
        data: AuthResponseT;
        msg: string;
      }>(AUTH_ENDPOINTS.LOGIN, credentials);
      const result = mapLoginResponse(data);
      tokenManager.setTokens(data.data.access, data.data.refresh);
      return result;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async refreshTokens(refreshToken: string): Promise<AuthResultT> {
    try {
      const { data } = await apiClient.post<{
        ok: boolean;
        data: RefreshResponseT;
        msg: string;
      }>(AUTH_ENDPOINTS.REFRESH, { refresh: refreshToken });
      const result = mapLoginResponse(
        data as unknown as {
          data: { access: string; refresh: string; user: AuthResultT["user"] };
        },
      );
      tokenManager.updateAccessToken(data.data.access);
      return result;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
      tokenManager.clearTokens();
      window.location.href = "/login";
    } finally {
      tokenManager.clearTokens();
    }
  }
}

export const authService = new AuthService();
