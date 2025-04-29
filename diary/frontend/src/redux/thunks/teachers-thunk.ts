import {createAsyncThunk} from "@reduxjs/toolkit";

import {AxiosInstance} from "axios";
import {ITeacher} from "../types.ts";

const getAllTeachers = createAsyncThunk<ITeacher[], undefined, {extra: AxiosInstance}>
('teachers/getAll', async (_, {extra: api}) => {
    const {data} = await api.get<ITeacher[]>('teachers/all');
    return data;
});

export {getAllTeachers}