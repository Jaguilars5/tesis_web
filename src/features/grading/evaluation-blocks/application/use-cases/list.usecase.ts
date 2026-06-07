import type { EvaluationBlockT } from "../../domain/entities/evaluation-block.types";
import { evaluationBlockApiRepository } from "../../infrastructure/repositories/evaluation-block-api.repository";

export const listEvaluationBlocksUseCase = async (): Promise<EvaluationBlockT[]> => {
  return evaluationBlockApiRepository.list();
};
