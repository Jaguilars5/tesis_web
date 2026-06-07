import type { RootState } from "@shared/redux/store";
import type { ComponentIndicatorT } from "../domain/entities/component-indicators.types";

export const selectComponentIndicators = (state: RootState): ComponentIndicatorT[] =>
  state.grading.componentIndicators.componentIndicators;

export const selectComponentIndicatorsStatus = (state: RootState) =>
  state.grading.componentIndicators.status;

export const selectComponentIndicatorsError = (state: RootState) =>
  state.grading.componentIndicators.error;
