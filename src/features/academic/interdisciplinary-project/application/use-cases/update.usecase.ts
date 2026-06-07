import type { InterdisciplinaryProjectT } from "../../domain/entities/interdisciplinary-project.types";
import { interdisciplinaryProjectApiRepository } from "../../infrastructure/repositories/interdisciplinary-project-api.repository";

export const updateInterdisciplinaryProjectUseCase = async (
  id: number,
  data: Partial<InterdisciplinaryProjectT>,
): Promise<InterdisciplinaryProjectT> => {
  return interdisciplinaryProjectApiRepository.update(id, data);
};
