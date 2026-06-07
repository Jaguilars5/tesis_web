import type { RootState } from "@shared/redux/store";
import type { PeriodGradeSummaryT } from "../domain/entities/period-grade-summaries.types";

export const selectPeriodGradeSummaries = (state: RootState): PeriodGradeSummaryT[] =>
  state.grading.periodGradeSummaries.periodGradeSummaries;

export const selectPeriodGradeSummariesStatus = (state: RootState) =>
  state.grading.periodGradeSummaries.status;

export const selectPeriodGradeSummariesError = (state: RootState) =>
  state.grading.periodGradeSummaries.error;
