import type { RecoveryProcessTypeT } from "../entities/recovery-process-types.types";
export interface RecoveryProcessTypeListParamsT { page?: number; pageSize?: number; }
export interface RecoveryProcessTypeRepositoryT {
  list(params?: RecoveryProcessTypeListParamsT): Promise<RecoveryProcessTypeT[]>;
  get(id: number): Promise<RecoveryProcessTypeT>;
  create(data: Omit<RecoveryProcessTypeT, "id" | "is_active" | "created_at" | "updated_at">): Promise<RecoveryProcessTypeT>;
  update(id: number, data: Partial<RecoveryProcessTypeT>): Promise<RecoveryProcessTypeT>;
  softDelete(id: number): Promise<RecoveryProcessTypeT>;
}
