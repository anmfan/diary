import {RootState} from "../types.ts";

export const allStudents = (state: Pick<RootState, 'students'>) => state.students.items;