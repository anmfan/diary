import {IUserInitialState, IUserReturned} from "../types.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {login, register} from "../thunks/user-thunk.ts";

const initialState: IUserInitialState = {
    isAuthenticated: false,
    user: {
        username: null,
        email: null,
        firstName: null,
        lastName: null,
    },
    loadingIsDone: false,
    isError: false
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(login.pending, (state) => {
                state.loadingIsDone = false
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<IUserReturned>) => {
                const user = action.payload.user
                state.loadingIsDone = true

                state.user.username = user.username
                state.user.email = user.email
                state.user.firstName = user.firstName
                state.user.lastName = user.lastName
            })
            .addCase(login.rejected, (state) => {
                state.loadingIsDone = true
                state.isError = true
            })
            .addCase(register.pending, (state) => {

            })
    }
})

const userActions = userSlice.actions;
export {userSlice, userActions}