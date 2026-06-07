import type { AuthResultT } from "../../domain/entities/auth.types";
import { authApiRepository } from "../../infrastructure/repositories/auth-api.repository";
import { tokenManager } from "../../infrastructure/repositories/auth-token.repository";

export const refreshSessionUseCase = async (): Promise<AuthResultT> => {
  const refreshToken = tokenManager.getRefreshToken();
  if (!refreshToken) {
    throw new Error("No hay refresh token disponible");
  }
  return authApiRepository.refreshTokens(refreshToken);
};
