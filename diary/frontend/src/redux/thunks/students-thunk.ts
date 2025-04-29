import {createAsyncThunk} from "@reduxjs/toolkit";

import {AxiosInstance} from "axios";
import {IStudent} from "../types.ts";

const getAllStudents = createAsyncThunk<IStudent[], undefined, {extra: AxiosInstance}>
('students/getAll', async (_, {extra: api}) => {
    const {data} = await api.get<IStudent[]>('students/all');
    return data;
});

export {getAllStudents}