import type { BlockComponentRepositoryT } from "../../domain/repositories/block-components.repository";
import type { BlockComponentT } from "../../domain/entities/block-components.types";

export const listBlockComponentsUseCase = async (
  repository: BlockComponentRepositoryT,
  params?: { page?: number; pageSize?: number },
): Promise<BlockComponentT[]> => {
  return repository.list(params);
};
