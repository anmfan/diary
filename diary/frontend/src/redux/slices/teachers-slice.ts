import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    ITeacher,
    ITeachersInitialState,
    IUserReturned,
    IUserReturnedGroupData,
    TDelete,
} from "../types.ts";
import {createTeacher, deleteTeacher, getAllTeachers} from "../thunks/teachers-thunk.ts";
import {updateEditedUser, updateFilteredList} from "@/redux/helper.ts";
import {edit} from "@/redux/thunks/user-thunk.ts";

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
            .addCase(deleteTeacher.fulfilled, (state, action: PayloadAction<TDelete<'teacherId'>>) => {
                state.loadingIsDone = true
                state.items = updateFilteredList(state.items, action.payload.teacherId)
            })
            .addCase(deleteTeacher.rejected, (state) => {
                state.isError = true
                state.loadingIsDone = true
            })
            .addCase(createTeacher.fulfilled, (state, action: PayloadAction<IUserReturned<IUserReturnedGroupData>>) => {
                state.loadingIsDone = true
                const user = action.payload.userData.user

                state.items.push({
                    id: String(user.id),
                    username: user.username,
                    email: user.email,
                    first_name: user.firstName,
                    last_name: user.lastName,
                    avatar: user.avatar,
                    tab: "teachers",
                    curated_groups: [user.group],
                })
            })
            .addCase(createTeacher.rejected, (state) => {
                state.loadingIsDone = true;
                state.isError = true
            })
            .addCase(edit.fulfilled, (state, action) => {
                state.items = updateEditedUser<ITeacher>(state.items, action.payload)
            })
    }
})

const teachersActions = teachersSlice.actions;
export {teachersSlice, teachersActions}