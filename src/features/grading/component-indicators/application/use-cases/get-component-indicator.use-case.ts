import type { ComponentIndicatorRepositoryT } from "../../domain/repositories/component-indicators.repository";
import type { ComponentIndicatorT } from "../../domain/entities/component-indicators.types";

export const getComponentIndicatorUseCase = async (
  repository: ComponentIndicatorRepositoryT,
  id: number,
): Promise<ComponentIndicatorT> => {
  return repository.get(id);
};
