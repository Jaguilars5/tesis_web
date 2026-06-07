import type { EvaluationTypeRepositoryT } from "../../domain/repositories/evaluation-types.repository";
import type { EvaluationTypeT } from "../../domain/entities/evaluation-types.types";

export const createEvaluationTypeUseCase = async (
  repository: EvaluationTypeRepositoryT,
  data: Omit<EvaluationTypeT, "id" | "is_active" | "created_at" | "updated_at">,
): Promise<EvaluationTypeT> => {
  return repository.create(data);
};
