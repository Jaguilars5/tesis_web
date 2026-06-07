import type { InterdisciplinaryProjectT } from "../../domain/entities/interdisciplinary-project.types";
import { interdisciplinaryProjectApiRepository } from "../../infrastructure/repositories/interdisciplinary-project-api.repository";

export const listInterdisciplinaryProjectsUseCase = async (
  params?: { page?: number; pageSize?: number },
): Promise<InterdisciplinaryProjectT[]> => {
  return interdisciplinaryProjectApiRepository.list(params);
};
