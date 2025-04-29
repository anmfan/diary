import {createApi} from "@/axios/api.ts";
import {configureStore} from '@reduxjs/toolkit';
import {userSlice} from "../slices/user-slice.ts";
import {teachersSlice} from "../slices/teachers-slice.ts";
import {studentsSlice} from "../slices/students-slice.ts";
import {groupsSlice} from "../slices/groups-slice.ts";
import {subjectsSlice} from "../slices/subjects-slice.ts";

export const api = createApi();

export const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        teachers: teachersSlice.reducer,
        students: studentsSlice.reducer,
        groups: groupsSlice.reducer,
        subjects: subjectsSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            thunk: {
                extraArgument: api,
            },
        }),
})