import type { PromotionStatusRepositoryT } from "../../domain/repositories/promotion-statuses.repository";
import type { PromotionStatusT } from "../../domain/entities/promotion-statuses.types";

export const getPromotionStatusUseCase = async (
  repository: PromotionStatusRepositoryT,
  id: number,
): Promise<PromotionStatusT> => {
  return repository.get(id);
};
