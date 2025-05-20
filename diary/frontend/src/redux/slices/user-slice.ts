import {IUserInitialState, IUserReturned, TDeleteItemResponse} from "../types.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {check, login, logout, register} from "../thunks/user-thunk.ts";
import {TSelectedItem} from "@/components/admin-management/types.ts";
import {unpinStudentFromGroup} from "@/redux/thunks/groups-thunk.ts";
import {updateForUnpinStudentFromGroup} from "@/redux/helper.ts";

export const UsersRoles = {
    student: "Студент",
    admin: "Администратор",
    teacher: "Преподаватель",
    unknown: "Неопознанная роль"
} as const

const initialState: IUserInitialState = {
    isAuthenticated: false,
    user: {
        username: null,
        email: null,
        firstName: null,
        lastName: null,
        avatar: null,
        role: UsersRoles.unknown
    },
    loadingIsDone: false,
    isError: false,
    selectedItem: null,
}

const fulfilledUserQuery = (state: IUserInitialState, action: PayloadAction<IUserReturned<string | null>>) => {
    const user = action.payload.userData.user
    state.loadingIsDone = true
    state.isAuthenticated = true

    state.user.username = user.username
    state.user.email = user.email

    state.user.firstName = user.firstName
    state.user.lastName = user.lastName
    state.user.avatar = user.avatar
    state.user.role = user.role

    state.isError = false
    localStorage.setItem("token", action.payload.userData.accessToken)
}

const rejectedUserQuery = (state: IUserInitialState) => {
    state.loadingIsDone = true
    state.isError = true
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setSelectedItem: (state, action: PayloadAction<TSelectedItem>) => {
            state.selectedItem = action.payload;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(login.pending, (state) => {
                state.loadingIsDone = false
            })
            .addCase(login.fulfilled, fulfilledUserQuery)
            .addCase(login.rejected, rejectedUserQuery)
            .addCase(check.pending, (state) => {
                state.loadingIsDone = false
                state.isAuthenticated = true;
            })
            .addCase(check.fulfilled, fulfilledUserQuery)
            .addCase(check.rejected, (state) => {
                state.loadingIsDone = true;
                state.isAuthenticated = false;
                state.isError = true;
            })
            .addCase(register.pending, (state) => {
                state.loadingIsDone = false
            })
            .addCase(register.fulfilled, fulfilledUserQuery)
            .addCase(register.rejected, (state) => {
                state.loadingIsDone = false
            })
            .addCase(logout.fulfilled, (state) => {
                state.loadingIsDone = true
                state.isAuthenticated = false

                state.user.firstName = null
                state.user.lastName = null
                state.user.email = null
                state.user.username = null
                state.user.avatar = null
                state.user.role = UsersRoles.unknown
                localStorage.removeItem("token");
            })
            .addCase(unpinStudentFromGroup.fulfilled, (state, action: PayloadAction<TDeleteItemResponse>) => {
                const { studentsGroup, deletedStudentId, students_count } = action.payload;
                const selectedItem = state.selectedItem;

                if (selectedItem?.tab === 'groups' && selectedItem.id === studentsGroup) {
                    state.selectedItem = updateForUnpinStudentFromGroup(selectedItem, students_count, deletedStudentId)
                }
            })
    }
})

const userActions = userSlice.actions;
export {userSlice, userActions}