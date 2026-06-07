import { createSlice } from '@reduxjs/toolkit'
import type { RepresentativesState } from '../types/representative.types'
import {
  fetchRepresentatives,
  createRepresentative,
  updateRepresentative,
  deleteRepresentative,
} from './representative.thunks'

const initialState: RepresentativesState = {
  entities: [],
  status: 'idle',
  error: null,
}

const representativeSlice = createSlice({
  name: 'students/representative',
  initialState,
  reducers: {
    clearRepresentativesError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRepresentatives.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchRepresentatives.fulfilled, (state, action) => {
        state.entities = action.payload
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(fetchRepresentatives.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'No se pudieron cargar los representantes'
      })
      .addCase(createRepresentative.fulfilled, (state, action) => {
        state.entities.unshift(action.payload)
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(createRepresentative.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'No se pudo crear el representante'
      })
      .addCase(updateRepresentative.fulfilled, (state, action) => {
        const index = state.entities.findIndex((r) => r.id === action.payload.id)
        if (index !== -1) {
          state.entities[index] = action.payload
        }
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(updateRepresentative.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'No se pudo actualizar el representante'
      })
      .addCase(deleteRepresentative.fulfilled, (state, action) => {
        const index = state.entities.findIndex((r) => r.id === action.payload.id)
        if (index !== -1) {
          state.entities[index] = action.payload
        }
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(deleteRepresentative.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'No se pudo eliminar el representante'
      })
  },
})

export const { clearRepresentativesError } = representativeSlice.actions
export default representativeSlice.reducer
