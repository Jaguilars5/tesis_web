import type { InterdisciplinaryProjectT } from "../../domain/entities/interdisciplinary-project.types";
import { interdisciplinaryProjectApiRepository } from "../../infrastructure/repositories/interdisciplinary-project-api.repository";

export const getInterdisciplinaryProjectUseCase = async (id: number): Promise<InterdisciplinaryProjectT> => {
  return interdisciplinaryProjectApiRepository.get(id);
};
