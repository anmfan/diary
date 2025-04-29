import {createAsyncThunk} from "@reduxjs/toolkit";

import {AxiosInstance} from "axios";
import {IGroups} from "../types.ts";

const getAllGroups = createAsyncThunk<IGroups[], undefined, {extra: AxiosInstance}>
('groups/getAll', async (_, {extra: api}) => {
    const {data} = await api.get<IGroups[]>('groups/all');
    return data;
});

export {getAllGroups}