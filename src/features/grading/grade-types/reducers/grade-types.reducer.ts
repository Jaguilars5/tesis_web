import { createSlice } from "@reduxjs/toolkit";
import {
  createGradeType,
  deleteGradeType,
  fetchGradeTypes,
  updateGradeType,
} from "./grade-types.thunks";
import type { GradeTypesStateT } from "./grade-types.reducer.types";

const initialState: GradeTypesStateT = {
  gradeTypes: [],
  status: "idle",
  error: null,
};

const gradeTypeSlice = createSlice({
  name: "gradeTypes",
  initialState,
  reducers: {
    clearGradeTypeError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGradeTypes.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchGradeTypes.fulfilled, (state, action) => {
        state.gradeTypes = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchGradeTypes.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudieron cargar los tipos de calificación";
      })
      .addCase(createGradeType.fulfilled, (state, action) => {
        state.gradeTypes.unshift(action.payload);
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(createGradeType.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "No se pudo crear el tipo de calificación";
      })
      .addCase(updateGradeType.fulfilled, (state, action) => {
        const index = state.gradeTypes.findIndex(
          (s) => s.id === action.payload.id,
        );
        if (index !== -1) {
          state.gradeTypes[index] = action.payload;
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(updateGradeType.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudo actualizar el tipo de calificación";
      })
      .addCase(deleteGradeType.fulfilled, (state, action) => {
        const index = state.gradeTypes.findIndex(
          (s) => s.id === action.payload.id,
        );
        if (index !== -1) {
          state.gradeTypes[index] = action.payload;
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(deleteGradeType.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudo eliminar el tipo de calificación";
      });
  },
});

export const { clearGradeTypeError } = gradeTypeSlice.actions;
export default gradeTypeSlice.reducer;
