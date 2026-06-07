import { createSlice } from "@reduxjs/toolkit";
import {
  createActivityType,
  deleteActivityType,
  fetchActivityTypes,
  updateActivityType,
} from "./activity-types.thunks";
import type { ActivityTypesStateT } from "./activity-types.reducer.types";

const initialState: ActivityTypesStateT = {
  activityTypes: [],
  status: "idle",
  error: null,
};

const activityTypeSlice = createSlice({
  name: "activityTypes",
  initialState,
  reducers: {
    clearActivityTypeError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivityTypes.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchActivityTypes.fulfilled, (state, action) => {
        state.activityTypes = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchActivityTypes.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudieron cargar los tipos de actividad";
      })
      .addCase(createActivityType.fulfilled, (state, action) => {
        state.activityTypes.unshift(action.payload);
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(createActivityType.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "No se pudo crear el tipo de actividad";
      })
      .addCase(updateActivityType.fulfilled, (state, action) => {
        const index = state.activityTypes.findIndex(
          (s) => s.id === action.payload.id,
        );
        if (index !== -1) {
          state.activityTypes[index] = action.payload;
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(updateActivityType.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudo actualizar el tipo de actividad";
      })
      .addCase(deleteActivityType.fulfilled, (state, action) => {
        const index = state.activityTypes.findIndex(
          (s) => s.id === action.payload.id,
        );
        if (index !== -1) {
          state.activityTypes[index] = action.payload;
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(deleteActivityType.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudo eliminar el tipo de actividad";
      });
  },
});

export const { clearActivityTypeError } = activityTypeSlice.actions;
export default activityTypeSlice.reducer;
