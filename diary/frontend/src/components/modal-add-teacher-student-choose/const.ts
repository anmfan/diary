import {createTeacher} from "@/redux/thunks/teachers-thunk.ts";
import {createStudent} from "@/redux/thunks/students-thunk.ts";
import {IUserReturned, IUserReturnedGroupData, TCreateUser} from "@/redux/types.ts";
import {AsyncThunk} from "@reduxjs/toolkit";
import {AxiosInstance} from "axios";

export type TModalAddTeacherStudentCommonType<T extends 2 | 3, F extends IUserReturnedGroupData | string | null> = {
    roleId: T;
    thunk: AsyncThunk<IUserReturned<F>, TCreateUser<T>, { extra: AxiosInstance }>;
}

export type TModalTeacherStudentChoose = {
    typeTab: 'teachers' | 'students';
}

export const modalAddTeacherStudent = {
    teacher: {
        roleId: 2,
        thunk: createTeacher,
    } as TModalAddTeacherStudentCommonType<2, IUserReturnedGroupData>,
    student: {
        roleId: 3,
        thunk: createStudent,
    } as TModalAddTeacherStudentCommonType<3, string | null>
};
