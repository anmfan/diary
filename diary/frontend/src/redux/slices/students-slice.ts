import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IStudentsInitialState, IStudent} from "../types.ts";
import {getAllStudents} from "../thunks/students-thunk.ts";

const initialState: IStudentsInitialState = {
    items: [],
    loadingIsDone: false,
    isError: false,
}

const studentsSlice = createSlice({
    name: "students",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getAllStudents.pending, (state) => {
                state.loadingIsDone = false
            })
            .addCase(getAllStudents.fulfilled, (state, action: PayloadAction<IStudent[]>) => {
                state.loadingIsDone = true
                state.items = action.payload
            })
            .addCase(getAllStudents.rejected, (state) => {
                state.loadingIsDone = true
                state.isError = true
            })
    }
})

const studentsActions = studentsSlice.actions;
export {studentsSlice, studentsActions}