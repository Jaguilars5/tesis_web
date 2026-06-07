import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { normalizeThunkError } from "@shared/utils/normalizeThunkError";
import { SCHOOL_YEAR_THUNKS } from "../constants/school-year.constants";
import type { SchoolYearT } from "../domain/entities/school-year.types";
import type { SchoolYearStateT } from "./school-year.reducer.types";
import { listSchoolYearsUseCase } from "../application/use-cases/list.usecase";
import { createSchoolYearUseCase } from "../application/use-cases/create.usecase";
import { updateSchoolYearUseCase } from "../application/use-cases/update.usecase";
import { softDeleteSchoolYearUseCase } from "../application/use-cases/soft-delete.usecase";

const initialState: SchoolYearStateT = {
  schoolYears: [],
  status: "idle",
  error: null,
};

export const fetchSchoolYears = createAsyncThunk<
  SchoolYearT[],
  { page?: number; pageSize?: number } | undefined,
  { rejectValue: string }
>(SCHOOL_YEAR_THUNKS.FETCH, async (params, { rejectWithValue }) => {
  try {
    return await listSchoolYearsUseCase(params);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const createSchoolYear = createAsyncThunk<
  SchoolYearT,
  Omit<SchoolYearT, "id" | "is_active">,
  { rejectValue: string }
>(SCHOOL_YEAR_THUNKS.CREATE, async (data, { rejectWithValue }) => {
  try {
    return await createSchoolYearUseCase(data);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const updateSchoolYear = createAsyncThunk<
  SchoolYearT,
  { id: number; data: Partial<SchoolYearT> },
  { rejectValue: string }
>(SCHOOL_YEAR_THUNKS.UPDATE, async ({ id, data }, { rejectWithValue }) => {
  try {
    return await updateSchoolYearUseCase(id, data);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const deleteSchoolYear = createAsyncThunk<
  SchoolYearT,
  number,
  { rejectValue: string }
>(SCHOOL_YEAR_THUNKS.DELETE, async (id, { rejectWithValue }) => {
  try {
    return await softDeleteSchoolYearUseCase(id);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

const schoolYearSlice = createSlice({
  name: "schoolYear",
  initialState,
  reducers: {
    clearSchoolYearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchoolYears.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSchoolYears.fulfilled, (state, action) => {
        state.schoolYears = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchSchoolYears.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Error al cargar años escolares";
      })
      .addCase(createSchoolYear.fulfilled, (state, action) => {
        state.schoolYears.unshift(action.payload);
        state.status = "succeeded";
      })
      .addCase(createSchoolYear.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Error al crear año escolar";
      })
      .addCase(updateSchoolYear.fulfilled, (state, action) => {
        const index = state.schoolYears.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) state.schoolYears[index] = action.payload;
        state.status = "succeeded";
      })
      .addCase(updateSchoolYear.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Error al actualizar año escolar";
      })
      .addCase(deleteSchoolYear.fulfilled, (state, action) => {
        const index = state.schoolYears.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) state.schoolYears[index] = action.payload;
        state.status = "succeeded";
      })
      .addCase(deleteSchoolYear.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Error al eliminar año escolar";
      });
  },
});

export const { clearSchoolYearError } = schoolYearSlice.actions;
export default schoolYearSlice.reducer;
