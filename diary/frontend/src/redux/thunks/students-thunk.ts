import {createAsyncThunk} from "@reduxjs/toolkit";
import {AxiosInstance} from "axios";
import {
    IStudent,
    IUserReturned,
    TCreateUser,
    TDelete,
    TDeleteItem,
    TDeleteItemResponse
} from "../types.ts";

const getAllStudents = createAsyncThunk<IStudent[], undefined, {extra: AxiosInstance}>
('students/getAll', async (_, {extra: api}) => {
    const {data} = await api.get<IStudent[]>('students/all');
    return data;
});

const deleteStudent = createAsyncThunk<TDelete<'studentId'>, TDeleteItem, {extra: AxiosInstance}>
('students/delete', async (body, {extra: api}) => {
    const { data } = await api.delete<TDeleteItemResponse>(`students/delete`, { data: body});
    return { data, studentId: body.id};
});

const createStudent = createAsyncThunk<IUserReturned, TCreateUser<3>, {extra: AxiosInstance}>
('student/create', async (body, {extra: api}) => {
    const {data} = await api.post<IUserReturned>('user/register', body);
    return data;
});

export { getAllStudents, deleteStudent, createStudent };