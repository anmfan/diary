import {RootState} from "@/redux/types.ts";

export const allGroups = (state: Pick<RootState, 'groups'>) => state.groups.items;