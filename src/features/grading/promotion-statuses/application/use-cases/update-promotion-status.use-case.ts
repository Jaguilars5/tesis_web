import type { PromotionStatusRepositoryT } from "../../domain/repositories/promotion-statuses.repository";
import type { PromotionStatusT } from "../../domain/entities/promotion-statuses.types";

export const updatePromotionStatusUseCase = async (
  repository: PromotionStatusRepositoryT,
  id: number,
  data: Partial<PromotionStatusT>,
): Promise<PromotionStatusT> => {
  return repository.update(id, data);
};
