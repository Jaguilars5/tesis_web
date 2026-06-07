import { createSlice } from "@reduxjs/toolkit";
import {
  createRecoveryProcess,
  deleteRecoveryProcess,
  fetchRecoveryProcesses,
  updateRecoveryProcess,
} from "./recovery-processes.thunks";
import type { RecoveryProcessesStateT } from "./recovery-processes.reducer.types";

const initialState: RecoveryProcessesStateT = {
  recoveryProcesses: [],
  status: "idle",
  error: null,
};

const recoveryProcessSlice = createSlice({
  name: "recoveryProcesses",
  initialState,
  reducers: {
    clearRecoveryProcessError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecoveryProcesses.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchRecoveryProcesses.fulfilled, (state, action) => {
        state.recoveryProcesses = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchRecoveryProcesses.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudieron cargar los procesos de recuperación";
      })
      .addCase(createRecoveryProcess.fulfilled, (state, action) => {
        state.recoveryProcesses.unshift(action.payload);
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(createRecoveryProcess.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "No se pudo crear el proceso de recuperación";
      })
      .addCase(updateRecoveryProcess.fulfilled, (state, action) => {
        const index = state.recoveryProcesses.findIndex(
          (s) => s.id === action.payload.id,
        );
        if (index !== -1) {
          state.recoveryProcesses[index] = action.payload;
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(updateRecoveryProcess.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudo actualizar el proceso de recuperación";
      })
      .addCase(deleteRecoveryProcess.fulfilled, (state, action) => {
        state.recoveryProcesses = state.recoveryProcesses.filter(
          (s) => s.id !== action.payload,
        );
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(deleteRecoveryProcess.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudo eliminar el proceso de recuperación";
      });
  },
});

export const { clearRecoveryProcessError } = recoveryProcessSlice.actions;
export default recoveryProcessSlice.reducer;
