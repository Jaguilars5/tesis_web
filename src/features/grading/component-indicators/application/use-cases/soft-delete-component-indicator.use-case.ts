import type { ComponentIndicatorRepositoryT } from "../../domain/repositories/component-indicators.repository";
import type { ComponentIndicatorT } from "../../domain/entities/component-indicators.types";

export const softDeleteComponentIndicatorUseCase = async (
  repository: ComponentIndicatorRepositoryT,
  id: number,
): Promise<ComponentIndicatorT> => {
  return repository.softDelete(id);
};
