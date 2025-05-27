import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { AXIOS_BASE_URL, AXIOS_TIMEOUT } from "@/const.ts";
import {IGroups, RootState} from "@/redux/types.ts";
import {TDeleteStudent, TDeleteStudentId, TGetGroupDataByCuratorEmail} from "@/redux/api/types.ts";

export const teacherManagementApi = createApi({
    reducerPath: 'teacherManagementApi',
    baseQuery: fetchBaseQuery({
        baseUrl: AXIOS_BASE_URL,
        timeout: AXIOS_TIMEOUT
    }),
    endpoints: (builder) => ({
        getGroupData: builder.query<IGroups, TGetGroupDataByCuratorEmail>({
            query: ({email}) => `groups/getOne?email=${email}`,
        }),
        deleteStudent: builder.mutation<TDeleteStudent, TDeleteStudentId>({
            query: ({ user_id }) => ({
                url: `students/remove-group?user_id=${user_id}`,
                method: 'DELETE',
            }),
            async onQueryStarted({ user_id }, { dispatch, queryFulfilled, getState }) {
                const email = (getState() as RootState).user.user.email!

                const deleteResult = dispatch(
                    teacherManagementApi.util.updateQueryData('getGroupData', { email }, (draft) => {
                        draft.students = draft.students.filter(student => student.user_id !== user_id)
                    })
                )
                try {
                    await queryFulfilled
                } catch {
                    deleteResult.undo()
                }
            }
        })
    })
})

export const { useGetGroupDataQuery, useDeleteStudentMutation } = teacherManagementApi;