import {IUser, IUserReturned} from "../types.ts";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {AxiosInstance} from "axios";

const login = createAsyncThunk<IUserReturned, IUser, {extra: AxiosInstance}>
('auth/login', async (body, {extra: api}) => {
    const {data} = await api.post<IUserReturned>('user/login', body);
    return data;
});

const register = createAsyncThunk<IUserReturned, IUser, {extra: AxiosInstance}>
('auth/login', async (body, {extra: api}) => {
    const {data} = await api.post<IUserReturned>('user/login', body);
    return data;
});

export {login, register};