import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import {
  selectPeriodGradeSummariesError,
  selectPeriodGradeSummaries,
  selectPeriodGradeSummariesStatus,
} from "../../reducers/period-grade-summaries.selectors";
import {
  createPeriodGradeSummary,
  deletePeriodGradeSummary,
  fetchPeriodGradeSummary,
  fetchPeriodGradeSummaries,
  updatePeriodGradeSummary,
} from "../../reducers/period-grade-summaries.thunks";
import type { PeriodGradeSummaryListParamsT } from "../../domain/repositories/period-grade-summaries.repository";

export const usePeriodGradeSummariesController = () => {
  const dispatch = useAppDispatch();
  const periodGradeSummaries = useAppSelector(selectPeriodGradeSummaries);
  const status = useAppSelector(selectPeriodGradeSummariesStatus);
  const error = useAppSelector(selectPeriodGradeSummariesError);

  const loadPeriodGradeSummaries = useCallback(
    (params?: PeriodGradeSummaryListParamsT) => {
      return dispatch(fetchPeriodGradeSummaries(params ?? { page: 1, pageSize: 100 }));
    },
    [dispatch],
  );

  const getPeriodGradeSummary = useCallback(
    (id: number) => {
      return dispatch(fetchPeriodGradeSummary(id)).unwrap();
    },
    [dispatch],
  );

  const create = useCallback(
    (data: Omit<Parameters<typeof createPeriodGradeSummary>[0], "id" | "enrollment_name" | "subject_offering_name" | "academic_period_name" | "qualitative_scale_name" | "calculated_at">) => {
      return dispatch(createPeriodGradeSummary(data));
    },
    [dispatch],
  );

  const update = useCallback(
    (data: Partial<Parameters<typeof updatePeriodGradeSummary>[0]> & { id: number }) => {
      return dispatch(updatePeriodGradeSummary(data));
    },
    [dispatch],
  );

  const remove = useCallback(
    (id: number) => {
      return dispatch(deletePeriodGradeSummary(id));
    },
    [dispatch],
  );

  return {
    periodGradeSummaries,
    isLoading: status === "loading",
    error,
    loadPeriodGradeSummaries,
    getPeriodGradeSummary,
    createPeriodGradeSummary: create,
    updatePeriodGradeSummary: update,
    deletePeriodGradeSummary: remove,
  };
};
