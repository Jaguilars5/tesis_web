import type { PeriodTypeT } from "../entities/period-types.types";
export interface PeriodTypeListParamsT { page?: number; pageSize?: number; }
export interface PeriodTypeRepositoryT {
  list(params?: PeriodTypeListParamsT): Promise<PeriodTypeT[]>;
  get(id: number): Promise<PeriodTypeT>;
  create(data: Omit<PeriodTypeT, "id" | "is_active">): Promise<PeriodTypeT>;
  update(id: number, data: Partial<PeriodTypeT>): Promise<PeriodTypeT>;
  softDelete(id: number): Promise<PeriodTypeT>;
}
