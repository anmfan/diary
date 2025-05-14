import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    ISubject,
    ISubjectsInitialState,
    TDelete,
    TEntityEditResponse,
    TSubjectEdit
} from "../types.ts";
import {createSubject, deleteSubject, editSubject, getAllSubjects, TCreateSubject} from "../thunks/subjects-thunk.ts";
import {updateEditedEntity, updateFilteredList} from "@/redux/helper.ts";

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
            .addCase(deleteSubject.fulfilled, (state, action: PayloadAction<TDelete<'subjectId'>>) => {
                state.loadingIsDone = true
                state.items = updateFilteredList(state.items, action.payload.subjectId)
            })
            .addCase(deleteSubject.rejected, (state) => {
                state.isError = true
                state.loadingIsDone = true
            })
            .addCase(createSubject.fulfilled, (state, action: PayloadAction<TCreateSubject>) => {
                state.loadingIsDone = true

                const payload = action.payload
                state.items.push({
                    id: payload.id,
                    name: payload.name,
                    tab: "subjects"
                })
            })
            .addCase(editSubject.fulfilled, (state, action: PayloadAction<TEntityEditResponse<TSubjectEdit>>) => {
                state.items = updateEditedEntity<ISubject>(state.items, action.payload)
            })
    }
})

const subjectsActions = subjectsSlice.actions;
export {subjectsSlice, subjectsActions}