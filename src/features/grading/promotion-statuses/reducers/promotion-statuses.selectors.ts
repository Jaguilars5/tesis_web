import type { RootState } from "@shared/redux/store";
import type { PromotionStatusT } from "../domain/entities/promotion-statuses.types";

export const selectPromotionStatuses = (state: RootState): PromotionStatusT[] =>
  state.grading.promotionStatuses.promotionStatuses;

export const selectPromotionStatusesStatus = (state: RootState) =>
  state.grading.promotionStatuses.status;

export const selectPromotionStatusesError = (state: RootState) =>
  state.grading.promotionStatuses.error;
