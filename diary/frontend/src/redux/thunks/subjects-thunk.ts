import {createAsyncThunk} from "@reduxjs/toolkit";
import axios, {AxiosInstance} from "axios";
import {
    ISubject,
    TDelete,
    TDeleteItem,
    TDeleteItemResponse,
    TSubjectEdit, TSubjectEditUpdated
} from "../types.ts";

const getAllSubjects = createAsyncThunk<ISubject[], undefined, {extra: AxiosInstance}>
('subjects/getAll', async (_, {extra: api}) => {
    const {data} = await api.get<ISubject[]>('subjects/all');
    return data;
});

const deleteSubject = createAsyncThunk<TDelete<'subjectId'>, TDeleteItem, {extra: AxiosInstance}>
('subjects/delete', async ({id}, {extra: api}) => {
    const { data } = await api.delete<TDeleteItemResponse>(`subjects/delete?id=${Number(id)}`);
    return { data, subjectId: Number(id)};
});

export type TCreateSubject = {
    id: string;
    name: string;
    classroom: string;
}

const createSubject = createAsyncThunk <
    TCreateSubject,
    { name: string },
    {extra: AxiosInstance, rejectValue: string}>
('subjects/create', async (body, {extra: api, rejectWithValue}) => {
    try {
        const { data } = await api.post<TCreateSubject>(`subjects/create`, body);
        return data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            return rejectWithValue(err.response?.data.message || 'Ошибка при создании преподавателя')
        }
        return rejectWithValue('Неизвестная ошибка');
    }
});

const editSubject = createAsyncThunk<TSubjectEditUpdated, TSubjectEdit, {extra: AxiosInstance}>
('subjects/edit', async (body, {extra: api}) => {
    const { data } = await api.post<TSubjectEditUpdated>('subjects/edit', body)
    return data
})

export { getAllSubjects, deleteSubject, createSubject, editSubject }