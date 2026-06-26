import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { toRejectValue } from "@shared/utils/validationErrors";
import { useCallback } from "react";
import { periodGradeSummaryService } from "../period-grade-summaries.service";
import {
  loadPending,
  loadSuccess,
  loadError,
  entityCreated,
  entityUpdated,
  entityDeleted,
  mutationError,
  selectPeriodGradeSummaries,
  selectPeriodGradeSummariesStatus,
  selectPeriodGradeSummariesError,
} from "../period-grade-summaries.slice";
import type {
  PeriodGradeSummaryCreateParamsT,
  PeriodGradeSummaryDeleteParamsT,
  PeriodGradeSummaryListParamsT,
  PeriodGradeSummaryT,
  PeriodGradeSummaryUpdateParamsT,
} from "../period-grade-summaries.types";
import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";

export const usePeriodGradeSummariesController = () => {
  const dispatch = useAppDispatch();
  const periodGradeSummaries = useAppSelector(selectPeriodGradeSummaries);
  const status = useAppSelector(selectPeriodGradeSummariesStatus);
  const error = useAppSelector(selectPeriodGradeSummariesError);

  const loadPeriodGradeSummaries = useCallback(
    async (params?: PeriodGradeSummaryListParamsT) => {
      dispatch(loadPending());
      try {
        const items = await periodGradeSummaryService.list(
          params ?? { page: 1, pageSize: 100 },
        );
        dispatch(loadSuccess(items));
      } catch (err) {
        dispatch(loadError(err instanceof Error ? err.message : "Error"));
      }
    },
    [dispatch],
  );

  const createPeriodGradeSummary = useCallback(
    async (
      data: PeriodGradeSummaryCreateParamsT,
    ): Promise<PeriodGradeSummaryT> => {
      try {
        const created = await periodGradeSummaryService.create(data);
        dispatch(entityCreated(created));
        return created;
      } catch (err) {
        const rejectValue = toRejectValue(err);
        dispatch(mutationError(rejectValue.msg));
        throw rejectValue;
      }
    },
    [dispatch],
  );

  const updatePeriodGradeSummary = useCallback(
    async (
      params: PeriodGradeSummaryUpdateParamsT,
    ): Promise<PeriodGradeSummaryT> => {
      try {
        const updated = await periodGradeSummaryService.update(params);
        dispatch(entityUpdated(updated));
        return updated;
      } catch (err) {
        const rejectValue = toRejectValue(err);
        dispatch(mutationError(rejectValue.msg));
        throw rejectValue;
      }
    },
    [dispatch],
  );

  const deletePeriodGradeSummary = useCallback(
    async (
      params: PeriodGradeSummaryDeleteParamsT,
    ): Promise<SoftDeleteResponseT> => {
      try {
        const response = await periodGradeSummaryService.softDelete(params);
        if (response.is_active === false) {
          dispatch(entityDeleted(response.id));
        }
        return response;
      } catch (err) {
        const rejectValue = toRejectValue(err);
        dispatch(mutationError(rejectValue.msg));
        throw rejectValue;
      }
    },
    [dispatch],
  );

  return {
    periodGradeSummaries,
    isLoading: status === "loading",
    error,
    loadPeriodGradeSummaries,
    createPeriodGradeSummary,
    updatePeriodGradeSummary,
    deletePeriodGradeSummary,
  };
};

export type PeriodGradeSummariesControllerT = ReturnType<
  typeof usePeriodGradeSummariesController
>;
