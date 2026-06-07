import type { BlockComponentRepositoryT } from "../../domain/repositories/block-components.repository";
import type { BlockComponentT } from "../../domain/entities/block-components.types";

export const createBlockComponentUseCase = async (
  repository: BlockComponentRepositoryT,
  data: Omit<BlockComponentT, "id" | "evaluation_block_name">,
): Promise<BlockComponentT> => {
  return repository.create(data);
};
