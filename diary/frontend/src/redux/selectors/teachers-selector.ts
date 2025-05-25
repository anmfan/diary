import {RootState} from "../types.ts";


export const allTeachers = (state: Pick<RootState, 'teachers'>) => state.teachers.items;
export const sortedTeacherByGroup = (state: Pick<RootState, 'teachers'>) => state.teachers.sortedItems;
export const selectedTeachersByGroup = (state: Pick<RootState, 'teachers'>) => state.teachers.selectedTeachersByGroup;