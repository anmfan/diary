import {TArgsEntry, TScheduleGroups} from "@/redux/api/types.ts";
import {RootState} from "@/redux/types.ts";

export const calcDateNow = (createdLessons: TScheduleGroups<"teacher">[], weekOffset: number) => {
    const now = new Date();
    const monday = new Date(now);
    const today = now.getDay();
    monday.setDate(monday.getDate() - (today === 0 ? 6 : today - 1) + weekOffset * 7);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    return createdLessons.filter((lesson) => {
        const date = new Date(lesson.date);
        return date >= monday && date <= sunday;
    })
}

export const getArgsGetSchedulesByGroup = (getState: () => RootState): { groupId: number | null; weekOffset?: number } => {
    const state = getState();

    const selectedItem = state.user.selectedItem;
    const groupId = selectedItem === null ? null : selectedItem.id;

    const entries = Object.values(state.scheduleApi.queries) as TArgsEntry[];

    const matchingEntry = entries.find(
        (entry) =>
            entry?.endpointName === "getSchedulesByGroup" &&
            entry.originalArgs?.groupId === groupId
    )
    const weekOffset = matchingEntry?.originalArgs?.weekOffset

    return { groupId, weekOffset }
}