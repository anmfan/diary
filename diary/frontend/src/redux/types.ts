import {store} from "./store/store.ts";
import {UsersRoles} from "./slices/user-slice.ts";
import {TSelectedItem} from "../components/admin-management/types.ts";

export type UserRole = typeof UsersRoles[keyof typeof UsersRoles]

export interface IUserInitialState {
    isAuthenticated: boolean;
    user: TUserInfo,
    loadingIsDone: boolean;
    isError: boolean;
    selectedItem: TSelectedItem;
}

export type TUserInfo = {
    username: string | null;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    avatar: string | null;
    role: UserRole;
    group: number | null;
}

export type TGroupStudents = {
    format: string | null;
    user_id: number;
    user: {
        first_name: string;
        last_name: string;
        email: string;
    }
}

export interface IGroups extends IBase {
    name: string;
    course: string | null;
    students_count: number;
    curator?: {
        user_id: number;
        user: {
            email: string;
            first_name: string | null;
            last_name: string | null;
        }
    },
    students: TGroupStudents[]
    tab: "groups"
}

export interface IGroupsInitialState {
    items: IGroups[];
    loadingIsDone: boolean;
    isError: boolean;
    sortedItems: IGroups[] | null;
    selectedGroupByCurator: string;
}

export interface ISubject extends IBase {
    name: string;
    classroom: string | null;
    teachers: ISubjectTeachersList[];
    assigned_groups: ISubjectGroupsList[];
    tab: "subjects";
}

export type ISubjectGroupsList = {
    id: number;
    name: string;
    course: string;
}

export type ISubjectTeachersList = {
    id: number;
    user: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
    }
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
    }[] | null;
}

export interface IBase {
    id: number;
}
export type IStudent = IBase & {
    username: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    avatar: string | null;
    group: string | null;
    format: string | null;
    tab: "students"
}

export interface ITeachersInitialState {
    items: ITeacher[],
    loadingIsDone: boolean;
    isError: boolean;
    sortedItems: ITeacher[] | null;
    selectedTeachersByGroup: string;
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

export type IUserData<T> = {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
    email: string;
    group: T;
    format: string | null;
    groupStudentCount: number;
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
    groupStudentCount: number;
    userId: string;
    groupName: string;
    message: string;
}

type TDeleteDataResponse = {
    data: TDeleteItemResponse;
}

export type TDelete<T extends string> = TDeleteDataResponse & {
    [K in T]: number;
};

export type TDeleteItem = {
    id: number
}

export type TCreateUser<T extends 2 | 3> = {
    email: string;
    fullName: string;
    role_id: T;
    group_id: string;
    format: string | null;
}

export type TEdit = {
    id: number;
    fullName: string;
    email: string;
    group: string;
}

export type TEditResponse = {
    message: string;
    user: {
        id: number;
        email: string;
        first_name: string;
        last_name: string;
        group: string | null;
        teacher?: string;
    },
}

export type TGroupEdit = {
    groupId: string;
    newGroupName: string;
    excelImportFile: FileList | null;
}

type TGroupEditUpdated = {
    id: number;
    name: string;
    students_count: number;
    course: 0 | 1 | 2 | 3 | 4;
    curator_id: string | null;
}

export type TSubjectEditUpdated = {
    message: string;
    updated: {
        id: number;
        name: string;
        teacherAdded: {
            id: number;
            user: {
                first_name: string;
                last_name: string;
                email: string;
            }
        } | null;
        groupAttached: {
            id: number;
            name: string;
            course: string;
        } | null;
    };
}

export type TSubjectEdit = {
    subjectId: string;
    newSubjectName: string;
    group_id: string;
    teacher_id: string;
    subjectTeacherId: string;
    excelImportFile: FileList | null;
}

export type TEntityEditResponse<T extends TGroupEdit | TSubjectEdit> = {
    message: string;
    oldGroupName?: string;
    successfullyAdded: TGroupStudents[];
    skipped: { reason: string; email: string; }
    updated: T extends TGroupEdit ? TGroupEditUpdated : TSubjectEditUpdated
}

export type TAddGroupForm = {
    groupId: string;
}

export type TAddGroup = TAddGroupForm & { userId: number }

export type TRemoveGroupResponse = {
    type: 'student' | 'teacher';
    message: string;
    students_count?: number;
    deletedId: number;
    oldGroup: string;
}

export type initialStateTeacherManagement = {
    items: IGroups[];
}