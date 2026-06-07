import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { normalizeThunkError } from "@shared/utils/normalizeThunkError";
import { INTERDISCIPLINARY_PROJECT_THUNKS } from "../constants/interdisciplinary-project.constants";
import type { InterdisciplinaryProjectT } from "../domain/entities/interdisciplinary-project.types";
import type { InterdisciplinaryProjectStateT } from "./interdisciplinary-project.reducer.types";
import { listInterdisciplinaryProjectsUseCase } from "../application/use-cases/list.usecase";
import { createInterdisciplinaryProjectUseCase } from "../application/use-cases/create.usecase";
import { updateInterdisciplinaryProjectUseCase } from "../application/use-cases/update.usecase";
import { softDeleteInterdisciplinaryProjectUseCase } from "../application/use-cases/soft-delete.usecase";

const initialState: InterdisciplinaryProjectStateT = {
  interdisciplinaryProjects: [],
  status: "idle",
  error: null,
};

export const fetchInterdisciplinaryProjects = createAsyncThunk<
  InterdisciplinaryProjectT[],
  { page?: number; pageSize?: number } | undefined,
  { rejectValue: string }
>(INTERDISCIPLINARY_PROJECT_THUNKS.FETCH, async (params, { rejectWithValue }) => {
  try {
    return await listInterdisciplinaryProjectsUseCase(params);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const createInterdisciplinaryProject = createAsyncThunk<
  InterdisciplinaryProjectT,
  Omit<InterdisciplinaryProjectT, "id" | "is_active" | "academic_period_name">,
  { rejectValue: string }
>(INTERDISCIPLINARY_PROJECT_THUNKS.CREATE, async (data, { rejectWithValue }) => {
  try {
    return await createInterdisciplinaryProjectUseCase(data);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const updateInterdisciplinaryProject = createAsyncThunk<
  InterdisciplinaryProjectT,
  { id: number; data: Partial<InterdisciplinaryProjectT> },
  { rejectValue: string }
>(INTERDISCIPLINARY_PROJECT_THUNKS.UPDATE, async ({ id, data }, { rejectWithValue }) => {
  try {
    return await updateInterdisciplinaryProjectUseCase(id, data);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const deleteInterdisciplinaryProject = createAsyncThunk<
  InterdisciplinaryProjectT,
  number,
  { rejectValue: string }
>(INTERDISCIPLINARY_PROJECT_THUNKS.DELETE, async (id, { rejectWithValue }) => {
  try {
    return await softDeleteInterdisciplinaryProjectUseCase(id);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

const interdisciplinaryProjectSlice = createSlice({
  name: "interdisciplinaryProjects",
  initialState,
  reducers: {
    clearInterdisciplinaryProjectError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInterdisciplinaryProjects.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchInterdisciplinaryProjects.fulfilled, (state, action) => {
        state.interdisciplinaryProjects = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchInterdisciplinaryProjects.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Error al cargar proyectos interdisciplinarios";
      })
      .addCase(createInterdisciplinaryProject.fulfilled, (state, action) => {
        state.interdisciplinaryProjects.unshift(action.payload);
        state.status = "succeeded";
      })
      .addCase(createInterdisciplinaryProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Error al crear proyecto interdisciplinario";
      })
      .addCase(updateInterdisciplinaryProject.fulfilled, (state, action) => {
        const index = state.interdisciplinaryProjects.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.interdisciplinaryProjects[index] = action.payload;
        state.status = "succeeded";
      })
      .addCase(updateInterdisciplinaryProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Error al actualizar proyecto interdisciplinario";
      })
      .addCase(deleteInterdisciplinaryProject.fulfilled, (state, action) => {
        const index = state.interdisciplinaryProjects.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.interdisciplinaryProjects[index] = action.payload;
        state.status = "succeeded";
      })
      .addCase(deleteInterdisciplinaryProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Error al eliminar proyecto interdisciplinario";
      });
  },
});

export const { clearInterdisciplinaryProjectError } = interdisciplinaryProjectSlice.actions;
export default interdisciplinaryProjectSlice.reducer;
