import type { RootState } from "@shared/redux/store";
import type { GradeChangeHistoryT } from "../domain/entities/grade-history.types";

export const selectGradeHistory = (state: RootState): GradeChangeHistoryT[] =>
  state.grading.gradeHistory.gradeHistoryItems;

export const selectGradeHistoryStatus = (state: RootState) =>
  state.grading.gradeHistory.status;

export const selectGradeHistoryError = (state: RootState) =>
  state.grading.gradeHistory.error;
