import type { AuthResultT, LoginParamsT } from "../../domain/entities/auth.types";
import { authApiRepository } from "../../infrastructure/repositories/auth-api.repository";

export const loginUseCase = async (
  credentials: LoginParamsT,
): Promise<AuthResultT> => {
  return authApiRepository.login(credentials);
};
