import { createAsyncThunk } from "@reduxjs/toolkit";

import { TEACHER_SUBJECT_SECTION_THUNKS } from "../constants/teacher-subject-section.constants";
import { teacherSubjectSectionApiService } from "../infrastructure/teacher-subject-section.api.service";
import type { TeacherSubjectSectionT } from "../domain/teacher-subject-section.entity";

function normalizeThunkError(error: unknown) {
  if (error instanceof Error) return error.message;
  return "No se pudo completar la operacion";
}

export const fetchTeacherSubjectSections = createAsyncThunk<
  TeacherSubjectSectionT[],
  { page?: number; pageSize?: number } | undefined,
  { rejectValue: string }
>(TEACHER_SUBJECT_SECTION_THUNKS.FETCH, async (payload, { rejectWithValue }) => {
  try {
    return await teacherSubjectSectionApiService.list(payload);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const fetchTeacherSubjectSection = createAsyncThunk<
  TeacherSubjectSectionT,
  { id: number },
  { rejectValue: string }
>(TEACHER_SUBJECT_SECTION_THUNKS.FETCH, async (payload, { rejectWithValue }) => {
  try {
    return await teacherSubjectSectionApiService.get(payload.id);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const createTeacherSubjectSection = createAsyncThunk<
  TeacherSubjectSectionT,
  Omit<TeacherSubjectSectionT, "id" | "is_active" | "user_name" | "subject_offering_name">,
  { rejectValue: string }
>(TEACHER_SUBJECT_SECTION_THUNKS.CREATE, async (payload, { rejectWithValue }) => {
  try {
    return await teacherSubjectSectionApiService.create(payload);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const updateTeacherSubjectSection = createAsyncThunk<
  TeacherSubjectSectionT,
  { id: number } & Partial<TeacherSubjectSectionT>,
  { rejectValue: string }
>(TEACHER_SUBJECT_SECTION_THUNKS.UPDATE, async (payload, { rejectWithValue }) => {
  try {
    const { id, ...data } = payload;
    return await teacherSubjectSectionApiService.update(id, data);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const deleteTeacherSubjectSection = createAsyncThunk<
  TeacherSubjectSectionT,
  { id: number },
  { rejectValue: string }
>(TEACHER_SUBJECT_SECTION_THUNKS.DELETE, async (payload, { rejectWithValue }) => {
  try {
    return await teacherSubjectSectionApiService.softDelete(payload.id);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});
