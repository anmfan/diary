import {IUser, IUserReturned, TEdit, TEditResponse} from "../types.ts";
import {createAsyncThunk} from "@reduxjs/toolkit";
import axios, {AxiosInstance} from "axios";

const login = createAsyncThunk<
    IUserReturned,
    IUser,
    {extra: AxiosInstance, rejectValue: string}>
('auth/login', async (body, {extra: api, rejectWithValue}) => {
    try {
        const { data } = await api.post<IUserReturned>('user/login', body, { withCredentials: true });
        return data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            return rejectWithValue(err.response?.data.message || "Ошибка при авторизации")
        }
        return rejectWithValue("Неизвестная ошибка при авторизации")
    }
});

const check = createAsyncThunk<IUserReturned, undefined, {extra: AxiosInstance}>
('auth/check', async (_, {extra: api}) => {
    const { data } = await api.get<IUserReturned>('user/refresh', { withCredentials: true });
    return data;
});

const register = createAsyncThunk<IUserReturned, IUser, {extra: AxiosInstance}>
('auth/register', async (body, {extra: api}) => {
    const { data } = await api.post<IUserReturned>('user/register', body);
    return data;
});

const logout = createAsyncThunk<undefined, undefined, {extra: AxiosInstance}>
('auth/logout', async (_, {extra: api}) => {
    const { data } = await api.post('user/logout');
    return data
});

const edit = createAsyncThunk<TEditResponse, TEdit, {extra: AxiosInstance}>
('user/edit', async (body, {extra: api}) => {
    const { data } = await api.post<TEditResponse>('user/edit', body);
    return data
});

export { login, register, check, logout, edit };