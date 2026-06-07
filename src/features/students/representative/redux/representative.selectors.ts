import type { RootState } from "@shared/redux/store";
import type { Representative } from "../types/representative.types";

export const selectRepresentatives = (state: RootState): Representative[] =>
  state.students.representative.entities;

export const selectRepresentativesStatus = (state: RootState) =>
  state.students.representative.status;

export const selectRepresentativesError = (state: RootState) =>
  state.students.representative.error;
