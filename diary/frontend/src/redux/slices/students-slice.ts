import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IStudentsInitialState, IStudent, TDelete, IUserReturned} from "../types.ts";
import {createStudent, deleteStudent, getAllStudents} from "../thunks/students-thunk.ts";
import {
    filterBySorterOptionsStudents,
    updateEditedUser,
    updateFilteredList
} from "@/redux/helper.ts";
import {edit} from "@/redux/thunks/user-thunk.ts";
import {SortingOptionsValues} from "@/components/sorting-options-students/const.ts";
import {addGroup, removeGroup} from "@/redux/thunks/teachers-thunk.ts";
import {editGroup} from "@/redux/thunks/groups-thunk.ts";

const initialState: IStudentsInitialState = {
    items: [],
    loadingIsDone: false,
    isError: false,
    sortedItems: null,
    selectedStudentsByGroup: SortingOptionsValues.All
}

const studentsSlice = createSlice({
    name: "students",
    initialState,
    reducers: {
        resetStudentsSlice: () => {
            return initialState
        },
        sortingStudentByGroup: (state, action: PayloadAction<string>) => {
            filterBySorterOptionsStudents(state, action.payload)
        }
    },
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
            .addCase(deleteStudent.fulfilled, (state, action: PayloadAction<TDelete<'studentId'>>) => {
                state.loadingIsDone = true
                state.items = updateFilteredList(state.items, action.payload.studentId)
                filterBySorterOptionsStudents(state, state.selectedStudentsByGroup)
            })
            .addCase(deleteStudent.rejected, (state) => {
                state.isError = true
                state.loadingIsDone = true
            })
            .addCase(createStudent.fulfilled, (state, action: PayloadAction<IUserReturned<string | null>>) => {
                state.loadingIsDone = true
                const user = action.payload.userData.user

                state.items.push({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    first_name: user.firstName,
                    last_name: user.lastName,
                    avatar: user.avatar,
                    group: user.group,
                    format: user.format,
                    tab: "students"
                })

                filterBySorterOptionsStudents(state, state.selectedStudentsByGroup)
            })
            .addCase(edit.fulfilled, (state, action) => {
                state.items = updateEditedUser<IStudent>(state.items, action.payload)
                filterBySorterOptionsStudents(state, state.selectedStudentsByGroup)
            })
            .addCase(addGroup.fulfilled, (state, action) => {
                const data = action.payload;

                if (data.type === 'student') {
                    state.items = state.items.map(student => {
                        if (String(student.id) === String(data.user.id)) {
                            return {
                                ...student,
                                group: data.group.name
                            }
                        }
                        return student
                    })

                    filterBySorterOptionsStudents(state, state.selectedStudentsByGroup)
                }
            })
            .addCase(removeGroup.fulfilled, (state, action) => {
                const data = action.payload;

                if (data.type === 'student') {
                    state.items = state.items.map(student => {
                        if (String(student.id) === String(data.deletedId)) {
                            return {
                                ...student,
                                group: null,
                            }
                        }
                        return student;
                    })
                    filterBySorterOptionsStudents(state, state.selectedStudentsByGroup)
                }
            })
            .addCase(editGroup.fulfilled, (state, action) => {
                const data = action.payload;
                const addedUserIds = data.successfullyAdded.map(s => s.user_id);

                state.items = state.items.map(student => {
                    if (student.group === data.oldGroupName || addedUserIds.includes(student.id)) {
                        return {
                            ...student,
                            group: data.updated.name,
                        }
                    }
                    return student
                })
                filterBySorterOptionsStudents(state, state.selectedStudentsByGroup)
            })
    }
})

const studentsActions = studentsSlice.actions;
export {studentsSlice, studentsActions}