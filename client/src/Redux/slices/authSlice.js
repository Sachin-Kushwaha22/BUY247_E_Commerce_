import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    admin: null,
    isAuthenticated: false
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        setAuth:(state, action) => {
            state.admin = action.payload;
            state.isAuthenticated = true;
        },
        clearAuth:(state) => {
            state.admin = null;
            state.isAuthenticated = false;
        }
    }
});

export const { setAuth, clearAuth } = authSlice.actions
export default authSlice.reducer