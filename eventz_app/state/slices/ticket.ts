import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { iTicketSlice } from "../types/ticket";

const initialState: iTicketSlice = {
    currentTicket: null
}

const eventSlice = createSlice({
    name: 'ticket',
    initialState,
    reducers: {
        setTicketState: <K extends keyof iTicketSlice>(state: iTicketSlice, action: PayloadAction<{ key: K, value: iTicketSlice[K] }>) => {
            const { key, value } = action.payload;
            state[key] = value;
        },

    }
})

export const {
    setTicketState,
} = eventSlice.actions;

export default eventSlice.reducer;