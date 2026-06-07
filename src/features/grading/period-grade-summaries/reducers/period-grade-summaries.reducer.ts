import { createSlice } from "@reduxjs/toolkit";
import {
  createPeriodGradeSummary,
  deletePeriodGradeSummary,
  fetchPeriodGradeSummaries,
  updatePeriodGradeSummary,
} from "./period-grade-summaries.thunks";
import type { PeriodGradeSummariesStateT } from "./period-grade-summaries.reducer.types";

const initialState: PeriodGradeSummariesStateT = {
  periodGradeSummaries: [],
  status: "idle",
  error: null,
};

const periodGradeSummarySlice = createSlice({
  name: "periodGradeSummaries",
  initialState,
  reducers: {
    clearPeriodGradeSummaryError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPeriodGradeSummaries.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPeriodGradeSummaries.fulfilled, (state, action) => {
        state.periodGradeSummaries = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchPeriodGradeSummaries.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudieron cargar los resúmenes de calificaciones";
      })
      .addCase(createPeriodGradeSummary.fulfilled, (state, action) => {
        state.periodGradeSummaries.unshift(action.payload);
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(createPeriodGradeSummary.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "No se pudo crear el resumen de calificaciones";
      })
      .addCase(updatePeriodGradeSummary.fulfilled, (state, action) => {
        const index = state.periodGradeSummaries.findIndex(
          (s) => s.id === action.payload.id,
        );
        if (index !== -1) {
          state.periodGradeSummaries[index] = action.payload;
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(updatePeriodGradeSummary.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudo actualizar el resumen de calificaciones";
      })
      .addCase(deletePeriodGradeSummary.fulfilled, (state, action) => {
        const index = state.periodGradeSummaries.findIndex(
          (s) => s.id === action.payload.id,
        );
        if (index !== -1) {
          state.periodGradeSummaries[index] = action.payload;
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(deletePeriodGradeSummary.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudo eliminar el resumen de calificaciones";
      });
  },
});

export const { clearPeriodGradeSummaryError } = periodGradeSummarySlice.actions;
export default periodGradeSummarySlice.reducer;
