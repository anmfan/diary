import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ITeacher, ITeachersInitialState} from "../types.ts";
import {getAllTeachers} from "../thunks/teachers-thunk.ts";

const initialState: ITeachersInitialState = {
    items: [],
    loadingIsDone: false,
    isError: false,
    teachersIsExist: false
}

const teachersSlice = createSlice({
    name: "teachers",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getAllTeachers.pending, (state) => {
                state.loadingIsDone = false
            })
            .addCase(getAllTeachers.fulfilled, (state, action: PayloadAction<ITeacher[]>) => {
                state.loadingIsDone = true
                state.teachersIsExist = true
                state.items = action.payload
            })
            .addCase(getAllTeachers.rejected, (state) => {
                state.loadingIsDone = true
                state.isError = true
            })
    }
})

const teachersActions = teachersSlice.actions;
export {teachersSlice, teachersActions}