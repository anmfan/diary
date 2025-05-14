import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IStudentsInitialState, IStudent, TDelete, IUserReturned} from "../types.ts";
import {createStudent, deleteStudent, getAllStudents} from "../thunks/students-thunk.ts";
import {updateEditedUser, updateFilteredList} from "@/redux/helper.ts";
import {edit} from "@/redux/thunks/user-thunk.ts";

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
            .addCase(deleteStudent.fulfilled, (state, action: PayloadAction<TDelete<'studentId'>>) => {
                state.loadingIsDone = true
                state.items = updateFilteredList(state.items, action.payload.studentId)
            })
            .addCase(deleteStudent.rejected, (state) => {
                state.isError = true
                state.loadingIsDone = true
            })
            .addCase(createStudent.fulfilled, (state, action: PayloadAction<IUserReturned>) => {
                state.loadingIsDone = true
                const user = action.payload.userData.user

                state.items.push({
                    id: String(user.id),
                    username: user.username,
                    email: user.email,
                    first_name: user.firstName,
                    last_name: user.lastName,
                    avatar: user.avatar,
                    group: user.group,
                    tab: "students"
                })
            })
            .addCase(edit.fulfilled, (state, action) => {
                state.items = updateEditedUser<IStudent>(state.items, action.payload)
            })
    }
})

const studentsActions = studentsSlice.actions;
export {studentsSlice, studentsActions}