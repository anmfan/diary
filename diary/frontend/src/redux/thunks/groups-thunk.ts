import {createAsyncThunk} from "@reduxjs/toolkit";
import {AxiosInstance} from "axios";
import {
    IGroups,
    TDelete,
    TDeleteItem,
    TDeleteItemResponse,
    TEntityEditResponse,
    TGroupEdit,
} from "../types.ts";

const getAllGroups = createAsyncThunk<IGroups[], undefined, {extra: AxiosInstance}>
('groups/getAll', async (_, {extra: api}) => {
    const {data} = await api.get<IGroups[]>('groups/all');
    return data;
});

const deleteGroup = createAsyncThunk<TDelete<'groupId'>, TDeleteItem, {extra: AxiosInstance}>
('groups/delete', async (body, {extra: api}) => {
    const { data } = await api.delete<TDeleteItemResponse>(`groups/delete`, { data: body});
    return { data, groupId: body.id};
});

export type TCreateGroupResponse = IGroups

export type TCreateGroup = {
    name: string;
    course: 0 | 1 | 2 | 3 | 4;
    curator_id: string | null;
}

const createGroup = createAsyncThunk<TCreateGroupResponse, TCreateGroup, {extra: AxiosInstance}>
('groups/create', async (body, {extra: api}) => {
    const { data } = await api.post<TCreateGroupResponse>(`groups/create`, body);
    return data
});

const editGroup = createAsyncThunk<TEntityEditResponse<TGroupEdit>, TGroupEdit, {extra: AxiosInstance}>
('groups/edit', async (body, {extra: api}) => {
    const { data } = await api.post<TEntityEditResponse<TGroupEdit>>('groups/edit', body)
    return data
})


export { getAllGroups, deleteGroup, createGroup, editGroup }