import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    ITeacher,
    ITeachersInitialState,
    IUserReturned,
    IUserReturnedGroupData,
    TDelete,
} from "../types.ts";
import {addGroup, createTeacher, deleteTeacher, getAllTeachers, removeGroup} from "../thunks/teachers-thunk.ts";
import {
    filterBySorterOptionsTeachers,
    updateEditedUser,
    updateFilteredList
} from "@/redux/helper.ts";
import {edit} from "@/redux/thunks/user-thunk.ts";
import {SortingOptionsTeachersValues} from "@/components/sorting-options-teachers/const.ts";

const initialState: ITeachersInitialState = {
    items: [],
    loadingIsDone: false,
    isError: false,
    sortedItems: null,
    selectedTeachersByGroup: SortingOptionsTeachersValues.All
}

const teachersSlice = createSlice({
    name: "teachers",
    initialState,
    reducers: {
        resetTeacherSlice: () => {
            return initialState
        },
        sortingTeachersByGroups: (state, action: PayloadAction<string>) => {
            filterBySorterOptionsTeachers(state, action.payload)
        }
    },
    extraReducers: builder => {
        builder
            .addCase(getAllTeachers.pending, (state) => {
                state.loadingIsDone = false
            })
            .addCase(getAllTeachers.fulfilled, (state, action: PayloadAction<ITeacher[]>) => {
                state.loadingIsDone = true
                state.items = action.payload
            })
            .addCase(getAllTeachers.rejected, (state) => {
                state.loadingIsDone = true
                state.isError = true
            })
            .addCase(deleteTeacher.fulfilled, (state, action: PayloadAction<TDelete<'teacherId'>>) => {
                state.loadingIsDone = true
                state.items = updateFilteredList(state.items, action.payload.teacherId)
                filterBySorterOptionsTeachers(state, state.selectedTeachersByGroup)
            })
            .addCase(deleteTeacher.rejected, (state) => {
                state.isError = true
                state.loadingIsDone = true
            })
            .addCase(createTeacher.fulfilled, (state, action: PayloadAction<IUserReturned<IUserReturnedGroupData>>) => {
                state.loadingIsDone = true
                const user = action.payload.userData.user

                state.items.push({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    first_name: user.firstName,
                    last_name: user.lastName,
                    avatar: user.avatar,
                    tab: "teachers",
                    curated_groups: user.group ? [user.group] : [],
                })

                filterBySorterOptionsTeachers(state, state.selectedTeachersByGroup)
            })
            .addCase(createTeacher.rejected, (state) => {
                state.loadingIsDone = true;
                state.isError = true
            })
            .addCase(edit.fulfilled, (state, action) => {
                state.items = updateEditedUser<ITeacher>(state.items, action.payload)
            })
            .addCase(addGroup.fulfilled, (state, action) => {
                const data = action.payload;

                if (data.type === 'teacher') {
                    state.items = state.items.map(teacher => {
                        const currentGroup = teacher.curated_groups ?? []
                        if (teacher.id === data.user.id) {
                            return {
                                ...teacher,
                                curated_groups: data.group
                                    ? [...currentGroup, data.group]
                                    : teacher.curated_groups
                            }
                        }
                        return teacher
                    })

                    filterBySorterOptionsTeachers(state, state.selectedTeachersByGroup)
                }
            })
            .addCase(removeGroup.fulfilled, (state, action) => {
                const data = action.payload;

                if (data.type === 'teacher') {
                    state.items = state.items.map(teacher => {
                        if (teacher.id === data.deletedId) {
                            return {
                                ...teacher,
                                curated_groups: teacher.curated_groups &&
                                    teacher.curated_groups.filter(teacherGroup => teacherGroup.name !== data.oldGroup)
                            }
                        }
                        return teacher;
                    })
                    filterBySorterOptionsTeachers(state, state.selectedTeachersByGroup)
                }
            })
    }
})

const teachersActions = teachersSlice.actions;
export {teachersSlice, teachersActions}