import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AXIOS_BASE_URL, AXIOS_TIMEOUT } from "@/const.ts";
import { IGroups, IUserReturned, RootState } from "@/redux/types.ts";
import {
    RTKQueryError,
    TAddStudentToGroup, TAddStudentToGroupResponse,
    TDeleteStudent,
    TDeleteStudentId,
    TGetGroupDataByCuratorEmail, TGetGroupsAndSubjectsByTeacher, TGetSubjectsResponse
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
        getGroupData: builder.query<IGroups[] | null, TGetGroupDataByCuratorEmail>({
            query: ({ email }) => `groups/getOne?email=${email}`,
            keepUnusedDataFor: 10
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
                        if (!draft) return;

                        for (const group of draft) {
                            const studentIndex = group.students.findIndex(student => student.user_id === user_id);

                            if (studentIndex !== -1) {
                                group.students = group.students.filter(student => student.user_id !== user_id);
                                group.students_count -= 1;
                                break;
                            }
                        }

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

                    console.log('data', data)
                    if ("userData" in data) {
                        const newStudent = data.userData.user

                        dispatch(
                            teacherManagementApi.util.updateQueryData('getGroupData', { email }, (draft) => {
                                if (!draft) return

                                for (const group of draft) {
                                    if (data.userData.user.group === group.name) {
                                        group.students_count += 1;
                                        updateNewStudentsList(newStudent, group.students)
                                        break;
                                    }
                                }
                            })
                        )
                    }

                    if ("results" in data) {
                        const newStudents = data.results

                        dispatch(
                            teacherManagementApi.util.updateQueryData('getGroupData', { email }, (draft) => {
                                if (!draft) return;

                                newStudents.forEach(student => {
                                    let newStudentCount = 0;

                                    if (student.tokens) {
                                        newStudentCount++

                                        for (const group of draft) {
                                            if (student.user.group === group.name) {
                                                group.students.push({
                                                    user_id: student.user.id,
                                                    user: {
                                                        first_name: student.user.firstName,
                                                        last_name: student.user.lastName,
                                                        email: student.user.email
                                                    }
                                                })
                                                group.students_count += newStudentCount;
                                                break;
                                            }
                                        }
                                    }
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
        getSubjects: builder.query<TGetSubjectsResponse, { groupIds: number[] }>({
            query: ({ groupIds }) => ({
                url: `subjects/getByGroup?groupIds=${groupIds.join(",")}`,
                method: "GET"
            }),
            keepUnusedDataFor: 10
        }),
        getGroupsAndSubjectByTeacher: builder.query<TGetGroupsAndSubjectsByTeacher[], { teacherEmail: string }>({
            query: ({ teacherEmail }) => ({
                url: `subjects/getTaughtGroupsByTeacher?teacherEmail=${teacherEmail}`,
                method: "GET"
            }),
            keepUnusedDataFor: 10
        }),
    })
})

export const {
    useGetGroupDataQuery,
    useDeleteStudentMutation,
    useAddStudentMutation,
    useGetSubjectsQuery,
    useGetGroupsAndSubjectByTeacherQuery,
} = teacherManagementApi;