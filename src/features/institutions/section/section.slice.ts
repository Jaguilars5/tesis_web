import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { SectionT } from "./section.types";

export interface SectionStateT {
  sections: SectionT[];
  status: RequestStatusT;
  error: string | null;
}

const initialState: SectionStateT = {
  sections: [],
  status: "idle",
  error: null,
};

const slice = createSlice({
  name: "section",
  initialState,
  reducers: {
    loadPending(state) {
      state.status = "loading";
      state.error = null;
    },
    loadSuccess(state, action: PayloadAction<SectionT[]>) {
      state.sections = action.payload;
      state.status = "succeeded";
    },
    loadError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    entityCreated(state, action: PayloadAction<SectionT>) {
      state.sections.unshift(action.payload);
      state.status = "succeeded";
    },
    entityUpdated(state, action: PayloadAction<SectionT>) {
      const idx = state.sections.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) state.sections[idx] = action.payload;
      state.status = "succeeded";
    },
    entityDeleted(state, action: PayloadAction<number>) {
      state.sections = state.sections.filter((p) => p.id !== action.payload);
      state.status = "succeeded";
    },
    mutationError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    clearSectionError(state) {
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
  clearSectionError,
} = slice.actions;

export const selectSections = (state: RootState): SectionT[] =>
  state.institutions.section.sections;
export const selectSectionsStatus = (state: RootState): RequestStatusT =>
  state.institutions.section.status;
export const selectSectionError = (state: RootState): string | null =>
  state.institutions.section.error;

export const sectionReducer = slice.reducer;
export default slice.reducer;
