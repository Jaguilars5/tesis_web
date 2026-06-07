import type { InterdisciplinaryProjectT } from "../../domain/entities/interdisciplinary-project.types";
import { interdisciplinaryProjectApiRepository } from "../../infrastructure/repositories/interdisciplinary-project-api.repository";

export const softDeleteInterdisciplinaryProjectUseCase = async (id: number): Promise<InterdisciplinaryProjectT> => {
  return interdisciplinaryProjectApiRepository.softDelete(id);
};
