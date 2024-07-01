import { configureStore } from '@reduxjs/toolkit'
import { userApiSlice } from './apiSlice'

import authReducer from './userSlices/userAuthSlice'
import adminReducer from './adminSlices/adminAuthSlice'
import recruiterReducer from './recruiterSlices/recruiterAuthSlice'
const store = configureStore({
    reducer: {
        auth: authReducer,
        adminAuth : adminReducer,
        recruiterAuth : recruiterReducer,
        [userApiSlice.reducerPath]: userApiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(userApiSlice.middleware),
    devTools: true,
})

export default store