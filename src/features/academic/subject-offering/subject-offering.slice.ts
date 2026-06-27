import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { SubjectOfferingT } from "./subject-offering.types";

export interface SubjectOfferingStateT {
  subjectOfferings: SubjectOfferingT[];
  totalCount: number;
  status: RequestStatusT;
  error: string | null;
}

const initialState: SubjectOfferingStateT = {
  subjectOfferings: [],
  totalCount: 0,
  status: "idle",
  error: null,
};

const subjectOfferingSlice = createSlice({
  name: "subjectOfferings",
  initialState,
  reducers: {
    loadPending(state) {
      state.status = "loading";
      state.error = null;
    },
    loadSuccess(
      state,
      action: PayloadAction<{ items: SubjectOfferingT[]; count: number }>,
    ) {
      state.subjectOfferings = action.payload.items;
      state.totalCount = action.payload.count;
      state.status = "succeeded";
    },
    loadError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    entityCreated(state, action: PayloadAction<SubjectOfferingT>) {
      state.subjectOfferings.unshift(action.payload);
      state.status = "succeeded";
    },
    entityUpdated(state, action: PayloadAction<SubjectOfferingT>) {
      const idx = state.subjectOfferings.findIndex(
        (offering) => offering.id === action.payload.id,
      );
      if (idx !== -1) state.subjectOfferings[idx] = action.payload;
      state.status = "succeeded";
    },
    entityDeleted(state, action: PayloadAction<number>) {
      state.subjectOfferings = state.subjectOfferings.filter(
        (offering) => offering.id !== action.payload,
      );
      state.status = "succeeded";
    },
    mutationError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    setTotalCount(state, action: PayloadAction<number>) {
      state.totalCount = action.payload;
    },
    clearSubjectOfferingError(state) {
      state.error = null;
    },
  },
});

export const {
  loadPending,
  loadSuccess,
  loadError,
  entityCreated,
  entityUpdated,
  entityDeleted,
  mutationError,
  setTotalCount,
  clearSubjectOfferingError,
} = subjectOfferingSlice.actions;

export const selectSubjectOfferings = (state: RootState): SubjectOfferingT[] =>
  state.academic.subjectOfferings.subjectOfferings;

export const selectSubjectOfferingsStatus = (state: RootState): RequestStatusT =>
  state.academic.subjectOfferings.status;

export const selectSubjectOfferingError = (state: RootState): string | null =>
  state.academic.subjectOfferings.error;

export const selectSubjectOfferingTotalCount = (state: RootState): number =>
  state.academic.subjectOfferings.totalCount;

export const subjectOfferingReducer = subjectOfferingSlice.reducer;

export default subjectOfferingSlice.reducer;
