import type { RootState } from "@shared/redux/store";
import type { ActivityTypeT } from "../domain/entities/activity-types.types";

export const selectActivityTypes = (state: RootState): ActivityTypeT[] =>
  state.grading.activityTypes.activityTypes;

export const selectActivityTypesStatus = (state: RootState) =>
  state.grading.activityTypes.status;

export const selectActivityTypesError = (state: RootState) =>
  state.grading.activityTypes.error;
