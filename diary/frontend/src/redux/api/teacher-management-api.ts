import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AXIOS_BASE_URL, AXIOS_TIMEOUT } from "@/const.ts";
import { IGroups, IUserReturned, RootState } from "@/redux/types.ts";
import {
    RTKQueryError,
    TAddStudentToGroup, TAddStudentToGroupResponse,
    TDeleteStudent,
    TDeleteStudentId,
    TGetGroupDataByCuratorEmail, TGetSubjectsResponse
} from "@/redux/api/types.ts";
import {toast} from "react-toastify";
import {updateNewStudentsList} from "@/redux/api/const.ts";

export const teacherManagementApi = createApi({
    reducerPath: 'teacherManagementApi',
    baseQuery: fetchBaseQuery({
        baseUrl: AXIOS_BASE_URL,
        timeout: AXIOS_TIMEOUT
    }),
    endpoints: (builder) => ({
        getGroupData: builder.query<IGroups, TGetGroupDataByCuratorEmail>({
            query: ({email}) => `groups/getOne?email=${email}`,
            keepUnusedDataFor: 0
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
                        draft.students_count -= 1
                    })
                )
                try {
                    await queryFulfilled
                } catch {
                    deleteResult.undo()
                }
            }
        }),
        addStudent: builder.mutation<
            IUserReturned<string | null> | TAddStudentToGroupResponse,
            TAddStudentToGroup
        >({
            query: (body) => ({
                url: 'user/register',
                method: 'POST',
                body,
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled, getState }) {
                const email = (getState() as RootState).user.user.email!

                try {
                    const { data } = await queryFulfilled

                    if ("userData" in data) {
                        const newStudent = data.userData.user

                        dispatch(
                            teacherManagementApi.util.updateQueryData('getGroupData', { email }, (draft) => {
                                draft.students_count += 1
                                updateNewStudentsList(newStudent, draft.students)
                            })
                        )
                    }

                    if ("results" in data) {
                        const newStudents = data.results

                        dispatch(
                            teacherManagementApi.util.updateQueryData('getGroupData', { email }, (draft) => {
                                newStudents.forEach(student => {
                                    let newStudentCount = 0;

                                    if (student.tokens) {
                                        newStudentCount++

                                        draft.students.push({
                                            user_id: student.user.id,
                                            user: {
                                                first_name: student.user.firstName,
                                                last_name: student.user.lastName,
                                                email: student.user.email
                                            }
                                        })
                                    }
                                    draft.students_count += newStudentCount
                                })
                            })
                        )
                    }
                } catch (e) {
                    const error = e as RTKQueryError
                    toast.error(error.error?.data?.message)
                }
            }
        }),
        getSubjects: builder.query<TGetSubjectsResponse, { groupId: number }>({
            query: ({ groupId }) => ({
                url: `subjects/getByGroup?groupId=${groupId}`,
                method: "GET"
            }),
            keepUnusedDataFor: 0
        }),
    })
})

export const {
    useGetGroupDataQuery,
    useDeleteStudentMutation,
    useAddStudentMutation,
    useGetSubjectsQuery,
} = teacherManagementApi;