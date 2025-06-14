import {RootState} from "@/redux/types.ts";
import {createSelector} from "@reduxjs/toolkit";

export const allGroups = (state: Pick<RootState, 'groups'>) => state.groups.items;
export const groupsWithoutSubjects = (subjectId: number) => (state: Pick<RootState, 'groups' | 'subjects'>) => {
    const subject = state.subjects.items.find(subject => subject.id === subjectId)
    const availableGroups = subject?.assigned_groups.map(group => group.id);
    return state.groups.items.filter(group => !availableGroups?.includes(group.id))
}

export const selectStudentsByGroupId = (groupId: number) =>
    (state: Pick<RootState, 'groups'>) => {
        const group = state.groups.items.find(g => g.id === groupId);
        return group?.students ?? [];
    };

export const groupWithStudents = createSelector(
    (state: Pick<RootState, 'groups'>) => state.groups.items,
    items => items.filter(item => Array.isArray(item.students) && item.students.length > 0)
)

export const groupsWithoutCurator = createSelector(
    (state: Pick<RootState, 'groups'>) => state.groups.items,
    items => items.filter(item => Array.isArray(item.students) && !item.curator)
)

export const sortedGroupsByCurator = (state: Pick<RootState, 'groups'>) => state.groups.sortedItems;
export const selectedGroupsByCurator = (state: Pick<RootState, 'groups'>) => state.groups.selectedGroupByCurator;