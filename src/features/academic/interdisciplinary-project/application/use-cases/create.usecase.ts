import type { InterdisciplinaryProjectT } from "../../domain/entities/interdisciplinary-project.types";
import { interdisciplinaryProjectApiRepository } from "../../infrastructure/repositories/interdisciplinary-project-api.repository";

export const createInterdisciplinaryProjectUseCase = async (
  data: Omit<InterdisciplinaryProjectT, "id" | "is_active" | "academic_period_name">,
): Promise<InterdisciplinaryProjectT> => {
  return interdisciplinaryProjectApiRepository.create(data);
};
