import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ISubject, ISubjectsInitialState} from "../types.ts";
import {getAllSubjects} from "../thunks/subjects-thunk.ts";

const initialState: ISubjectsInitialState = {
    items: [],
    loadingIsDone: false,
    isError: false,
}

const subjectsSlice = createSlice({
    name: "subjects",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getAllSubjects.pending, (state) => {
                state.loadingIsDone = false
            })
            .addCase(getAllSubjects.fulfilled, (state, action: PayloadAction<ISubject[]>) => {
                state.loadingIsDone = true
                state.items = action.payload
            })
            .addCase(getAllSubjects.rejected, (state) => {
                state.loadingIsDone = true
                state.isError = true
            })
    }
})

const subjectsActions = subjectsSlice.actions;
export {subjectsSlice, subjectsActions}