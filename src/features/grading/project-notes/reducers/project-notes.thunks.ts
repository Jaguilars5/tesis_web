import { createAsyncThunk } from "@reduxjs/toolkit";
import { normalizeThunkError } from "@shared/utils/normalizeThunkError";
import { PROJECT_NOTES_THUNKS } from "../constants/project-notes.constants";
import { projectNoteApiRepository } from "../infrastructure/repositories/project-notes-api.repository";
import type { ProjectNoteT } from "../domain/entities/project-notes.types";
import type { ProjectNoteListParamsT } from "../domain/repositories/project-notes.repository";

export const fetchProjectNotes = createAsyncThunk<
  ProjectNoteT[],
  ProjectNoteListParamsT | undefined,
  { rejectValue: string }
>(PROJECT_NOTES_THUNKS.FETCH, async (params, { rejectWithValue }) => {
  try {
    return await projectNoteApiRepository.list(params);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const fetchProjectNote = createAsyncThunk<
  ProjectNoteT,
  number,
  { rejectValue: string }
>(PROJECT_NOTES_THUNKS.GET, async (id, { rejectWithValue }) => {
  try {
    return await projectNoteApiRepository.get(id);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const createProjectNote = createAsyncThunk<
  ProjectNoteT,
  Parameters<typeof projectNoteApiRepository.create>[0],
  { rejectValue: string }
>(PROJECT_NOTES_THUNKS.CREATE, async (payload, { rejectWithValue }) => {
  try {
    return await projectNoteApiRepository.create(payload);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const updateProjectNote = createAsyncThunk<
  ProjectNoteT,
  Partial<ProjectNoteT> & { id: number },
  { rejectValue: string }
>(PROJECT_NOTES_THUNKS.UPDATE, async ({ id, ...data }, { rejectWithValue }) => {
  try {
    return await projectNoteApiRepository.update(id, data);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const deleteProjectNote = createAsyncThunk<
  ProjectNoteT,
  number,
  { rejectValue: string }
>(PROJECT_NOTES_THUNKS.DELETE, async (id, { rejectWithValue }) => {
  try {
    return await projectNoteApiRepository.softDelete(id);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});
