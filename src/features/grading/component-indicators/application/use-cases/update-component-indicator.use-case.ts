import type { ComponentIndicatorRepositoryT } from "../../domain/repositories/component-indicators.repository";
import type { ComponentIndicatorT } from "../../domain/entities/component-indicators.types";

export const updateComponentIndicatorUseCase = async (
  repository: ComponentIndicatorRepositoryT,
  id: number,
  data: Partial<ComponentIndicatorT>,
): Promise<ComponentIndicatorT> => {
  return repository.update(id, data);
};
