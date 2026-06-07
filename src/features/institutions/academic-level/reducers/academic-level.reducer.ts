import { createSlice } from "@reduxjs/toolkit";
import {
  createAcademicLevel,
  deleteAcademicLevel,
  fetchAcademicLevels,
  updateAcademicLevel,
} from "../application";
import type { AcademicLevelStateT } from "./academic-level.reducer.types";

const initialState: AcademicLevelStateT = {
  academicLevels: [],
  status: "idle",
  error: null,
};

const academicLevelSlice = createSlice({
  name: "academicLevel",
  initialState,
  reducers: {
    clearAcademicLevelError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAcademicLevels.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAcademicLevels.fulfilled, (state, action) => {
        state.academicLevels = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchAcademicLevels.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "No se pudieron cargar los niveles academicos";
      })
      .addCase(createAcademicLevel.fulfilled, (state, action) => {
        state.academicLevels.unshift(action.payload);
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(createAcademicLevel.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "No se pudo crear el nivel academico";
      })
      .addCase(updateAcademicLevel.fulfilled, (state, action) => {
        const index = state.academicLevels.findIndex(
          (l) => l.id === action.payload.id,
        );
        if (index !== -1) {
          state.academicLevels[index] = action.payload;
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(updateAcademicLevel.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "No se pudo actualizar el nivel academico";
      })
      .addCase(deleteAcademicLevel.fulfilled, (state, action) => {
        const index = state.academicLevels.findIndex(
          (l) => l.id === action.payload.id,
        );
        if (index !== -1) {
          state.academicLevels[index] = action.payload;
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(deleteAcademicLevel.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "No se pudo eliminar el nivel academico";
      });
  },
});

export const { clearAcademicLevelError } = academicLevelSlice.actions;
export default academicLevelSlice.reducer;
