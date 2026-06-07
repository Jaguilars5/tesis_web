import type { RequestStatusT } from "@shared/types/commonTypes";
import type { PromotionStatusT } from "../domain/entities/promotion-statuses.types";

export interface PromotionStatusesStateT {
  promotionStatuses: PromotionStatusT[];
  status: RequestStatusT;
  error: string | null;
}
