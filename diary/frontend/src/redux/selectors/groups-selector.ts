import {RootState} from "@/redux/types.ts";
import {createSelector} from "@reduxjs/toolkit";

export const allGroups = (state: Pick<RootState, 'groups'>) => state.groups.items;
export const selectStudentsByGroupId = (groupId: string) =>
    (state: Pick<RootState, 'groups'>) => {
        const group = state.groups.items.find(g => g.id === groupId);
        return group?.students ?? [];
    };

export const groupWithStudents = createSelector(
    (state: Pick<RootState, 'groups'>) => state.groups.items,
    items => items.filter(item => item.students.length > 0)
)
