import type { ComponentIndicatorRepositoryT } from "../../domain/repositories/component-indicators.repository";
import type { ComponentIndicatorT } from "../../domain/entities/component-indicators.types";

export const createComponentIndicatorUseCase = async (
  repository: ComponentIndicatorRepositoryT,
  data: Omit<ComponentIndicatorT, "id" | "block_component_name">,
): Promise<ComponentIndicatorT> => {
  return repository.create(data);
};
