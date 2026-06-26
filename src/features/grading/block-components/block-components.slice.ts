import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { BlockComponentT } from "./block-components.types";

export interface BlockComponentsStateT {
  items: BlockComponentT[];
  status: RequestStatusT;
  error: string | null;
}

const initialState: BlockComponentsStateT = {
  items: [],
  status: "idle",
  error: null,
};

const blockComponentsSlice = createSlice({
  name: "blockComponents",
  initialState,
  reducers: {
    loadPending(state) { state.status = "loading"; state.error = null; },
    loadSuccess(state, action: PayloadAction<BlockComponentT[]>) { state.items = action.payload; state.status = "succeeded"; },
    loadError(state, action: PayloadAction<string>) { state.status = "failed"; state.error = action.payload; },
    entityCreated(state, action: PayloadAction<BlockComponentT>) { state.items.unshift(action.payload); state.status = "succeeded"; },
    entityUpdated(state, action: PayloadAction<BlockComponentT>) {
      const idx = state.items.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
      state.status = "succeeded";
    },
    entityDeleted(state, action: PayloadAction<number>) {
      state.items = state.items.filter((p) => p.id !== action.payload);
      state.status = "succeeded";
    },
    mutationError(state, action: PayloadAction<string>) { state.status = "failed"; state.error = action.payload; },
    clearBlockComponentsError(state) { state.error = null; },
  },
});

export const {
  loadPending, loadSuccess, loadError,
  entityCreated, entityUpdated, entityDeleted,
  mutationError, clearBlockComponentsError,
} = blockComponentsSlice.actions;

export const selectItems = (state: RootState): BlockComponentT[] => state.grading.blockComponents.items;
export const selectStatus = (state: RootState): RequestStatusT => state.grading.blockComponents.status;
export const selectError = (state: RootState): string | null => state.grading.blockComponents.error;

export const blockComponentsReducer = blockComponentsSlice.reducer;
export default blockComponentsSlice.reducer;
