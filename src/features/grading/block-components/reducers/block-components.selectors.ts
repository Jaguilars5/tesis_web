import type { RootState } from "@shared/redux/store";
import type { BlockComponentT } from "../domain/entities/block-components.types";

export const selectBlockComponents = (state: RootState): BlockComponentT[] =>
  state.grading.blockComponents.blockComponents;

export const selectBlockComponentsStatus = (state: RootState) =>
  state.grading.blockComponents.status;

export const selectBlockComponentsError = (state: RootState) =>
  state.grading.blockComponents.error;
