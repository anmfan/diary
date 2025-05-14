import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IGroups, IGroupsInitialState, TDelete, TEntityEditResponse, TGroupEdit} from "../types.ts";
import {
    createGroup,
    deleteGroup,
    editGroup,
    getAllGroups,
    TCreateGroupResponse,
} from "../thunks/groups-thunk.ts";
import {updateEditedEntity, updateFilteredList} from "@/redux/helper.ts";

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
                const group = action.payload

                state.items.push(group)
            })
            .addCase(createGroup.rejected, (state) => {
                state.isError = true
                state.loadingIsDone = true
            })
            .addCase(editGroup.fulfilled, (state, action: PayloadAction<TEntityEditResponse<TGroupEdit>>) => {
                state.items = updateEditedEntity<IGroups>(state.items, action.payload)
            })
    }
})

const groupsActions = groupsSlice.actions;
export {groupsSlice, groupsActions}