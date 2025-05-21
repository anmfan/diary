import {RootState} from "@/redux/types.ts";

export const allSubjects = (state: Pick<RootState, 'subjects'>) => state.subjects.items;