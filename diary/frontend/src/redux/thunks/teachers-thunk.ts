import {createAsyncThunk} from "@reduxjs/toolkit";

import axios, {AxiosInstance} from "axios";
import {
    ITeacher,
    IUserReturned, IUserReturnedGroupData, TAddGroup,
    TCreateUser,
    TDelete,
    TDeleteItem,
    TDeleteItemResponse, TRemoveGroupResponse
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

type TAddGroupTeacherResponse = {
    message: string;
    group: { name: string; course: string };
    students_count: string;
    user: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
    },
    type: 'student' | 'teacher'
}

const addGroup = createAsyncThunk<
    TAddGroupTeacherResponse,
    TAddGroup,
    {extra: AxiosInstance, rejectValue: string}>
('teachers/add-group', async (body, {extra: api, rejectWithValue}) => {
    try {
        const { data } = await api.post<TAddGroupTeacherResponse>(`students/add-group`, body);
        return data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            return rejectWithValue(err.response?.data.message || 'Ошибка при создании преподавателя')
        }
        return rejectWithValue('Неизвестная ошибка');
    }
});

const removeGroup = createAsyncThunk<
    TRemoveGroupResponse,
    { user_id: number; group_name?: string; },
    {extra: AxiosInstance}
>('user/remove-group', async ({user_id, group_name}, {extra: api}) => {
    const { data } = await api.delete<TRemoveGroupResponse>(`students/remove-group?user_id=${user_id}&group_name=${group_name}`)
    return data;
})

export { getAllTeachers, deleteTeacher, createTeacher, addGroup, removeGroup }