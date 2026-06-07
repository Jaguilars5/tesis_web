import { createSlice } from "@reduxjs/toolkit";
import {
  createComponentIndicator,
  deleteComponentIndicator,
  fetchComponentIndicators,
  updateComponentIndicator,
} from "./component-indicators.thunks";
import type { ComponentIndicatorsStateT } from "./component-indicators.reducer.types";

const initialState: ComponentIndicatorsStateT = {
  componentIndicators: [],
  status: "idle",
  error: null,
};

const componentIndicatorSlice = createSlice({
  name: "componentIndicators",
  initialState,
  reducers: {
    clearComponentIndicatorError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComponentIndicators.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchComponentIndicators.fulfilled, (state, action) => {
        state.componentIndicators = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchComponentIndicators.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudieron cargar los indicadores de componente";
      })
      .addCase(createComponentIndicator.fulfilled, (state, action) => {
        state.componentIndicators.unshift(action.payload);
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(createComponentIndicator.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "No se pudo crear el indicador de componente";
      })
      .addCase(updateComponentIndicator.fulfilled, (state, action) => {
        const index = state.componentIndicators.findIndex(
          (s) => s.id === action.payload.id,
        );
        if (index !== -1) {
          state.componentIndicators[index] = action.payload;
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(updateComponentIndicator.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudo actualizar el indicador de componente";
      })
      .addCase(deleteComponentIndicator.fulfilled, (state, action) => {
        const index = state.componentIndicators.findIndex(
          (s) => s.id === action.payload.id,
        );
        if (index !== -1) {
          state.componentIndicators[index] = action.payload;
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(deleteComponentIndicator.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudo eliminar el indicador de componente";
      });
  },
});

export const { clearComponentIndicatorError } = componentIndicatorSlice.actions;
export default componentIndicatorSlice.reducer;
