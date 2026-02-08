import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { iEventSlice } from "../types/event";

const initialState: iEventSlice = {
    currentEvent: null,
}

const eventSlice = createSlice({
    name: 'event',
    initialState,
    reducers: {
        setEventState: <K extends keyof iEventSlice>(state: iEventSlice, action: PayloadAction<{ key: K, value: iEventSlice[K] }>) => {
            const { key, value } = action.payload;
            state[key] = value;
        },

    }
})

export const {
    setEventState,
} = eventSlice.actions;

export default eventSlice.reducer;