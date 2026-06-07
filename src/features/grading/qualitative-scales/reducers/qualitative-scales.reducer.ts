import { createSlice } from "@reduxjs/toolkit";
import {
  createQualitativeScale,
  deleteQualitativeScale,
  fetchQualitativeScales,
  updateQualitativeScale,
} from "./qualitative-scales.thunks";
import type { QualitativeScalesStateT } from "./qualitative-scales.reducer.types";

const initialState: QualitativeScalesStateT = {
  qualitativeScales: [],
  status: "idle",
  error: null,
};

const qualitativeScaleSlice = createSlice({
  name: "qualitativeScales",
  initialState,
  reducers: {
    clearQualitativeScaleError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQualitativeScales.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchQualitativeScales.fulfilled, (state, action) => {
        state.qualitativeScales = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchQualitativeScales.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudieron cargar las escalas cualitativas";
      })
      .addCase(createQualitativeScale.fulfilled, (state, action) => {
        state.qualitativeScales.unshift(action.payload);
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(createQualitativeScale.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "No se pudo crear la escala cualitativa";
      })
      .addCase(updateQualitativeScale.fulfilled, (state, action) => {
        const index = state.qualitativeScales.findIndex(
          (s) => s.id === action.payload.id,
        );
        if (index !== -1) {
          state.qualitativeScales[index] = action.payload;
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(updateQualitativeScale.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudo actualizar la escala cualitativa";
      })
      .addCase(deleteQualitativeScale.fulfilled, (state, action) => {
        state.qualitativeScales = state.qualitativeScales.filter(
          (s) => s.id !== action.payload,
        );
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(deleteQualitativeScale.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudo eliminar la escala cualitativa";
      });
  },
});

export const { clearQualitativeScaleError } = qualitativeScaleSlice.actions;
export default qualitativeScaleSlice.reducer;
