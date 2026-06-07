import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { normalizeThunkError } from "@shared/utils/normalizeThunkError";
import { createAcademicGradeUseCase } from "../application/use-cases/create.usecase";
import { listAcademicGradesUseCase } from "../application/use-cases/list.usecase";
import { softDeleteAcademicGradeUseCase } from "../application/use-cases/soft-delete.usecase";
import { updateAcademicGradeUseCase } from "../application/use-cases/update.usecase";
import { ACADEMIC_GRADE_THUNKS } from "../domain/constants/academic-grade.constants";
import type { AcademicGradeT } from "../domain/entities/academic-grade.types";
import type { AcademicGradeStateT } from "./academic-grade.reducer.types";

const initialState: AcademicGradeStateT = {
  academicGrades: [],
  status: "idle",
  error: null,
};

export const fetchAcademicGrades = createAsyncThunk<
  AcademicGradeT[],
  { page?: number; pageSize?: number } | undefined,
  { rejectValue: string }
>(ACADEMIC_GRADE_THUNKS.FETCH, async (params, { rejectWithValue }) => {
  try {
    return await listAcademicGradesUseCase(params);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const createAcademicGrade = createAsyncThunk<
  AcademicGradeT,
  Omit<AcademicGradeT, "id" | "is_active" | "academic_level_name">,
  { rejectValue: string }
>(ACADEMIC_GRADE_THUNKS.CREATE, async (data, { rejectWithValue }) => {
  try {
    return await createAcademicGradeUseCase(data);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const updateAcademicGrade = createAsyncThunk<
  AcademicGradeT,
  { id: number; data: Partial<AcademicGradeT> },
  { rejectValue: string }
>(ACADEMIC_GRADE_THUNKS.UPDATE, async ({ id, data }, { rejectWithValue }) => {
  try {
    return await updateAcademicGradeUseCase(id, data);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const deleteAcademicGrade = createAsyncThunk<
  AcademicGradeT,
  number,
  { rejectValue: string }
>(ACADEMIC_GRADE_THUNKS.DELETE, async (id, { rejectWithValue }) => {
  try {
    return await softDeleteAcademicGradeUseCase(id);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

const academicGradeSlice = createSlice({
  name: "academicGrade",
  initialState,
  reducers: {
    clearAcademicGradeError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAcademicGrades.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAcademicGrades.fulfilled, (state, action) => {
        state.academicGrades = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchAcademicGrades.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Error al cargar grados academicos";
      })
      .addCase(createAcademicGrade.fulfilled, (state, action) => {
        state.academicGrades.unshift(action.payload);
        state.status = "succeeded";
      })
      .addCase(createAcademicGrade.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Error al crear grado academico";
      })
      .addCase(updateAcademicGrade.fulfilled, (state, action) => {
        const index = state.academicGrades.findIndex(
          (g) => g.id === action.payload.id,
        );
        if (index !== -1) state.academicGrades[index] = action.payload;
        state.status = "succeeded";
      })
      .addCase(updateAcademicGrade.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Error al actualizar grado academico";
      })
      .addCase(deleteAcademicGrade.fulfilled, (state, action) => {
        const index = state.academicGrades.findIndex(
          (g) => g.id === action.payload.id,
        );
        if (index !== -1) state.academicGrades[index] = action.payload;
        state.status = "succeeded";
      })
      .addCase(deleteAcademicGrade.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Error al eliminar grado academico";
      });
  },
});

export const { clearAcademicGradeError } = academicGradeSlice.actions;
export default academicGradeSlice.reducer;
