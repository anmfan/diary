import axios, {AxiosInstance, AxiosError, AxiosRequestConfig} from 'axios';
import {AXIOS_BASE_URL, AXIOS_TIMEOUT} from "../const.ts";
import {store} from "../redux/store/store.ts";
import {check, logout} from "../redux/thunks/user-thunk.ts";

interface RetryAxiosRequestConfig extends AxiosRequestConfig {
    _retry?: boolean;
}

export const createApi = (): AxiosInstance => {
    const server = axios.create({
        baseURL: AXIOS_BASE_URL,
        timeout: AXIOS_TIMEOUT,
        withCredentials: true,
    })

    server.interceptors.request.use(config => {
        config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
        return config;
    })

    server.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            const originalRequest = error.config as RetryAxiosRequestConfig;

            if (error.response?.status !== 401 || originalRequest._retry) {
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            try {
                await store.dispatch(check()).unwrap();
                return server(originalRequest);
            } catch (e) {
                localStorage.removeItem('token');
                await store.dispatch(logout());
                return Promise.reject(e);
            }
        }
    );

    return server;
}