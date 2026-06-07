import type { BlockComponentRepositoryT } from "../../domain/repositories/block-components.repository";
import type { BlockComponentT } from "../../domain/entities/block-components.types";

export const softDeleteBlockComponentUseCase = async (
  repository: BlockComponentRepositoryT,
  id: number,
): Promise<BlockComponentT> => {
  return repository.softDelete(id);
};
