import type { ComponentIndicatorRepositoryT } from "../../domain/repositories/component-indicators.repository";
import type { ComponentIndicatorT } from "../../domain/entities/component-indicators.types";

export const listComponentIndicatorsUseCase = async (
  repository: ComponentIndicatorRepositoryT,
  params?: { page?: number; pageSize?: number },
): Promise<ComponentIndicatorT[]> => {
  return repository.list(params);
};
