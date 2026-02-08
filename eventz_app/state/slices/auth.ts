'use client'

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { iAuthSlice } from "../types/auth";


const initialState: iAuthSlice = {
    signinEmail: null,
    signinPassword: null,
    role: 'attendee'
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthState: <K extends keyof iAuthSlice>(state: iAuthSlice, action: PayloadAction<{ key: K, value: iAuthSlice[K] }>) => {
            const { key, value } = action.payload;
            state[key] = value;
        },

    }
})

export const {
    setAuthState,
} = authSlice.actions;

export default authSlice.reducer;