import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { normalizeThunkError } from "@shared/utils/normalizeThunkError";
import { SUBJECT_OFFERING_THUNKS } from "../constants/subject-offering.constants";
import type { SubjectOfferingT } from "../domain/entities/subject-offering.types";
import type { SubjectOfferingStateT } from "./subject-offering.reducer.types";
import { listSubjectOfferingsUseCase } from "../application/use-cases/list.usecase";
import { createSubjectOfferingUseCase } from "../application/use-cases/create.usecase";
import { updateSubjectOfferingUseCase } from "../application/use-cases/update.usecase";
import { softDeleteSubjectOfferingUseCase } from "../application/use-cases/soft-delete.usecase";

const initialState: SubjectOfferingStateT = {
  subjectOfferings: [],
  status: "idle",
  error: null,
};

export const fetchSubjectOfferings = createAsyncThunk<
  SubjectOfferingT[],
  { page?: number; pageSize?: number } | undefined,
  { rejectValue: string }
>(SUBJECT_OFFERING_THUNKS.FETCH, async (params, { rejectWithValue }) => {
  try {
    return await listSubjectOfferingsUseCase(params);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const createSubjectOffering = createAsyncThunk<
  SubjectOfferingT,
  Omit<SubjectOfferingT, "id" | "is_active" | "school_year_name" | "section_name" | "subject_academic_config_name">,
  { rejectValue: string }
>(SUBJECT_OFFERING_THUNKS.CREATE, async (data, { rejectWithValue }) => {
  try {
    return await createSubjectOfferingUseCase(data);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const updateSubjectOffering = createAsyncThunk<
  SubjectOfferingT,
  { id: number; data: Partial<SubjectOfferingT> },
  { rejectValue: string }
>(SUBJECT_OFFERING_THUNKS.UPDATE, async ({ id, data }, { rejectWithValue }) => {
  try {
    return await updateSubjectOfferingUseCase(id, data);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const deleteSubjectOffering = createAsyncThunk<
  SubjectOfferingT,
  number,
  { rejectValue: string }
>(SUBJECT_OFFERING_THUNKS.DELETE, async (id, { rejectWithValue }) => {
  try {
    return await softDeleteSubjectOfferingUseCase(id);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

const subjectOfferingSlice = createSlice({
  name: "subjectOfferings",
  initialState,
  reducers: {
    clearSubjectOfferingError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubjectOfferings.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSubjectOfferings.fulfilled, (state, action) => {
        state.subjectOfferings = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchSubjectOfferings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Error al cargar ofertas de materia";
      })
      .addCase(createSubjectOffering.fulfilled, (state, action) => {
        state.subjectOfferings.unshift(action.payload);
        state.status = "succeeded";
      })
      .addCase(createSubjectOffering.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Error al crear oferta de materia";
      })
      .addCase(updateSubjectOffering.fulfilled, (state, action) => {
        const index = state.subjectOfferings.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) state.subjectOfferings[index] = action.payload;
        state.status = "succeeded";
      })
      .addCase(updateSubjectOffering.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Error al actualizar oferta de materia";
      })
      .addCase(deleteSubjectOffering.fulfilled, (state, action) => {
        const index = state.subjectOfferings.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) state.subjectOfferings[index] = action.payload;
        state.status = "succeeded";
      })
      .addCase(deleteSubjectOffering.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Error al eliminar oferta de materia";
      });
  },
});

export const { clearSubjectOfferingError } = subjectOfferingSlice.actions;
export default subjectOfferingSlice.reducer;
