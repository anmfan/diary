import {createAsyncThunk} from "@reduxjs/toolkit";
import {AxiosInstance} from "axios";
import {
    ISubject,
    TDelete,
    TDeleteItem,
    TDeleteItemResponse,
    TEntityEditResponse,
    TSubjectEdit
} from "../types.ts";

const getAllSubjects = createAsyncThunk<ISubject[], undefined, {extra: AxiosInstance}>
('subjects/getAll', async (_, {extra: api}) => {
    const {data} = await api.get<ISubject[]>('subjects/all');
    return data;
});

const deleteSubject = createAsyncThunk<TDelete<'subjectId'>, TDeleteItem, {extra: AxiosInstance}>
('subjects/delete', async (body, {extra: api}) => {
    const { data } = await api.delete<TDeleteItemResponse>(`subjects/delete`, { data: body});
    return { data, subjectId: body.id};
});

export type TCreateSubject = {
    id: string;
    name: string;
}

const createSubject = createAsyncThunk<TCreateSubject, { name: string }, {extra: AxiosInstance}>
('subjects/create', async (body, {extra: api}) => {
    const { data } = await api.post<TCreateSubject>(`subjects/create`, body);
    return data;
});

const editSubject = createAsyncThunk<TEntityEditResponse<TSubjectEdit>, TSubjectEdit, {extra: AxiosInstance}>
('subjects/edit', async (body, {extra: api}) => {
    const { data } = await api.post<TEntityEditResponse<TSubjectEdit>>('subjects/edit', body)
    return data
})

export { getAllSubjects, deleteSubject, createSubject, editSubject }