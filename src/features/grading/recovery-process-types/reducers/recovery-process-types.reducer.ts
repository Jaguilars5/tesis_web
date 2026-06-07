import { createSlice } from "@reduxjs/toolkit";
import {
  createRecoveryProcessType,
  deleteRecoveryProcessType,
  fetchRecoveryProcessTypes,
  updateRecoveryProcessType,
} from "./recovery-process-types.thunks";
import type { RecoveryProcessTypesStateT } from "./recovery-process-types.reducer.types";

const initialState: RecoveryProcessTypesStateT = {
  recoveryProcessTypes: [],
  status: "idle",
  error: null,
};

const recoveryProcessTypeSlice = createSlice({
  name: "recoveryProcessTypes",
  initialState,
  reducers: {
    clearRecoveryProcessTypeError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecoveryProcessTypes.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchRecoveryProcessTypes.fulfilled, (state, action) => {
        state.recoveryProcessTypes = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchRecoveryProcessTypes.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudieron cargar los tipos de proceso de recuperación";
      })
      .addCase(createRecoveryProcessType.fulfilled, (state, action) => {
        state.recoveryProcessTypes.unshift(action.payload);
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(createRecoveryProcessType.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "No se pudo crear el tipo de proceso de recuperación";
      })
      .addCase(updateRecoveryProcessType.fulfilled, (state, action) => {
        const index = state.recoveryProcessTypes.findIndex(
          (s) => s.id === action.payload.id,
        );
        if (index !== -1) {
          state.recoveryProcessTypes[index] = action.payload;
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(updateRecoveryProcessType.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudo actualizar el tipo de proceso de recuperación";
      })
      .addCase(deleteRecoveryProcessType.fulfilled, (state, action) => {
        const index = state.recoveryProcessTypes.findIndex(
          (s) => s.id === action.payload.id,
        );
        if (index !== -1) {
          state.recoveryProcessTypes[index] = action.payload;
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(deleteRecoveryProcessType.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudo eliminar el tipo de proceso de recuperación";
      });
  },
});

export const { clearRecoveryProcessTypeError } = recoveryProcessTypeSlice.actions;
export default recoveryProcessTypeSlice.reducer;
