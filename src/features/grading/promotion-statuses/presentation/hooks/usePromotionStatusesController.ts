import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import {
  selectPromotionStatusesError,
  selectPromotionStatuses,
  selectPromotionStatusesStatus,
} from "../../reducers/promotion-statuses.selectors";
import {
  createPromotionStatus,
  deletePromotionStatus,
  fetchPromotionStatus,
  fetchPromotionStatuses,
  updatePromotionStatus,
} from "../../reducers/promotion-statuses.thunks";
import type { PromotionStatusListParamsT } from "../../domain/repositories/promotion-statuses.repository";

export const usePromotionStatusesController = () => {
  const dispatch = useAppDispatch();
  const promotionStatuses = useAppSelector(selectPromotionStatuses);
  const status = useAppSelector(selectPromotionStatusesStatus);
  const error = useAppSelector(selectPromotionStatusesError);

  const loadPromotionStatuses = useCallback(
    (params?: PromotionStatusListParamsT) => {
      return dispatch(fetchPromotionStatuses(params ?? { page: 1, pageSize: 100 }));
    },
    [dispatch],
  );

  const getPromotionStatus = useCallback(
    (id: number) => {
      return dispatch(fetchPromotionStatus(id)).unwrap();
    },
    [dispatch],
  );

  const create = useCallback(
    (data: Omit<Parameters<typeof createPromotionStatus>[0], "id" | "is_active" | "created_at" | "updated_at">) => {
      return dispatch(createPromotionStatus(data));
    },
    [dispatch],
  );

  const update = useCallback(
    (data: Partial<Parameters<typeof updatePromotionStatus>[0]> & { id: number }) => {
      return dispatch(updatePromotionStatus(data));
    },
    [dispatch],
  );

  const remove = useCallback(
    (id: number) => {
      return dispatch(deletePromotionStatus(id));
    },
    [dispatch],
  );

  return {
    promotionStatuses,
    isLoading: status === "loading",
    error,
    loadPromotionStatuses,
    getPromotionStatus,
    createPromotionStatus: create,
    updatePromotionStatus: update,
    deletePromotionStatus: remove,
  };
};
