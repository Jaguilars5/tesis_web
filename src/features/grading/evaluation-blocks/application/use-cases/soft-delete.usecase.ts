import type { EvaluationBlockT } from "../../domain/entities/evaluation-block.types";
import { evaluationBlockApiRepository } from "../../infrastructure/repositories/evaluation-block-api.repository";

export const softDeleteEvaluationBlockUseCase = async (id: number): Promise<EvaluationBlockT> => {
  return evaluationBlockApiRepository.softDelete(id);
};
