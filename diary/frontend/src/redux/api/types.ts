import {FetchBaseQueryError} from "@reduxjs/toolkit/query";
import {IUserData} from "@/redux/types.ts";

export type TDeleteStudent = {
    type: string;
    message: string;
    deletedId: string;
    oldGroup: string;
    students_count: number;
}

export type TAddStudentToGroup = {
    fullName: string;
    email: string;
    group_name: string;
    role_id: number;
    excelImportFile: FileList | null;
} | FormData


export type TAddStudentToGroupResponse = {
    message: string;
    results: TResultAddStudents[]
}

export type TResultAddStudents = {
    status: string;
    tokens: string[];
    user: IUserData<string | null>
}

export type RTKQueryError = FetchBaseQueryError & {
    error?:{
        data?: {
            message?: string
        }
    }
}

export type TDeleteStudentId = { user_id: number }
export type TGetGroupDataByCuratorEmail = { email: string }