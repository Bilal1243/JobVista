import { createSlice } from '@reduxjs/toolkit'
const initialState = {
  recruiterData: localStorage.getItem('recruiterData')
    ? JSON.parse(localStorage.getItem('recruiterData'))
    : null,
}

const recruiterAuthSlice = createSlice({
  name: 'recruiterAuth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.recruiterData = action.payload
      localStorage.setItem('recruiterData', JSON.stringify(action.payload))
    },
    logout: (state, action) => {
      state.recruiterData = null
      localStorage.removeItem('recruiterData')
    },
  },
})

export const { setCredentials, logout } = recruiterAuthSlice.actions

export default recruiterAuthSlice.reducer