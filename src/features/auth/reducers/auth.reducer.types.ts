import type { RequestStatusT } from "@shared/types/commonTypes";
import type { AuthUserT } from "../domain/entities/auth.types";

export interface AuthStateT {
  user: AuthUserT | null;
  isAuthenticated: boolean;
  status: RequestStatusT;
  error: string | null;
  isInitializing: boolean;
}
