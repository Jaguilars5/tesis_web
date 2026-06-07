import type { EvaluationTypeT } from "../entities/evaluation-types.types";
export interface EvaluationTypeListParamsT { page?: number; pageSize?: number; }
export interface EvaluationTypeRepositoryT {
  list(params?: EvaluationTypeListParamsT): Promise<EvaluationTypeT[]>;
  get(id: number): Promise<EvaluationTypeT>;
  create(data: Omit<EvaluationTypeT, "id" | "is_active" | "created_at" | "updated_at">): Promise<EvaluationTypeT>;
  update(id: number, data: Partial<EvaluationTypeT>): Promise<EvaluationTypeT>;
  softDelete(id: number): Promise<EvaluationTypeT>;
}
