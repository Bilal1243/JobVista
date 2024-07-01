import { createSlice } from '@reduxjs/toolkit'
const initialState = {
  adminData: localStorage.getItem('adminData')
    ? JSON.parse(localStorage.getItem('adminData'))
    : null,
}

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.adminData = action.payload
      localStorage.setItem('adminData', JSON.stringify(action.payload))
    },
    logout: (state, action) => {
      state.adminData = null
      localStorage.removeItem('adminData')
    },
  },
})

export const { setCredentials, logout } = adminAuthSlice.actions

export default adminAuthSlice.reducer