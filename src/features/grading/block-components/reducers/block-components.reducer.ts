import { createSlice } from "@reduxjs/toolkit";
import {
  createBlockComponent,
  deleteBlockComponent,
  fetchBlockComponents,
  updateBlockComponent,
} from "./block-components.thunks";
import type { BlockComponentsStateT } from "./block-components.reducer.types";

const initialState: BlockComponentsStateT = {
  blockComponents: [],
  status: "idle",
  error: null,
};

const blockComponentSlice = createSlice({
  name: "blockComponents",
  initialState,
  reducers: {
    clearBlockComponentError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlockComponents.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBlockComponents.fulfilled, (state, action) => {
        state.blockComponents = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchBlockComponents.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudieron cargar los componentes de bloque";
      })
      .addCase(createBlockComponent.fulfilled, (state, action) => {
        state.blockComponents.unshift(action.payload);
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(createBlockComponent.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "No se pudo crear el componente de bloque";
      })
      .addCase(updateBlockComponent.fulfilled, (state, action) => {
        const index = state.blockComponents.findIndex(
          (s) => s.id === action.payload.id,
        );
        if (index !== -1) {
          state.blockComponents[index] = action.payload;
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(updateBlockComponent.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudo actualizar el componente de bloque";
      })
      .addCase(deleteBlockComponent.fulfilled, (state, action) => {
        const index = state.blockComponents.findIndex(
          (s) => s.id === action.payload.id,
        );
        if (index !== -1) {
          state.blockComponents[index] = action.payload;
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(deleteBlockComponent.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudo eliminar el componente de bloque";
      });
  },
});

export const { clearBlockComponentError } = blockComponentSlice.actions;
export default blockComponentSlice.reducer;
