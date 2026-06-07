import type { RecoveryProcessT } from "../entities/recovery-processes.types";

export interface RecoveryProcessListParamsT {
  page?: number;
  pageSize?: number;
}

export interface RecoveryProcessRepositoryT {
  list(params?: RecoveryProcessListParamsT): Promise<RecoveryProcessT[]>;
  get(id: number): Promise<RecoveryProcessT>;
  create(data: Omit<RecoveryProcessT, "id" | "period_grade_summary_name" | "managed_by_user_name">): Promise<RecoveryProcessT>;
  update(id: number, data: Partial<RecoveryProcessT>): Promise<RecoveryProcessT>;
  delete(id: number): Promise<void>;
}
