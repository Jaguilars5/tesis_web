import { createSlice } from "@reduxjs/toolkit";
import {
  createPromotionStatus,
  deletePromotionStatus,
  fetchPromotionStatuses,
  updatePromotionStatus,
} from "./promotion-statuses.thunks";
import type { PromotionStatusesStateT } from "./promotion-statuses.reducer.types";

const initialState: PromotionStatusesStateT = {
  promotionStatuses: [],
  status: "idle",
  error: null,
};

const promotionStatusSlice = createSlice({
  name: "promotionStatuses",
  initialState,
  reducers: {
    clearPromotionStatusError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPromotionStatuses.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPromotionStatuses.fulfilled, (state, action) => {
        state.promotionStatuses = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchPromotionStatuses.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudieron cargar los estados de promoción";
      })
      .addCase(createPromotionStatus.fulfilled, (state, action) => {
        state.promotionStatuses.unshift(action.payload);
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(createPromotionStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "No se pudo crear el estado de promoción";
      })
      .addCase(updatePromotionStatus.fulfilled, (state, action) => {
        const index = state.promotionStatuses.findIndex(
          (s) => s.id === action.payload.id,
        );
        if (index !== -1) {
          state.promotionStatuses[index] = action.payload;
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(updatePromotionStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudo actualizar el estado de promoción";
      })
      .addCase(deletePromotionStatus.fulfilled, (state, action) => {
        const index = state.promotionStatuses.findIndex(
          (s) => s.id === action.payload.id,
        );
        if (index !== -1) {
          state.promotionStatuses[index] = action.payload;
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(deletePromotionStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudo eliminar el estado de promoción";
      });
  },
});

export const { clearPromotionStatusError } = promotionStatusSlice.actions;
export default promotionStatusSlice.reducer;
