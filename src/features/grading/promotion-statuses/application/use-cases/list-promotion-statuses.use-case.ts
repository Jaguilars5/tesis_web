import type { PromotionStatusRepositoryT } from "../../domain/repositories/promotion-statuses.repository";
import type { PromotionStatusT } from "../../domain/entities/promotion-statuses.types";

export const listPromotionStatusesUseCase = async (
  repository: PromotionStatusRepositoryT,
  params?: { page?: number; pageSize?: number },
): Promise<PromotionStatusT[]> => {
  return repository.list(params);
};
