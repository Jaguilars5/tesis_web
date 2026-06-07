import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { normalizeThunkError } from "@shared/utils/normalizeThunkError";
import { ACADEMIC_PERIOD_THUNKS } from "../constants/academic-period.constants";
import type { AcademicPeriodT } from "../domain/entities/academic-period.types";
import type { AcademicPeriodStateT } from "./academic-period.reducer.types";
import { listAcademicPeriodsUseCase } from "../application/use-cases/list.usecase";
import { createAcademicPeriodUseCase } from "../application/use-cases/create.usecase";
import { updateAcademicPeriodUseCase } from "../application/use-cases/update.usecase";
import { softDeleteAcademicPeriodUseCase } from "../application/use-cases/soft-delete.usecase";

const initialState: AcademicPeriodStateT = {
  academicPeriods: [],
  status: "idle",
  error: null,
};

export const fetchAcademicPeriods = createAsyncThunk<
  AcademicPeriodT[],
  { page?: number; pageSize?: number } | undefined,
  { rejectValue: string }
>(ACADEMIC_PERIOD_THUNKS.FETCH, async (params, { rejectWithValue }) => {
  try {
    return await listAcademicPeriodsUseCase(params);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const createAcademicPeriod = createAsyncThunk<
  AcademicPeriodT,
  Omit<AcademicPeriodT, "id" | "is_active" | "school_year_name">,
  { rejectValue: string }
>(ACADEMIC_PERIOD_THUNKS.CREATE, async (data, { rejectWithValue }) => {
  try {
    return await createAcademicPeriodUseCase(data);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const updateAcademicPeriod = createAsyncThunk<
  AcademicPeriodT,
  { id: number; data: Partial<AcademicPeriodT> },
  { rejectValue: string }
>(ACADEMIC_PERIOD_THUNKS.UPDATE, async ({ id, data }, { rejectWithValue }) => {
  try {
    return await updateAcademicPeriodUseCase(id, data);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const deleteAcademicPeriod = createAsyncThunk<
  AcademicPeriodT,
  number,
  { rejectValue: string }
>(ACADEMIC_PERIOD_THUNKS.DELETE, async (id, { rejectWithValue }) => {
  try {
    return await softDeleteAcademicPeriodUseCase(id);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

const academicPeriodSlice = createSlice({
  name: "academicPeriods",
  initialState,
  reducers: {
    clearAcademicPeriodError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAcademicPeriods.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAcademicPeriods.fulfilled, (state, action) => {
        state.academicPeriods = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchAcademicPeriods.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Error al cargar periodos academicos";
      })
      .addCase(createAcademicPeriod.fulfilled, (state, action) => {
        state.academicPeriods.unshift(action.payload);
        state.status = "succeeded";
      })
      .addCase(createAcademicPeriod.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Error al crear periodo academico";
      })
      .addCase(updateAcademicPeriod.fulfilled, (state, action) => {
        const index = state.academicPeriods.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.academicPeriods[index] = action.payload;
        state.status = "succeeded";
      })
      .addCase(updateAcademicPeriod.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Error al actualizar periodo academico";
      })
      .addCase(deleteAcademicPeriod.fulfilled, (state, action) => {
        const index = state.academicPeriods.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.academicPeriods[index] = action.payload;
        state.status = "succeeded";
      })
      .addCase(deleteAcademicPeriod.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Error al eliminar periodo academico";
      });
  },
});

export const { clearAcademicPeriodError } = academicPeriodSlice.actions;
export default academicPeriodSlice.reducer;
