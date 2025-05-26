import {IUser, IUserReturned, IUserReturnedGroupData, TEdit, TEditResponse} from "../types.ts";
import {createAsyncThunk} from "@reduxjs/toolkit";
import axios, {AxiosInstance} from "axios";
import {groupsActions} from "@/redux/slices/groups-slice.ts";
import {teachersActions} from "@/redux/slices/teachers-slice.ts";
import {studentsActions} from "@/redux/slices/students-slice.ts";
import {userActions} from "@/redux/slices/user-slice.ts";

const login = createAsyncThunk<
    IUserReturned<string | null>,
    IUser,
    {extra: AxiosInstance, rejectValue: string}>
('auth/login', async (body, {extra: api, rejectWithValue}) => {
    try {
        const { data } = await api.post<IUserReturned<string | null>>('user/login', body, { withCredentials: true });
        return data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            return rejectWithValue(err.response?.data.message || "Ошибка при авторизации")
        }
        return rejectWithValue("Неизвестная ошибка при авторизации")
    }
});

const check = createAsyncThunk<IUserReturned<string | null>, undefined, {extra: AxiosInstance}>
('auth/check', async (_, {extra: api}) => {
    const { data } = await api.get<IUserReturned<string | null>>('user/refresh', { withCredentials: true });
    return data;
});

const register = createAsyncThunk<
    IUserReturned<IUserReturnedGroupData | null>,
    IUser,
    {extra: AxiosInstance, rejectValue: string}>
('auth/register', async (body, {extra: api, rejectWithValue}) => {
    try {
        const { data } = await api.post<IUserReturned<IUserReturnedGroupData | null>>('user/register', body);
        return data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            return rejectWithValue(err.response?.data.message || "Ошибка при авторизации")
        }
        return rejectWithValue("Неизвестная ошибка при авторизации")
    }
});

const logout = createAsyncThunk<undefined, undefined, {extra: AxiosInstance}>
('auth/logout', async (_, {extra: api, dispatch}) => {
    dispatch(groupsActions.resetGroupSlice())
    dispatch(teachersActions.resetTeacherSlice())
    dispatch(studentsActions.resetStudentsSlice())
    dispatch(userActions.resetUserSlice())

    const { data } = await api.post('user/logout');
    return data
});

const edit = createAsyncThunk<
    TEditResponse,
    TEdit,
    {extra: AxiosInstance, rejectValue: string}>
('user/edit', async (body, {extra: api, rejectWithValue}) => {
    try {
        const { data } = await api.post<TEditResponse>('user/edit', body);
        return data
    } catch (err) {
        if (axios.isAxiosError(err)) {
            return rejectWithValue(err.response?.data.message || "Ошибка при редактировании")
        }
        return rejectWithValue("Неизвестная ошибка при редактировании")
    }
});

export { login, register, check, logout, edit };