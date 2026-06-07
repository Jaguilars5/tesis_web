import type { EvaluationTypeRepositoryT } from "../../domain/repositories/evaluation-types.repository";
import type { EvaluationTypeT } from "../../domain/entities/evaluation-types.types";

export const getEvaluationTypeUseCase = async (
  repository: EvaluationTypeRepositoryT,
  id: number,
): Promise<EvaluationTypeT> => {
  return repository.get(id);
};
