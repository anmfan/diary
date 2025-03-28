import {createApi} from "../../axios/api.ts";
import {configureStore} from '@reduxjs/toolkit';
import {userSlice} from "../slices/user-slice.ts";

export const api = createApi();

export const store = configureStore({
    reducer: {
        user: userSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            thunk: {
                extraArgument: api,
            },
        }),
})