import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { normalizeThunkError } from "@shared/utils/normalizeThunkError";
import { EVALUATION_BLOCKS_THUNKS } from "../constants/evaluation-block.constants";
import type { EvaluationBlockT } from "../domain/entities/evaluation-block.types";
import type { EvaluationBlocksStateT } from "./evaluation-blocks.reducer.types";
import { listEvaluationBlocksUseCase } from "../application/use-cases/list.usecase";
import { createEvaluationBlockUseCase } from "../application/use-cases/create.usecase";
import { updateEvaluationBlockUseCase } from "../application/use-cases/update.usecase";
import { softDeleteEvaluationBlockUseCase } from "../application/use-cases/soft-delete.usecase";

const initialState: EvaluationBlocksStateT = {
  evaluationBlocks: [],
  status: "idle",
  error: null,
};

export const fetchEvaluationBlocks = createAsyncThunk<
  EvaluationBlockT[],
  void,
  { rejectValue: string }
>(EVALUATION_BLOCKS_THUNKS.FETCH, async (_, { rejectWithValue }) => {
  try {
    return await listEvaluationBlocksUseCase();
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const createEvaluationBlock = createAsyncThunk<
  EvaluationBlockT,
  Omit<EvaluationBlockT, "id" | "is_active" | "academic_period_name">,
  { rejectValue: string }
>(EVALUATION_BLOCKS_THUNKS.CREATE, async (data, { rejectWithValue }) => {
  try {
    return await createEvaluationBlockUseCase(data);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const updateEvaluationBlock = createAsyncThunk<
  EvaluationBlockT,
  { id: number; data: Partial<EvaluationBlockT> },
  { rejectValue: string }
>(EVALUATION_BLOCKS_THUNKS.UPDATE, async ({ id, data }, { rejectWithValue }) => {
  try {
    return await updateEvaluationBlockUseCase(id, data);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const deleteEvaluationBlock = createAsyncThunk<
  EvaluationBlockT,
  number,
  { rejectValue: string }
>(EVALUATION_BLOCKS_THUNKS.DELETE, async (id, { rejectWithValue }) => {
  try {
    return await softDeleteEvaluationBlockUseCase(id);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

const evaluationBlockSlice = createSlice({
  name: "evaluationBlocks",
  initialState,
  reducers: {
    clearEvaluationBlockError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvaluationBlocks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchEvaluationBlocks.fulfilled, (state, action) => {
        state.evaluationBlocks = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchEvaluationBlocks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Error al cargar bloques de evaluacion";
      })
      .addCase(createEvaluationBlock.fulfilled, (state, action) => {
        state.evaluationBlocks.unshift(action.payload);
        state.status = "succeeded";
      })
      .addCase(createEvaluationBlock.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Error al crear bloque de evaluacion";
      })
      .addCase(updateEvaluationBlock.fulfilled, (state, action) => {
        const index = state.evaluationBlocks.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) state.evaluationBlocks[index] = action.payload;
        state.status = "succeeded";
      })
      .addCase(updateEvaluationBlock.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Error al actualizar bloque de evaluacion";
      })
      .addCase(deleteEvaluationBlock.fulfilled, (state, action) => {
        const index = state.evaluationBlocks.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) state.evaluationBlocks[index] = action.payload;
        state.status = "succeeded";
      })
      .addCase(deleteEvaluationBlock.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Error al eliminar bloque de evaluacion";
      });
  },
});

export const { clearEvaluationBlockError } = evaluationBlockSlice.actions;
export default evaluationBlockSlice.reducer;
