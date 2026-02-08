import eventSlice from '@/state/slices/event';
import searchSlice from '@/state/slices/search';
import ticketSlice from '@/state/slices/ticket';
import createEventSlice from '@/state/slices/create-event';
import authSlice from '@/state/slices/auth';
import authPersistSlice from '@/state/slices/auth.persist';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import { PersistConfig } from "redux-persist/es/types";

const rootReducer = combineReducers({
    auth: authSlice,
    authPersist: authPersistSlice,
    createEvent: createEventSlice,
    event: eventSlice,
    ticket: ticketSlice,
    search: searchSlice,
});

const persistConfig: PersistConfig<ReturnType<typeof rootReducer>> = {
    key: "root",
    storage: AsyncStorage,
    whitelist: ['authPersist'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
