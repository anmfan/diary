import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IGroups, IGroupsInitialState} from "../types.ts";
import {getAllGroups} from "../thunks/groups-thunk.ts";

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
    }
})

const groupsActions = groupsSlice.actions;
export {groupsSlice, groupsActions}