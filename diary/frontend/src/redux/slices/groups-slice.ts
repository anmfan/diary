import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IGroups, IGroupsInitialState, TDelete, TDeleteItemResponse, TEntityEditResponse, TGroupEdit} from "../types.ts";
import {
    createGroup,
    deleteGroup,
    editGroup,
    getAllGroups,
    TCreateGroupResponse, unpinStudentFromGroup,
} from "../thunks/groups-thunk.ts";
import {updateEditedEntity, updateFilteredList, updateForUnpinStudentFromGroup} from "@/redux/helper.ts";

const initialState: IGroupsInitialState = {
    items: [],
    loadingIsDone: false,
    isError: false,
}

const groupsSlice = createSlice({
    name: "groups",
    initialState,
    reducers: {},
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
            })
            .addCase(deleteGroup.rejected, (state) => {
                state.isError = true
                state.loadingIsDone = true
            })
            .addCase(createGroup.fulfilled, (state, action: PayloadAction<TCreateGroupResponse>) => {
                state.loadingIsDone = true
                state.items.push(action.payload)
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
            })
            .addCase(unpinStudentFromGroup.rejected, (state) => {
                state.isError = true
                state.loadingIsDone = true
            })
    }
})

const groupsActions = groupsSlice.actions;
export {groupsSlice, groupsActions}