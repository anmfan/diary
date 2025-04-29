import {RootState} from "../types.ts";
import {createSelector} from "@reduxjs/toolkit";

export const userFIO = (state: Pick<RootState, 'user'>) => state.user.user;
export const userName = (state: Pick<RootState, 'user'>) => state.user.user.username;
export const userRole = (state: Pick<RootState, 'user'>) => state.user.user.role;
export const selectSelectedItem = (state: Pick<RootState, 'user'>) => state.user.selectedItem;

export const headerAvatar = createSelector(
    (state: Pick<RootState, 'user'>) => state.user.user,
    (user) => ({
        username: user.username,
        avatar: user.avatar,
        role: user.role,
    })
);

export const memoUserFIO = createSelector(
    [userFIO],
    (user) => {
        return {
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
        }
    }
)

export const selectAuthStatus = (state: Pick<RootState, 'user'>) => state.user.isAuthenticated;