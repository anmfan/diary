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
    course: string | null;
    students_count: number;
    curator?: {
        user_id: string;
        user: {
            email: string;
            first_name: string | null;
            last_name: string | null;
        }
    },
    students: {
        user_id: string;
        user: {
            first_name: string;
            last_name: string;
            email: string;
        }
    }[]
    tab: "groups"
}

export interface IGroupsInitialState {
    items: IGroups[];
    loadingIsDone: boolean;
    isError: boolean;
}

export interface ISubject extends IBase {
    name: string;
    tab: "subjects"
}

export type ITeacher = IBase & {
    username: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    avatar: string | null;
    tab: "teachers";
    curated_groups: {
        name: string;
        course: string;
    }[];
}

export interface IBase {
    id: string;
}
export type IStudent = IBase & {
    username: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    avatar: string | null;
    group: string | null;
    tab: "students"
}

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
    sortedItems: IStudent[] | null;
    selectedStudentsByGroup: string;
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

type IUserData<T> = {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
    email: string;
    group: T;
    role: UserRole;
}

export type IUserReturnedGroupData = {
    name: string;
    course: string;
}

export type IUserReturned<T> = {
    message: string;
    userData: {
        accessToken: string;
        refreshToken: string;
        user: IUserData<T>;
    };
}

export type TDeleteItemResponse = {
    deletedStudentId: string;
    studentsGroup: string;
    students_count: number;
    message: string;
}

type TDeleteDataResponse = {
    data: TDeleteItemResponse;
}

export type TDelete<T extends string> = TDeleteDataResponse & {
    [K in T]: string;
};

export type TDeleteItem = {
    id: string
}

export type TCreateUser<T extends 2 | 3> = {
    username: string;
    email: string;
    fullName: string;
    password: string;
    role_id: T;
    group_id: string;
}

export type TEdit = {
    id: string;
    fullName: string;
    email: string;
    group: string;
}

export type TEditResponse = {
    message: string;
    user: {
        id: string;
        email: string;
        first_name: string;
        last_name: string;
        group: string | null;
    }
}

export type TGroupEdit = {
    groupId: string;
    newGroupName: string;
    excelImportFile: FileList | null;
}

type TGroupEditUpdated = {
    id: string;
    name: string;
    students_count: string;
    course: 0 | 1 | 2 | 3 | 4;
    curator_id: string | null;
}

type TSubjectEditUpdated = {
    id: string;
    name: string;
}

export type TSubjectEdit = {
    subjectId: string;
    newSubjectName: string;
    excelImportFile: FileList | null;
}

export type TEntityEditResponse<T extends TGroupEdit | TSubjectEdit> = {
    message: string;
    updated: T extends TGroupEdit ? TGroupEditUpdated : TSubjectEditUpdated
}