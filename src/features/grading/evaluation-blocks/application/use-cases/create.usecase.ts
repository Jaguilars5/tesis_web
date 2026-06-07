import type { EvaluationBlockT } from "../../domain/entities/evaluation-block.types";
import { evaluationBlockApiRepository } from "../../infrastructure/repositories/evaluation-block-api.repository";

export const createEvaluationBlockUseCase = async (
  data: Omit<EvaluationBlockT, "id" | "is_active" | "academic_period_name">,
): Promise<EvaluationBlockT> => {
  return evaluationBlockApiRepository.create(data);
};
