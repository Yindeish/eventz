import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { iCreatEventSlice } from "../types/create-event";

const initialState: iCreatEventSlice = {
    gallery: []
}

const authSlice = createSlice({
    name: 'creatEvent',
    initialState,
    reducers: {
        setCreateEventState: <K extends keyof iCreatEventSlice>(state: iCreatEventSlice, action: PayloadAction<{ key: K, value: iCreatEventSlice[K] }>) => {
            const { key, value } = action.payload;
            state[key] = value;
        },

    }
})

export const {
    setCreateEventState,
} = authSlice.actions;

export default authSlice.reducer;