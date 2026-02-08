'use client'

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { iAuthPersistSlice } from "../types/auth.persist";


const initialState: iAuthPersistSlice = {
    visitedBefore: false,
    signedInBefore: false,
    signedIn: false,
    user: null,
    userToken: null,
    signinTime: null,
    businessProfileSetup: false,
    profileSetup: false
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthPersistState: <K extends keyof iAuthPersistSlice>(state: iAuthPersistSlice, action: PayloadAction<{ key: K, value: iAuthPersistSlice[K] }>) => {
            const { key, value } = action.payload;
            state[key] = value;
        },

    }
})

export const {
    setAuthPersistState,
} = authSlice.actions;

export default authSlice.reducer;