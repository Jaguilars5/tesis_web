import { createSlice } from '@reduxjs/toolkit'
import type { StudentsState } from '../types/student.types'
import {
  fetchStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from './student.thunks'

const initialState: StudentsState = {
  entities: [],
  status: 'idle',
  error: null,
}

const studentSlice = createSlice({
  name: 'students/student',
  initialState,
  reducers: {
    clearStudentsError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.entities = action.payload
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'No se pudieron cargar los estudiantes'
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.entities.unshift(action.payload)
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'No se pudo crear el estudiante'
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        const index = state.entities.findIndex((s) => s.id === action.payload.id)
        if (index !== -1) {
          state.entities[index] = action.payload
        }
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'No se pudo actualizar el estudiante'
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        const index = state.entities.findIndex((s) => s.id === action.payload.id)
        if (index !== -1) {
          state.entities[index] = action.payload
        }
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'No se pudo eliminar el estudiante'
      })
  },
})

export const { clearStudentsError } = studentSlice.actions
export default studentSlice.reducer
