import type { EvaluationTypeRepositoryT } from "../../domain/repositories/evaluation-types.repository";
import type { EvaluationTypeT } from "../../domain/entities/evaluation-types.types";

export const updateEvaluationTypeUseCase = async (
  repository: EvaluationTypeRepositoryT,
  id: number,
  data: Partial<EvaluationTypeT>,
): Promise<EvaluationTypeT> => {
  return repository.update(id, data);
};
