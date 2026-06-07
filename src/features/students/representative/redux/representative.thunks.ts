import { createAsyncThunk } from '@reduxjs/toolkit'
import { representativeApiService } from '../services'
import type {
  Representative,
  RepresentativeCreateRequest,
  RepresentativeDeleteRequest,
  RepresentativeUpdateRequest,
} from '../types/representative.types'
import { normalizeThunkError } from '@shared/utils/normalizeThunkError'

export const fetchRepresentatives = createAsyncThunk<Representative[], void, { rejectValue: string }>(
  'students/representative/fetchRepresentatives',
  async (_, { rejectWithValue }) => {
    try {
      return await representativeApiService.list()
    } catch (error) {
      return rejectWithValue(normalizeThunkError(error))
    }
  }
)

export const createRepresentative = createAsyncThunk<Representative, RepresentativeCreateRequest, { rejectValue: string }>(
  'students/representative/createRepresentative',
  async (payload, { rejectWithValue }) => {
    try {
      return await representativeApiService.create(payload)
    } catch (error) {
      return rejectWithValue(normalizeThunkError(error))
    }
  }
)

export const updateRepresentative = createAsyncThunk<Representative, RepresentativeUpdateRequest, { rejectValue: string }>(
  'students/representative/updateRepresentative',
  async (payload, { rejectWithValue }) => {
    try {
      return await representativeApiService.update(payload)
    } catch (error) {
      return rejectWithValue(normalizeThunkError(error))
    }
  }
)

export const deleteRepresentative = createAsyncThunk<Representative, RepresentativeDeleteRequest, { rejectValue: string }>(
  'students/representative/deleteRepresentative',
  async (payload, { rejectWithValue }) => {
    try {
      return await representativeApiService.softDelete(payload)
    } catch (error) {
      return rejectWithValue(normalizeThunkError(error))
    }
  }
)
