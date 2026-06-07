import { createSlice } from "@reduxjs/toolkit";
import {
  createPeriodType,
  deletePeriodType,
  fetchPeriodTypes,
  updatePeriodType,
} from "./period-types.thunks";
import type { PeriodTypeStateT } from "./period-types.reducer.types";

const initialState: PeriodTypeStateT = {
  periodTypes: [],
  status: "idle",
  error: null,
};

const periodTypeSlice = createSlice({
  name: "periodType",
  initialState,
  reducers: {
    clearPeriodTypeError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPeriodTypes.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPeriodTypes.fulfilled, (state, action) => {
        state.periodTypes = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchPeriodTypes.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudieron cargar los tipos de periodo";
      })
      .addCase(createPeriodType.fulfilled, (state, action) => {
        state.periodTypes.unshift(action.payload);
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(createPeriodType.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "No se pudo crear el tipo de periodo";
      })
      .addCase(updatePeriodType.fulfilled, (state, action) => {
        const index = state.periodTypes.findIndex(
          (s) => s.id === action.payload.id,
        );
        if (index !== -1) {
          state.periodTypes[index] = action.payload;
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(updatePeriodType.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudo actualizar el tipo de periodo";
      })
      .addCase(deletePeriodType.fulfilled, (state, action) => {
        const index = state.periodTypes.findIndex(
          (s) => s.id === action.payload.id,
        );
        if (index !== -1) {
          state.periodTypes[index] = action.payload;
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(deletePeriodType.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudo eliminar el tipo de periodo";
      });
  },
});

export const { clearPeriodTypeError } = periodTypeSlice.actions;
export default periodTypeSlice.reducer;
