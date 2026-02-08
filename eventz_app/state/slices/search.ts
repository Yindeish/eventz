import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { iSearchSlice } from "../types/search";

const initialState: iSearchSlice = {
    currentFeed: null,
    currentTrending: null,
}

const eventSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchState: <K extends keyof iSearchSlice>(state: iSearchSlice, action: PayloadAction<{ key: K, value: iSearchSlice[K] }>) => {
            const { key, value } = action.payload;
            state[key] = value;
        },

    }
})

export const {
    setSearchState,
} = eventSlice.actions;

export default eventSlice.reducer;