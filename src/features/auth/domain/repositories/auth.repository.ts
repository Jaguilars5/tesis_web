import type { AuthResultT, LoginParamsT } from "../entities/auth.types";

export interface AuthRepositoryT {
  login(credentials: LoginParamsT): Promise<AuthResultT>;
  refreshTokens(refreshToken: string): Promise<AuthResultT>;
  logout(): Promise<void>;
}
