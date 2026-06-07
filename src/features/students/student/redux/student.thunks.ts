import { createAsyncThunk } from '@reduxjs/toolkit'
import { studentApiService } from '../services'
import type {
  Student,
  StudentCreateRequest,
  StudentDeleteRequest,
  StudentUpdateRequest,
} from '../types/student.types'
import { normalizeThunkError } from '@shared/utils/normalizeThunkError'

export const fetchStudents = createAsyncThunk<Student[], void, { rejectValue: string }>(
  'students/student/fetchStudents',
  async (_, { rejectWithValue }) => {
    try {
      return await studentApiService.list()
    } catch (error) {
      return rejectWithValue(normalizeThunkError(error))
    }
  }
)

export const createStudent = createAsyncThunk<Student, StudentCreateRequest, { rejectValue: string }>(
  'students/student/createStudent',
  async (payload, { rejectWithValue }) => {
    try {
      return await studentApiService.create(payload)
    } catch (error) {
      return rejectWithValue(normalizeThunkError(error))
    }
  }
)

export const updateStudent = createAsyncThunk<Student, StudentUpdateRequest, { rejectValue: string }>(
  'students/student/updateStudent',
  async (payload, { rejectWithValue }) => {
    try {
      return await studentApiService.update(payload)
    } catch (error) {
      return rejectWithValue(normalizeThunkError(error))
    }
  }
)

export const deleteStudent = createAsyncThunk<Student, StudentDeleteRequest, { rejectValue: string }>(
  'students/student/deleteStudent',
  async (payload, { rejectWithValue }) => {
    try {
      return await studentApiService.softDelete(payload)
    } catch (error) {
      return rejectWithValue(normalizeThunkError(error))
    }
  }
)
