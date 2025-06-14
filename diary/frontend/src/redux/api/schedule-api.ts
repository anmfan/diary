import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {AXIOS_BASE_URL, AXIOS_TIMEOUT} from "@/const.ts";
import {
    RTKQueryError, TAddMark, TAddMarkResponse,
    TArgsEntry,
    TCreatedScheduleGroups, TGetGroupSubjects, TGetMarksByStudentResponse, TGetMarksByTeacherResponse, TGetSubjectsData,
    TScheduleDeleteResponse, TScheduleEditResponse,
    TScheduleGroups
} from "@/redux/api/types.ts";
import {TEditScheduleForm} from "@/components/modal-edit-schedule/ModalEditSchedule.tsx";
import {RootState} from "@/redux/types.ts";
import {calcDateNow, getArgsGetSchedulesByGroup} from "@/redux/api/helper.ts";
import {toast} from "react-toastify";

export const scheduleApi = createApi({
    reducerPath: 'scheduleApi',
    baseQuery: fetchBaseQuery({
        baseUrl: AXIOS_BASE_URL,
        timeout: AXIOS_TIMEOUT
    }),
    endpoints: (builder) => ({
        getSchedulesByGroup: builder.query<TScheduleGroups<"teacher">[], TGetSubjectsData>({
            query: ({ groupId, weekOffset }) => {
                const params = new URLSearchParams();
                params.append("groupId", String(groupId))

                if (typeof weekOffset !== "undefined" && weekOffset !== null) {
                    params.append("weekOffset", String(weekOffset));
                }
                return `groups/get-schedule-by-group?${params}`
            },
            keepUnusedDataFor: 10
        }),
        getScheduleByTeacher: builder.query<TScheduleGroups<"student">[], { email: string | null } & Pick<TGetSubjectsData, "weekOffset">>({
            query: ({ email, weekOffset })=> `teachers/get-subjects-by-teacher?email=${email}&weekOffset=${weekOffset}`,
            keepUnusedDataFor: 10
        }),
        getMarksByStudent: builder.query<TGetMarksByStudentResponse, { email: string | null; subjectId: number | null }>({
            query: ({ email, subjectId })=> `mark/get-by-student?email=${email}&subjectId=${subjectId}`,
            keepUnusedDataFor: 10
        }),
        getGroupSubjects: builder.query<TGetGroupSubjects[], { groupId: number | null }>({
            query: ({ groupId })=> `groups/get-group-subjects?id=${groupId}`,
            keepUnusedDataFor: 10
        }),
        getMarksByTeacher: builder.query<TGetMarksByTeacherResponse, { email: string | null; groupName: string; }>({
            query: ({ email, groupName })=> `mark/get-by-teacher?email=${email}&groupName=${groupName}`,
            keepUnusedDataFor: 10
        }),
        addMark: builder.mutation<TAddMarkResponse, TAddMark>({
            query: (body) => {
                const { groupName: _, ...rest } = body;
                return {
                    url: 'mark/add',
                    method: 'POST',
                    body: rest,
                };
            },
            async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
                try {
                    const { data: newMark } = await queryFulfilled;

                    const email = (getState() as RootState).user.user.email;
                    const { groupName } = arg;

                    dispatch(
                        scheduleApi.util.updateQueryData("getMarksByTeacher", { email, groupName }, (draft) => {
                            let studentIndex = draft.students.findIndex(s => s.studentId === newMark.studentId);

                            if (studentIndex === -1) {
                                draft.students.push({
                                    studentId: newMark.studentId,
                                    studentName: '',
                                    subjects: []
                                });
                                studentIndex = draft.students.length - 1;
                            }

                            const student = draft.students[studentIndex];
                            let subjectIndex = student.subjects.findIndex(
                                s => s.subjectId === newMark.subjectId
                            );

                            if (subjectIndex === -1) {
                                student.subjects.push({
                                    subjectId: newMark.subjectId,
                                    subjectName: '',
                                    marks: []
                                });
                                subjectIndex = student.subjects.length - 1;
                            }

                            const subject = student.subjects[subjectIndex];
                            subject.marks.push({
                                value: newMark.mark,
                                date: newMark.date
                            });
                        })
                    )
                } catch (e) {
                    const error = e as RTKQueryError;
                    toast.error(error.error?.data?.message || "Ошибка при добавлении оценки");
                }
            }
        }),
        createSchedule: builder.mutation<TCreatedScheduleGroups, FormData>({
            query: (body) => ({
                url: `groups/create-schedule`,
                method: "POST",
                body
            }),
            async onQueryStarted(body, { dispatch, queryFulfilled, getState }) {
                const groupIdRaw = body.get("groupId");
                const groupId = groupIdRaw ? Number(groupIdRaw) : undefined;
                if (!groupId) return;

                try {
                    const { data } = await queryFulfilled;
                    const createdLessons = data.createdSchedules;

                    const state = getState() as RootState;
                    const entries = Object.values(state.scheduleApi.queries) as TArgsEntry[];

                    for (const entry of entries) {
                        if (entry?.endpointName !== "getSchedulesByGroup") continue;
                        const args = entry.originalArgs;
                        if (!args || args.groupId !== groupId) continue;

                        const { weekOffset = 0 } = args;

                        const lessonsForThisWeek = calcDateNow(createdLessons, weekOffset)

                        if (lessonsForThisWeek.length > 0) {
                            dispatch(
                                scheduleApi.util.updateQueryData("getSchedulesByGroup", { groupId, weekOffset }, (draft) => {
                                    createdLessons.forEach((newItem) => {
                                        const existingIndex = draft.findIndex((lesson) => (
                                            lesson.date === newItem.date &&
                                                lesson.groupId === newItem.groupId &&
                                                lesson.lesson_number === newItem.lesson_number
                                        ))
                                        if (existingIndex !== -1) {
                                            draft[existingIndex] = newItem;
                                        } else {
                                            draft.push(newItem);
                                        }
                                    })
                                })
                            );
                        }
                    }
                } catch (e) {
                    const error = e as RTKQueryError
                    toast.error(error.error?.data?.message || "Ошибка при создании расписания")
                }
            }
        }),
        deleteSchedule: builder.mutation<TScheduleDeleteResponse, Omit<TEditScheduleForm, "classroom" | "lesson_number"> & { groupId: number | null }>({
            query: (body) => ({
                url: `groups/delete-schedule`,
                method: "DELETE",
                body
            }),
            async onQueryStarted(body, { dispatch, queryFulfilled }) {
                const { groupId, weekOffset } = body;

                const deleteResult = dispatch(
                    scheduleApi.util.updateQueryData("getSchedulesByGroup", { groupId, weekOffset }, (draft) => {
                        const dayIndex = draft.findIndex(
                            (item) =>
                                item.date === body.selectedDay &&
                                item.subjectId === Number(body.selectedSubjectId)
                        )
                        if (dayIndex !== -1) {
                            draft.splice(dayIndex, 1);
                        }
                    })
                )
                try {
                    await queryFulfilled;
                } catch {
                    deleteResult.undo();
                }
            }
        }),
        editSchedule: builder.mutation<TScheduleEditResponse, TEditScheduleForm & Pick<TGetSubjectsData, "groupId">>({
            query: (body) => ({
                url: `groups/edit-schedule`,
                method: "POST",
                body
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled, getState }) {
                const { groupId, weekOffset } = getArgsGetSchedulesByGroup(getState as () => RootState);

                try {
                    const { data: { lesson } } = await queryFulfilled;

                    dispatch(
                        scheduleApi.util.updateQueryData("getSchedulesByGroup", { groupId, weekOffset }, (draft) => {
                            const dayIndex = draft.findIndex(
                                (item) =>
                                    item.date === lesson.date &&
                                    item.subjectId === Number(lesson.subjectId) &&
                                    item.lesson_number === lesson.lesson_number &&
                                    item.groupId === lesson.groupId
                            )
                            if (dayIndex !== -1) {
                                draft[dayIndex].classroom = lesson.classroom
                            }
                        })
                    )
                } catch (e) {
                    const error = e as RTKQueryError
                    toast.error(error.error?.data?.message || "Ошибка при редактировании расписания")
                }
            }
        })
    })
})

export const {
    useGetSchedulesByGroupQuery,
    useCreateScheduleMutation,
    useDeleteScheduleMutation,
    useEditScheduleMutation,
    useGetScheduleByTeacherQuery,
    useGetMarksByStudentQuery,
    useGetMarksByTeacherQuery,
    useAddMarkMutation,
    useGetGroupSubjectsQuery
} = scheduleApi