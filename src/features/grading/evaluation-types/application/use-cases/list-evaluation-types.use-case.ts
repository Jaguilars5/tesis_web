import type { EvaluationTypeRepositoryT } from "../../domain/repositories/evaluation-types.repository";
import type { EvaluationTypeT } from "../../domain/entities/evaluation-types.types";

export const listEvaluationTypesUseCase = async (
  repository: EvaluationTypeRepositoryT,
  params?: { page?: number; pageSize?: number },
): Promise<EvaluationTypeT[]> => {
  return repository.list(params);
};
