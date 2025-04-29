import {store} from "./store/store.ts";
import {UsersRoles} from "./slices/user-slice.ts";
import {TSelectedItem} from "../components/admin-management/types.ts";

export type UserRole = typeof UsersRoles[keyof typeof UsersRoles]

export interface IUserInitialState {
    isAuthenticated: boolean;
    user: {
        username: string | null;
        email: string | null;
        firstName: string | null;
        lastName: string | null;
        avatar: string | null;
        role: UserRole;
    },
    loadingIsDone: boolean;
    isError: boolean;
    selectedItem: TSelectedItem;
}

export interface IGroups extends IBase {
    name: string;
    course: string;
    students_count: number;
}

export interface IGroupsInitialState {
    items: IGroups[];
    loadingIsDone: boolean;
    isError: boolean;
}

export interface ISubject extends IBase {
    name: string;
}

export type ITeacher = IBase & {
    username: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    avatar: string | null;
}

export interface IBase {
    id: string;
}
export type IStudent = ITeacher

export interface ITeachersInitialState {
    items: ITeacher[],
    loadingIsDone: boolean;
    isError: boolean;
    teachersIsExist: boolean;
}

export interface IStudentsInitialState {
    items: IStudent[];
    loadingIsDone: boolean;
    isError: boolean;
}

export interface ISubjectsInitialState {
    items: ISubject[];
    loadingIsDone: boolean;
    isError: boolean;
}

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export interface IUser {
    email: string;
    password: string;
}

interface IUserData {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    avatar: string;
    email: string;
    role: UserRole;
}

export interface IUserReturned {
    message: string;
    userData: {
        accessToken: string;
        refreshToken: string;
        user: IUserData;
    };
}