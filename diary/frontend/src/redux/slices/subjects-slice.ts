import  {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    ISubject, ISubjectGroupsList,
    ISubjectsInitialState, ISubjectTeachersList,
    TDelete,
    TSubjectEditUpdated
} from "../types.ts";
import {createSubject, deleteSubject, editSubject, getAllSubjects, TCreateSubject} from "../thunks/subjects-thunk.ts";
import {updateFilteredList} from "@/redux/helper.ts";

const initialState: ISubjectsInitialState = {
    items: [],
    loadingIsDone: false,
    isError: false,
}

const subjectsSlice = createSlice({
    name: "subjects",
    initialState,
    reducers: {
        resetSubjectsSlice: () => {
            return initialState
        },
    },
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
                    id: Number(payload.id),
                    name: payload.name,
                    teachers: [],
                    assigned_groups: [],
                    tab: "subjects"
                })
            })
            .addCase(editSubject.fulfilled, (state, action: PayloadAction<TSubjectEditUpdated>) => {
                const updated = action.payload.updated;

                state.items = state.items.map(subject => {
                    if (subject.id !== updated.id) return subject;

                    const updatedSubject = {
                        ...subject,
                        name: updated.name,
                    };

                    if (updated.groupAttached) {
                        updatedSubject.assigned_groups = [
                            ...subject.assigned_groups,
                            updated.groupAttached as ISubjectGroupsList
                        ];
                    }

                    if (updated.teacherAdded) {
                        updatedSubject.teachers = [
                            ...subject.teachers,
                            updated.teacherAdded as ISubjectTeachersList
                        ];
                    }

                    return updatedSubject;
                });
            })
    }
})

const subjectsActions = subjectsSlice.actions;
export {subjectsSlice, subjectsActions}