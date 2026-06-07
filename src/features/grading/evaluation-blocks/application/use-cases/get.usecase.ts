import type { EvaluationBlockT } from "../../domain/entities/evaluation-block.types";
import { evaluationBlockApiRepository } from "../../infrastructure/repositories/evaluation-block-api.repository";

export const getEvaluationBlockUseCase = async (id: number): Promise<EvaluationBlockT> => {
  return evaluationBlockApiRepository.get(id);
};
