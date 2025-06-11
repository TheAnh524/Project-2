import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { User } from '../../types/core.type'
import { RootState } from '../app'

// Define a type for the slice state
type AuthState = {
  isInitialized: boolean
  isAuthenticated: boolean
  user: User
}

// Define the initial state using that type
const initialState: AuthState = {
  isInitialized: false,
  isAuthenticated: false,
  user: {
    _id: '',
    name: '',
    email: '',
    role: '',
  },
}

export const authSlice = createSlice({
  name: 'auth',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    updateAuth: (
      state,
      actions: PayloadAction<Omit<AuthState, 'isInitialized'>>
    ) => {
      const { isAuthenticated, ...payload } = actions.payload
      state.isInitialized = true
      state.isAuthenticated = isAuthenticated
      state.user = payload.user
    },
    resetAuth: () => {
      return { ...initialState, isInitialized: true }
    },
    initAuth: (state) => {
      state.isInitialized = true
    },
  },
})

export const { updateAuth, resetAuth, initAuth } = authSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectAuth = (state: RootState) => state.auth

const authReducer = authSlice.reducer
export default authReducer
