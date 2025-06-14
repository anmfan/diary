import {createApi} from "@/axios/api.ts";
import {configureStore} from '@reduxjs/toolkit';
import {userSlice} from "../slices/user-slice.ts";
import {teachersSlice} from "../slices/teachers-slice.ts";
import {studentsSlice} from "../slices/students-slice.ts";
import {groupsSlice} from "../slices/groups-slice.ts";
import {subjectsSlice} from "../slices/subjects-slice.ts";
import {teacherManagementApi} from "@/redux/api/teacher-management-api.ts";
import {scheduleApi} from "@/redux/api/schedule-api.ts";
import {userApi} from "@/redux/api/user-api.ts";

export const api = createApi();

export const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        teachers: teachersSlice.reducer,
        students: studentsSlice.reducer,
        groups: groupsSlice.reducer,
        subjects: subjectsSlice.reducer,
        [teacherManagementApi.reducerPath]: teacherManagementApi.reducer,
        [scheduleApi.reducerPath]: scheduleApi.reducer,
        [userApi.reducerPath]: userApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            thunk: {
                extraArgument: api,
            },
        }).concat(teacherManagementApi.middleware, scheduleApi.middleware, userApi.middleware)
})