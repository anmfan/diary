import {RootState} from "../types.ts";

export const allStudents = (state: Pick<RootState, 'students'>) => state.students.items;
export const sortedStudentsByGroup = (state: Pick<RootState, 'students'>) => state.students.sortedItems;
export const selectedStudentsByGroup = (state: Pick<RootState, 'students'>) => state.students.selectedStudentsByGroup;