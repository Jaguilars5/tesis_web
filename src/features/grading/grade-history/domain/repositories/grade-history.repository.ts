import type { GradeChangeHistoryT } from "../entities/grade-history.types";
export interface GradeChangeHistoryListParamsT { page?: number; pageSize?: number; }
export interface GradeChangeHistoryRepositoryT {
  list(params?: GradeChangeHistoryListParamsT): Promise<GradeChangeHistoryT[]>;
  get(id: number): Promise<GradeChangeHistoryT>;
}
