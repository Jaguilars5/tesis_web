import type { RootState } from "@shared/redux/store";
import type { PeriodTypeT } from "../domain/entities/period-types.types";

export const selectPeriodTypes = (state: RootState): PeriodTypeT[] =>
  state.academic.periodTypes.periodTypes;

export const selectPeriodTypesStatus = (state: RootState) =>
  state.academic.periodTypes.status;

export const selectPeriodTypeError = (state: RootState) =>
  state.academic.periodTypes.error;
