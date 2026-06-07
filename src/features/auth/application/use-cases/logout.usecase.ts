import { authApiRepository } from "../../infrastructure/repositories/auth-api.repository";

export const logoutUseCase = async (): Promise<void> => {
  await authApiRepository.logout();
};
