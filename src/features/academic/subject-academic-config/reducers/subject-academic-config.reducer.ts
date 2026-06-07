import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { normalizeThunkError } from "@shared/utils/normalizeThunkError";
import { SUBJECT_ACADEMIC_CONFIG_THUNKS } from "../constants/subject-academic-config.constants";
import type { SubjectAcademicConfigT } from "../domain/entities/subject-academic-config.entity";
import type { SubjectAcademicConfigStateT } from "./subject-academic-config.reducer.types";

const initialState: SubjectAcademicConfigStateT = {
  subjectAcademicConfigs: [],
  status: "idle",
  error: null,
};

export const fetchSubjectAcademicConfigs = createAsyncThunk<
  SubjectAcademicConfigT[],
  { page?: number; pageSize?: number } | undefined,
  { rejectValue: string }
>(SUBJECT_ACADEMIC_CONFIG_THUNKS.FETCH, async (_, { rejectWithValue }) => {
  try {
    const { listSubjectAcademicConfigsUseCase } = await import("../application/use-cases/list.usecase");
    return await listSubjectAcademicConfigsUseCase();
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

const subjectAcademicConfigSlice = createSlice({
  name: "subjectAcademicConfigs",
  initialState,
  reducers: {
    clearSubjectAcademicConfigError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubjectAcademicConfigs.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSubjectAcademicConfigs.fulfilled, (state, action) => {
        state.subjectAcademicConfigs = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchSubjectAcademicConfigs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Error al cargar configuraciones";
      });
  },
});

export const { clearSubjectAcademicConfigError } = subjectAcademicConfigSlice.actions;
export default subjectAcademicConfigSlice.reducer;
