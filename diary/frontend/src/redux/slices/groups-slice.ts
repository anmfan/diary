import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    IGroups,
    IGroupsInitialState,
    IUserReturned, IUserReturnedGroupData,
    TDelete,
    TDeleteItemResponse,
    TEntityEditResponse,
    TGroupEdit
} from "../types.ts";
import {
    createGroup,
    deleteGroup,
    editGroup,
    getAllGroups,
    TCreateGroupResponse, unpinStudentFromGroup,
} from "../thunks/groups-thunk.ts";
import {
    filterBySorterOptionsGroups,
    updateEditedEntity,
    updateFilteredList,
    updateForUnpinStudentFromGroup, updateGroup,
    updateStudentsCountInGroup
} from "@/redux/helper.ts";
import {createStudent, deleteStudent} from "@/redux/thunks/students-thunk.ts";
import {SortingOptionsGroupsValues} from "@/components/sorting-options-groups/const.ts";
import {edit, register} from "@/redux/thunks/user-thunk.ts";
import {addGroup, createTeacher} from "@/redux/thunks/teachers-thunk.ts";

const initialState: IGroupsInitialState = {
    items: [],
    loadingIsDone: false,
    isError: false,
    sortedItems: null,
    selectedGroupByCurator: SortingOptionsGroupsValues.All
}

const groupsSlice = createSlice({
    name: "groups",
    initialState,
    reducers: {
        sortingGroupsByCurator: (state, action: PayloadAction<string>) => {
            filterBySorterOptionsGroups(state, action.payload)
        }
    },
    extraReducers: builder => {
        builder
            .addCase(getAllGroups.pending, (state) => {
                state.loadingIsDone = false
            })
            .addCase(getAllGroups.fulfilled, (state, action: PayloadAction<IGroups[]>) => {
                state.loadingIsDone = true
                state.items = action.payload
            })
            .addCase(getAllGroups.rejected, (state) => {
                state.loadingIsDone = true
                state.isError = true
            })
            .addCase(deleteGroup.fulfilled, (state, action: PayloadAction<TDelete<'groupId'>>) => {
                state.loadingIsDone = true
                state.items = updateFilteredList(state.items, action.payload.groupId)
                filterBySorterOptionsGroups(state, state.selectedGroupByCurator)
            })
            .addCase(deleteGroup.rejected, (state) => {
                state.isError = true
                state.loadingIsDone = true
            })
            .addCase(createGroup.fulfilled, (state, action: PayloadAction<TCreateGroupResponse>) => {
                state.loadingIsDone = true
                state.items = [...state.items, {...action.payload, students: []}]
                filterBySorterOptionsGroups(state, state.selectedGroupByCurator)
            })
            .addCase(createGroup.rejected, (state) => {
                state.isError = true
                state.loadingIsDone = true
            })
            .addCase(editGroup.fulfilled, (state, action: PayloadAction<TEntityEditResponse<TGroupEdit>>) => {
                state.items = updateEditedEntity<IGroups>(state.items, action.payload)
            })
            .addCase(unpinStudentFromGroup.fulfilled, (state, action: PayloadAction<TDeleteItemResponse>) => {
                const { studentsGroup, deletedStudentId, students_count } = action.payload;

                state.items = state.items.map(group => {
                    if (group.id === studentsGroup) {
                        return updateForUnpinStudentFromGroup(group, students_count, deletedStudentId)
                    }
                    return group;
                });
                filterBySorterOptionsGroups(state, state.selectedGroupByCurator)
            })
            .addCase(unpinStudentFromGroup.rejected, (state) => {
                state.isError = true
                state.loadingIsDone = true
            })
            .addCase(deleteStudent.fulfilled, (state, action) => {
                if (action.payload.data.groupName) {
                    state.items = updateStudentsCountInGroup(state.items, action.payload.data)
                }
            })
            .addCase(createStudent.fulfilled, (state, action) => {
                const data = action.payload.userData.user;

                if (action.payload.userData.user.groupStudentCount) {
                    state.items = state.items.map(group => {
                        if (group.name === data.group) {
                            return {
                                ...group,
                                students_count: data.groupStudentCount,
                                students: [
                                    ...group.students,
                                    {
                                        user_id: String(data.id),
                                        user: {
                                            first_name: data.firstName,
                                            last_name: data.lastName,
                                            email: data.lastName
                                        }
                                    }
                                ]
                            }
                        }
                        return group
                    })
                }
            })
            .addCase(edit.fulfilled, (state, action) => {
                const data = action.payload;

                state.items =  state.items.map(group => {
                    const editedStudent = group.students.findIndex(student => student.user_id === data.user.id)
                    if (editedStudent !== -1) {
                        const updatedStudents = [...group.students]
                        updatedStudents[editedStudent] = {
                            ...updatedStudents[editedStudent],
                            user: {
                                first_name: data.user.first_name,
                                last_name: data.user.last_name,
                                email: data.user.email,
                            }
                        }

                        return {
                            ...group,
                            students: updatedStudents
                        };
                    }

                    if (group.curator?.user_id === data.user.id) {
                        return {
                            ...group,
                            curator: {
                                ...group.curator,
                                user: {
                                    ...group.curator.user,
                                    first_name: data.user.first_name,
                                    last_name: data.user.last_name,
                                    email: data.user.email,
                                }
                            }
                        };
                    }
                    return group
                })
            })
            .addCase(createTeacher.fulfilled, (state, action) => {
                const data = action.payload.userData.user;

                if (data.group !== null) {
                    state.items = updateGroup(state.items, data)
                }
            })
            .addCase(addGroup.fulfilled, (state, action) => {
                const data = action.payload;

                state.items = state.items.map(group => {
                    if (group.name === data.group.name) {
                        if (data.type === 'student') {
                            return {
                                ...group,
                                students_count: Number(data.students_count),
                                students: [
                                    ...group.students,
                                    {
                                        user_id: data.user.id,
                                        user: {
                                            first_name: data.user.first_name,
                                            last_name: data.user.last_name,
                                            email: data.user.email,
                                        }
                                    }
                                ]
                            }
                        }
                        if (data.type === 'teacher') {
                            return {
                                ...group,
                                students_count: Number(group.students_count),
                                curator: {
                                    user_id: String(data.user.id),
                                    user: {
                                        first_name: data.user.first_name,
                                        last_name: data.user.last_name,
                                        email: data.user.email,
                                    }
                                }
                            }
                        }
                    }
                    return group
                })
                filterBySorterOptionsGroups(state, state.selectedGroupByCurator)
            })
            .addCase(register.fulfilled, (state, action: PayloadAction<IUserReturned<IUserReturnedGroupData | null>>) => {
                const data = action.payload.userData.user;
                if (data.group) {
                    state.items = updateGroup(state.items, data)
                }
            })
    }
})

const groupsActions = groupsSlice.actions;
export {groupsSlice, groupsActions}