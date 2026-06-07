import type { PromotionStatusRepositoryT } from "../../domain/repositories/promotion-statuses.repository";
import type { PromotionStatusT } from "../../domain/entities/promotion-statuses.types";

export const createPromotionStatusUseCase = async (
  repository: PromotionStatusRepositoryT,
  data: Omit<PromotionStatusT, "id" | "is_active" | "created_at" | "updated_at">,
): Promise<PromotionStatusT> => {
  return repository.create(data);
};
