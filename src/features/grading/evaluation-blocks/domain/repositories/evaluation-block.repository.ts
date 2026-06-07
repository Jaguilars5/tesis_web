import type { EvaluationBlockT } from "../entities/evaluation-block.types";

export interface EvaluationBlockRepositoryT {
  list(): Promise<EvaluationBlockT[]>;
  get(id: number): Promise<EvaluationBlockT>;
  create(data: Omit<EvaluationBlockT, "id" | "is_active" | "academic_period_name">): Promise<EvaluationBlockT>;
  update(id: number, data: Partial<EvaluationBlockT>): Promise<EvaluationBlockT>;
  softDelete(id: number): Promise<EvaluationBlockT>;
}
