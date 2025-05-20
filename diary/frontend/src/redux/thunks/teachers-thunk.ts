import {createAsyncThunk} from "@reduxjs/toolkit";

import axios, {AxiosInstance} from "axios";
import {
    ITeacher,
    IUserReturned, IUserReturnedGroupData,
    TCreateUser,
    TDelete,
    TDeleteItem,
    TDeleteItemResponse
} from "../types.ts";

const getAllTeachers = createAsyncThunk<ITeacher[], undefined, {extra: AxiosInstance}>
('teachers/getAll', async (_, {extra: api}) => {
    const {data} = await api.get<ITeacher[]>('teachers/all');
    return data;
});

const deleteTeacher = createAsyncThunk<TDelete<'teacherId'>, TDeleteItem, {extra: AxiosInstance}>
('teachers/delete', async (body, {extra: api}) => {
    const { data } = await api.delete<TDeleteItemResponse>(`teachers/delete`, { data: body});
    return { data, teacherId: body.id};
});

const createTeacher = createAsyncThunk<
    IUserReturned<IUserReturnedGroupData>,
    TCreateUser<2>,
    { extra: AxiosInstance, rejectValue: string }>
('teacher/create', async (body, {extra: api, rejectWithValue}) => {
    try {
        const { data } = await api.post<IUserReturned<IUserReturnedGroupData>>('user/register', body);
        return data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            return rejectWithValue(err.response?.data.message || 'Ошибка при создании преподавателя')
        }
        return rejectWithValue('Неизвестная ошибка');
    }
});

export { getAllTeachers, deleteTeacher, createTeacher }