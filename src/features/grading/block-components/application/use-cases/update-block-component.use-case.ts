import type { BlockComponentRepositoryT } from "../../domain/repositories/block-components.repository";
import type { BlockComponentT } from "../../domain/entities/block-components.types";

export const updateBlockComponentUseCase = async (
  repository: BlockComponentRepositoryT,
  id: number,
  data: Partial<BlockComponentT>,
): Promise<BlockComponentT> => {
  return repository.update(id, data);
};
