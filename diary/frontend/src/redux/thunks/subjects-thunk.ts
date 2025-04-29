import {createAsyncThunk} from "@reduxjs/toolkit";

import {AxiosInstance} from "axios";
import {ISubject} from "../types.ts";

const getAllSubjects = createAsyncThunk<ISubject[], undefined, {extra: AxiosInstance}>
('subjects/getAll', async (_, {extra: api}) => {
    const {data} = await api.get<ISubject[]>('subjects/all');
    return data;
});

export {getAllSubjects}