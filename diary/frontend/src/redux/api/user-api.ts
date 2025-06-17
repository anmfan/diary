import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {AXIOS_BASE_URL, AXIOS_TIMEOUT} from "@/const.ts";
import {
    RTKQueryError,
    TGetAdminAccountInfo, TGetAdminDashboard, TGetStudentDashboard,
    TGetStudentInfoAccount, TGetTeacherDashboard,
    TGetTeacherInfoAccount,
    TUpdateAvatar
} from "@/redux/api/types.ts";
import {userActions} from "@/redux/slices/user-slice.ts";
import {toast} from "react-toastify";

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: AXIOS_BASE_URL,
        timeout: AXIOS_TIMEOUT,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`)
            }
            return headers
        }
    }),
    endpoints: (builder) => ({
        updateAvatar: builder.mutation<TUpdateAvatar, FormData>({
            query: (body) => ({
                url: `user/avatar`,
                method: "PATCH",
                body
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(userActions.updateAvatar(data.avatar));
                } catch(e) {
                    const error = e as RTKQueryError
                    toast.error(error.error?.data?.message || "Ошибка при загрузке аватара")
                }
            }
        }),
        getUserInfo: builder.query<TGetStudentInfoAccount | TGetTeacherInfoAccount, { email: string | null }>({
            query: ({ email }) => `user/account?email=${email}`,
            keepUnusedDataFor: 0
        }),
        getAdminInfo: builder.query<TGetAdminAccountInfo, undefined>({
            query: () => `user/admin-account`,
        }),
        getAdminDashboard: builder.query<TGetAdminDashboard, { email: string | null }>({
            query: ({ email }) => `user/get-admin-dashboard?email=${email}`,
        }),
        getStudentDashboard: builder.query<TGetStudentDashboard, { email: string | null }>({
            query: ({ email }) => `students/get-student-dashboard?email=${email}`,
        }),
        getTeacherDashboard: builder.query<TGetTeacherDashboard, { email: string | null}>({
            query: ({ email }) => `teachers/get-teacher-dashboard?email=${email}`,
        }),
    })
});

export const {
    useUpdateAvatarMutation,
    useGetUserInfoQuery,
    useGetAdminInfoQuery,
    useGetAdminDashboardQuery,
    useGetTeacherDashboardQuery,
    useGetStudentDashboardQuery
} = userApi