import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { KinshipT } from "./kinship.types";
export interface KinshipStateT {
  kinships: KinshipT[];
  status: RequestStatusT;
  error: string | null;
}
const initialState: KinshipStateT = {
  kinships: [],
  status: "idle",
  error: null,
};
const slice = createSlice({
  name: "kinship",
  initialState,
  reducers: {
    loadPending(s) {
      s.status = "loading";
      s.error = null;
    },
    loadSuccess(s, a: PayloadAction<KinshipT[]>) {
      s.kinships = a.payload;
      s.status = "succeeded";
    },
    loadError(s, a: PayloadAction<string>) {
      s.status = "failed";
      s.error = a.payload;
    },
    mutationError(s, a: PayloadAction<string>) {
      s.status = "failed";
      s.error = a.payload;
    },
    clearError(s) {
      s.error = null;
    },
  },
});
export const {
  loadPending,
  loadSuccess,
  loadError,
  mutationError,
  clearError,
} = slice.actions;
export const selectKinships = (s: RootState): KinshipT[] =>
  s.students.kinship.kinships;
export const selectKinshipsStatus = (s: RootState): RequestStatusT =>
  s.students.kinship.status;
export const selectKinshipsError = (s: RootState): string | null =>
  s.students.kinship.error;
export const kinshipReducer = slice.reducer;
export default slice.reducer;
