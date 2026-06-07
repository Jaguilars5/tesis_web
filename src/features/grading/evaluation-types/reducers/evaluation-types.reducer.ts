import { createSlice } from "@reduxjs/toolkit";
import {
  createEvaluationType,
  deleteEvaluationType,
  fetchEvaluationTypes,
  updateEvaluationType,
} from "./evaluation-types.thunks";
import type { EvaluationTypesStateT } from "./evaluation-types.reducer.types";

const initialState: EvaluationTypesStateT = {
  evaluationTypes: [],
  status: "idle",
  error: null,
};

const evaluationTypeSlice = createSlice({
  name: "evaluationTypes",
  initialState,
  reducers: {
    clearEvaluationTypeError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvaluationTypes.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchEvaluationTypes.fulfilled, (state, action) => {
        state.evaluationTypes = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchEvaluationTypes.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudieron cargar los tipos de evaluación";
      })
      .addCase(createEvaluationType.fulfilled, (state, action) => {
        state.evaluationTypes.unshift(action.payload);
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(createEvaluationType.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "No se pudo crear el tipo de evaluación";
      })
      .addCase(updateEvaluationType.fulfilled, (state, action) => {
        const index = state.evaluationTypes.findIndex(
          (s) => s.id === action.payload.id,
        );
        if (index !== -1) {
          state.evaluationTypes[index] = action.payload;
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(updateEvaluationType.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudo actualizar el tipo de evaluación";
      })
      .addCase(deleteEvaluationType.fulfilled, (state, action) => {
        const index = state.evaluationTypes.findIndex(
          (s) => s.id === action.payload.id,
        );
        if (index !== -1) {
          state.evaluationTypes[index] = action.payload;
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(deleteEvaluationType.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudo eliminar el tipo de evaluación";
      });
  },
});

export const { clearEvaluationTypeError } = evaluationTypeSlice.actions;
export default evaluationTypeSlice.reducer;
