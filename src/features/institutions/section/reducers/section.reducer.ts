import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { normalizeThunkError } from "@shared/utils/normalizeThunkError";
import { SECTION_THUNKS } from "../constants/section.constants";
import type { SectionT } from "../domain/entities/section.types";
import type { SectionStateT } from "./section.reducer.types";
import { listSectionsUseCase } from "../application/use-cases/list.usecase";
import { createSectionUseCase } from "../application/use-cases/create.usecase";
import { updateSectionUseCase } from "../application/use-cases/update.usecase";
import { softDeleteSectionUseCase } from "../application/use-cases/soft-delete.usecase";

const initialState: SectionStateT = {
  sections: [],
  status: "idle",
  error: null,
};

export const fetchSections = createAsyncThunk<
  SectionT[],
  { page?: number; pageSize?: number } | undefined,
  { rejectValue: string }
>(SECTION_THUNKS.FETCH, async (params, { rejectWithValue }) => {
  try {
    return await listSectionsUseCase(params);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const createSection = createAsyncThunk<
  SectionT,
  Omit<SectionT, "id" | "is_active" | "school_year_name" | "academic_grade_name">,
  { rejectValue: string }
>(SECTION_THUNKS.CREATE, async (data, { rejectWithValue }) => {
  try {
    return await createSectionUseCase(data);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const updateSection = createAsyncThunk<
  SectionT,
  { id: number; data: Partial<SectionT> },
  { rejectValue: string }
>(SECTION_THUNKS.UPDATE, async ({ id, data }, { rejectWithValue }) => {
  try {
    return await updateSectionUseCase(id, data);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const deleteSection = createAsyncThunk<
  SectionT,
  number,
  { rejectValue: string }
>(SECTION_THUNKS.DELETE, async (id, { rejectWithValue }) => {
  try {
    return await softDeleteSectionUseCase(id);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

const sectionSlice = createSlice({
  name: "section",
  initialState,
  reducers: {
    clearSectionError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSections.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSections.fulfilled, (state, action) => {
        state.sections = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchSections.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Error al cargar secciones";
      })
      .addCase(createSection.fulfilled, (state, action) => {
        state.sections.unshift(action.payload);
        state.status = "succeeded";
      })
      .addCase(createSection.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Error al crear seccion";
      })
      .addCase(updateSection.fulfilled, (state, action) => {
        const index = state.sections.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) state.sections[index] = action.payload;
        state.status = "succeeded";
      })
      .addCase(updateSection.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Error al actualizar seccion";
      })
      .addCase(deleteSection.fulfilled, (state, action) => {
        const index = state.sections.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) state.sections[index] = action.payload;
        state.status = "succeeded";
      })
      .addCase(deleteSection.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Error al eliminar seccion";
      });
  },
});

export const { clearSectionError } = sectionSlice.actions;
export default sectionSlice.reducer;
