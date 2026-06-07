import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { normalizeThunkError } from "@shared/utils/normalizeThunkError";
import { SUBJECT_PROJECT_THUNKS } from "../constants/subject-project.constants";
import type { SubjectProjectT } from "../domain/entities/subject-project.types";
import type { SubjectProjectStateT } from "./subject-project.reducer.types";
import { listSubjectProjectsUseCase } from "../application/use-cases/list.usecase";
import { createSubjectProjectUseCase } from "../application/use-cases/create.usecase";
import { deleteSubjectProjectUseCase } from "../application/use-cases/delete.usecase";

const initialState: SubjectProjectStateT = {
  subjectProjects: [],
  status: "idle",
  error: null,
};

export const fetchSubjectProjects = createAsyncThunk<
  SubjectProjectT[],
  { page?: number; pageSize?: number } | undefined,
  { rejectValue: string }
>(SUBJECT_PROJECT_THUNKS.FETCH, async (params, { rejectWithValue }) => {
  try {
    return await listSubjectProjectsUseCase(params);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const createSubjectProject = createAsyncThunk<
  SubjectProjectT,
  Omit<SubjectProjectT, "id" | "interdisciplinary_project_title" | "subject_offering_name">,
  { rejectValue: string }
>(SUBJECT_PROJECT_THUNKS.CREATE, async (data, { rejectWithValue }) => {
  try {
    return await createSubjectProjectUseCase(data);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const deleteSubjectProject = createAsyncThunk<
  void,
  number,
  { rejectValue: string }
>(SUBJECT_PROJECT_THUNKS.DELETE, async (id, { rejectWithValue }) => {
  try {
    await deleteSubjectProjectUseCase(id);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

const subjectProjectSlice = createSlice({
  name: "subjectProjects",
  initialState,
  reducers: {
    clearSubjectProjectError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubjectProjects.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSubjectProjects.fulfilled, (state, action) => {
        state.subjectProjects = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchSubjectProjects.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "No se pudieron cargar las asignaturas de proyecto";
      })
      .addCase(createSubjectProject.fulfilled, (state, action) => {
        state.subjectProjects.unshift(action.payload);
        state.status = "succeeded";
      })
      .addCase(createSubjectProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "No se pudo asociar la materia al proyecto";
      })
      .addCase(deleteSubjectProject.fulfilled, (state, action) => {
        state.subjectProjects = state.subjectProjects.filter((s) => s.id !== action.meta.arg);
        state.status = "succeeded";
      })
      .addCase(deleteSubjectProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "No se pudo eliminar la asignatura de proyecto";
      });
  },
});

export const { clearSubjectProjectError } = subjectProjectSlice.actions;
export default subjectProjectSlice.reducer;
