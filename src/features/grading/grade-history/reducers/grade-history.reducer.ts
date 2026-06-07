import { createSlice } from "@reduxjs/toolkit";
import { fetchGradeHistory, fetchGradeHistoryItem } from "./grade-history.thunks";
import type { GradeHistoryStateT } from "./grade-history.reducer.types";

const initialState: GradeHistoryStateT = {
  gradeHistoryItems: [],
  status: "idle",
  error: null,
};

const gradeHistorySlice = createSlice({
  name: "gradeHistory",
  initialState,
  reducers: {
    clearGradeHistoryError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGradeHistory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchGradeHistory.fulfilled, (state, action) => {
        state.gradeHistoryItems = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchGradeHistory.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudo cargar el historial de calificaciones";
      })
      .addCase(fetchGradeHistoryItem.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchGradeHistoryItem.fulfilled, (state, action) => {
        const index = state.gradeHistoryItems.findIndex(
          (item) => item.id === action.payload.id,
        );
        if (index !== -1) {
          state.gradeHistoryItems[index] = action.payload;
        } else {
          state.gradeHistoryItems.unshift(action.payload);
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchGradeHistoryItem.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudo obtener el registro del historial";
      });
  },
});

export const { clearGradeHistoryError } = gradeHistorySlice.actions;
export default gradeHistorySlice.reducer;
