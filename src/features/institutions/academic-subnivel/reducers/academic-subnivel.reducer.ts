import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { normalizeThunkError } from "@shared/utils/normalizeThunkError";
import { ACADEMIC_SUBNIVEL_THUNKS } from "../constants/academic-subnivel.constants";
import type { AcademicSubnivelT } from "../domain/entities/academic-subnivel.types";
import type { AcademicSubnivelStateT } from "./academic-subnivel.reducer.types";
import { listAcademicSubnivelsUseCase } from "../application/use-cases/list.usecase";
import { createAcademicSubnivelUseCase } from "../application/use-cases/create.usecase";
import { updateAcademicSubnivelUseCase } from "../application/use-cases/update.usecase";
import { softDeleteAcademicSubnivelUseCase } from "../application/use-cases/soft-delete.usecase";

const initialState: AcademicSubnivelStateT = {
  academicSubnivels: [],
  status: "idle",
  error: null,
};

export const fetchAcademicSubnivels = createAsyncThunk<
  AcademicSubnivelT[],
  { page?: number; pageSize?: number } | undefined,
  { rejectValue: string }
>(ACADEMIC_SUBNIVEL_THUNKS.FETCH, async (params, { rejectWithValue }) => {
  try {
    return await listAcademicSubnivelsUseCase(params);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const createAcademicSubnivel = createAsyncThunk<
  AcademicSubnivelT,
  Omit<AcademicSubnivelT, "id" | "is_active" | "academic_level_name">,
  { rejectValue: string }
>(ACADEMIC_SUBNIVEL_THUNKS.CREATE, async (data, { rejectWithValue }) => {
  try {
    return await createAcademicSubnivelUseCase(data);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const updateAcademicSubnivel = createAsyncThunk<
  AcademicSubnivelT,
  { id: number; data: Partial<AcademicSubnivelT> },
  { rejectValue: string }
>(ACADEMIC_SUBNIVEL_THUNKS.UPDATE, async ({ id, data }, { rejectWithValue }) => {
  try {
    return await updateAcademicSubnivelUseCase(id, data);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const deleteAcademicSubnivel = createAsyncThunk<
  AcademicSubnivelT,
  number,
  { rejectValue: string }
>(ACADEMIC_SUBNIVEL_THUNKS.DELETE, async (id, { rejectWithValue }) => {
  try {
    return await softDeleteAcademicSubnivelUseCase(id);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

const academicSubnivelSlice = createSlice({
  name: "academicSubnivel",
  initialState,
  reducers: {
    clearAcademicSubnivelError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAcademicSubnivels.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAcademicSubnivels.fulfilled, (state, action) => {
        state.academicSubnivels = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchAcademicSubnivels.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Error al cargar subniveles";
      })
      .addCase(createAcademicSubnivel.fulfilled, (state, action) => {
        state.academicSubnivels.unshift(action.payload);
        state.status = "succeeded";
      })
      .addCase(createAcademicSubnivel.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Error al crear subnivel";
      })
      .addCase(updateAcademicSubnivel.fulfilled, (state, action) => {
        const index = state.academicSubnivels.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) state.academicSubnivels[index] = action.payload;
        state.status = "succeeded";
      })
      .addCase(updateAcademicSubnivel.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Error al actualizar subnivel";
      })
      .addCase(deleteAcademicSubnivel.fulfilled, (state, action) => {
        const index = state.academicSubnivels.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) state.academicSubnivels[index] = action.payload;
        state.status = "succeeded";
      })
      .addCase(deleteAcademicSubnivel.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Error al eliminar subnivel";
      });
  },
});

export const { clearAcademicSubnivelError } = academicSubnivelSlice.actions;
export default academicSubnivelSlice.reducer;
