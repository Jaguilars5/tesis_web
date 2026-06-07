import type { PromotionStatusT } from "../entities/promotion-statuses.types";
export interface PromotionStatusListParamsT { page?: number; pageSize?: number; }
export interface PromotionStatusRepositoryT {
  list(params?: PromotionStatusListParamsT): Promise<PromotionStatusT[]>;
  get(id: number): Promise<PromotionStatusT>;
  create(data: Omit<PromotionStatusT, "id" | "is_active" | "created_at" | "updated_at">): Promise<PromotionStatusT>;
  update(id: number, data: Partial<PromotionStatusT>): Promise<PromotionStatusT>;
  softDelete(id: number): Promise<PromotionStatusT>;
}
