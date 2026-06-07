import type { EvaluationBlockT } from "../../domain/entities/evaluation-block.types";
import { evaluationBlockApiRepository } from "../../infrastructure/repositories/evaluation-block-api.repository";

export const updateEvaluationBlockUseCase = async (
  id: number,
  data: Partial<EvaluationBlockT>,
): Promise<EvaluationBlockT> => {
  return evaluationBlockApiRepository.update(id, data);
};
