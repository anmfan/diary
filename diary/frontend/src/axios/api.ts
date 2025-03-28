import axios, {AxiosInstance, AxiosError} from 'axios';
import {AXIOS_BASE_URL, AXIOS_TIMEOUT} from "../const.ts";
import {deleteToken, getToken} from "./token.ts";

export const createApi = (): AxiosInstance => {
    const server = axios.create({
        baseURL: AXIOS_BASE_URL,
        timeout: AXIOS_TIMEOUT
    })

    server.interceptors.request.use((config) => {
        const token = getToken();
        if (token && config.headers) {
            config.headers.Authorization = token;
        }
        return config;
    })

    server.interceptors.response.use(
        (response) => response,
        (error: AxiosError) => {
            if (error.response) {
                return error.response.data;
            }
            if (error.status === 401) {
                deleteToken();
                return 'Неавторизован';
            }
        });
    return server;
}