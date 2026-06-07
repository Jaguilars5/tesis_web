export const PROMOTION_STATUSES_THUNK_PREFIX = "grading";
export const PROMOTION_STATUSES_ENDPOINTS = { LIST: "/api/grading/promotion-statuses/" } as const;
export const PROMOTION_STATUSES_THUNKS = {
  FETCH: `${PROMOTION_STATUSES_THUNK_PREFIX}/fetchPromotionStatuses`,
  GET: `${PROMOTION_STATUSES_THUNK_PREFIX}/fetchPromotionStatus`,
  CREATE: `${PROMOTION_STATUSES_THUNK_PREFIX}/createPromotionStatus`,
  UPDATE: `${PROMOTION_STATUSES_THUNK_PREFIX}/updatePromotionStatus`,
  DELETE: `${PROMOTION_STATUSES_THUNK_PREFIX}/deletePromotionStatus`,
};
